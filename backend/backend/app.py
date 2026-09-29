from flask import Flask, jsonify, request
from flask_cors import CORS
from pathlib import Path

import cv2
import numpy as np
import time
import base64

app = Flask(__name__)
CORS(app)


# --------------------------------
# PATHS
# --------------------------------

BASE_DIR = Path(__file__).resolve().parent

DETECTION_MODEL = (
    BASE_DIR
    / "models"
    / "face_detection_yunet_2023mar.onnx"
)

RECOGNITION_MODEL = (
    BASE_DIR
    / "models"
    / "face_recognition_sface_2021dec.onnx"
)

THRESHOLD = 0.363


# --------------------------------
# MODELS
# --------------------------------

detector = cv2.FaceDetectorYN_create(
    str(DETECTION_MODEL),
    "",
    (320, 320),
    0.9,
    0.3,
    5000
)

recognizer = cv2.FaceRecognizerSF_create(
    str(RECOGNITION_MODEL),
    ""
)


# --------------------------------
# FACE EMBEDDING
# --------------------------------

def get_embedding(image_path):

    image = cv2.imread(str(image_path))

    if image is None:
        return None

    height, width = image.shape[:2]

    detector.setInputSize(
        (width, height)
    )

    _, faces = detector.detect(image)

    if faces is None or len(faces) == 0:
        return None

    face = faces[0]

    aligned_face = recognizer.alignCrop(
        image,
        face
    )

    embedding = recognizer.feature(
        aligned_face
    )

    embedding = embedding.flatten()

    norm = np.linalg.norm(embedding)

    if norm == 0:
        return None

    return embedding / norm

def get_embedding_from_image(image):

    if image is None:
        return None

    height, width = image.shape[:2]

    detector.setInputSize((width, height))

    _, faces = detector.detect(image)

    if faces is None or len(faces) == 0:
        return None

    # Reject multiple faces
    if len(faces) > 1:
        return "MULTIPLE"

    face = faces[0]

    aligned_face = recognizer.alignCrop(
        image,
        face
    )

    embedding = recognizer.feature(
        aligned_face
    )

    embedding = embedding.flatten()

    norm = np.linalg.norm(embedding)

    if norm == 0:
        return None

    return embedding / norm


# --------------------------------
# CREATE TEMPLATE
# --------------------------------

def create_template(participant_code):

    enrolment_dir = (
        BASE_DIR
        / "data"
        / "enrollment"
        / participant_code
    )

    embeddings = []

    for image_path in sorted(
        enrolment_dir.glob("*.jpg")
    ):

        embedding = get_embedding(
            image_path
        )

        if embedding is not None:
            embeddings.append(embedding)

    if len(embeddings) == 0:
        return None

    template = np.mean(
        embeddings,
        axis=0
    )

    template = (
        template
        / np.linalg.norm(template)
    )

    return template


# --------------------------------
# STATUS API
# --------------------------------

@app.route("/api/status", methods=["GET"])
def status():

    return jsonify({
        "status":
        "VisionAttend backend running"
    })


# --------------------------------
# REAL VERIFICATION API
# --------------------------------

@app.route("/api/verify", methods=["POST"])
def verify():

    data = request.get_json() or {}

    enrolment_code = (
        data.get(
            "enrolment_code",
            "P01"
        ).upper()
    )

    validation_code = (
        data.get(
            "validation_code",
            enrolment_code
        ).upper()
    )


    template = create_template(
        enrolment_code
    )

    if template is None:

        return jsonify({
            "result": "ERROR",
            "message":
            "No enrolment template found"
        }), 400


    validation_dir = (
        BASE_DIR
        / "data"
        / "validation"
        / validation_code
    )


    results = []

    matches = 0
    no_matches = 0


    for image_path in sorted(
        validation_dir.glob("*.jpg")
    ):

        start_time = (
            time.perf_counter()
        )

        embedding = get_embedding(
            image_path
        )

        if embedding is None:
            continue


        similarity = float(
            np.dot(
                template,
                embedding
            )
        )


        if similarity >= THRESHOLD:

            result = "MATCH"
            matches += 1

        else:

            result = "NO MATCH"
            no_matches += 1


        verification_time = (
            time.perf_counter()
            - start_time
        )


        results.append({
            "image": image_path.name,
            "similarity":
                round(similarity, 4),
            "result": result,
            "verification_time":
                round(
                    verification_time,
                    4
                )
        })


    attempts = len(results)


    if attempts == 0:

        return jsonify({
            "result": "ERROR",
            "message":
            "No validation images found"
        }), 400


    average_time = (
        sum(
            item[
                "verification_time"
            ]
            for item in results
        )
        / attempts
    )


    overall_result = (
        "VERIFIED"
        if matches > 0
        else "ANOMALY"
    )


    return jsonify({

        "result":
            overall_result,

        "enrolment_code":
            enrolment_code,

        "validation_code":
            validation_code,

        "threshold":
            THRESHOLD,

        "attempts":
            attempts,

        "matches":
            matches,

        "no_matches":
            no_matches,

        "average_time":
            round(
                average_time,
                4
            ),

        "details":
            results
    })


# --------------------------------
# RUN SERVER
# --------------------------------


@app.route("/api/verify-live", methods=["POST"])
def verify_live():

    data = request.get_json() or {}

    enrolment_code = data.get(
        "enrolment_code",
        "P01"
    ).upper()

    image_data = data.get("image")

    if not image_data:
        return jsonify({
            "result": "ERROR",
            "message": "No camera image received"
        }), 400

    try:
        # Remove data:image/jpeg;base64,
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]

        image_bytes = base64.b64decode(
            image_data
        )

        image_array = np.frombuffer(
            image_bytes,
            dtype=np.uint8
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

    except Exception:
        return jsonify({
            "result": "ERROR",
            "message": "Could not decode camera image"
        }), 400


    start_time = time.perf_counter()

    live_embedding = get_embedding_from_image(
        image
    )

    if live_embedding == "MULTIPLE":
        return jsonify({
            "result": "MULTIPLE_FACES",
            "message": "Multiple faces detected"
        })

    if live_embedding is None:
        return jsonify({
            "result": "NO_FACE",
            "message": "No face detected"
        })


    template = create_template(
        enrolment_code
    )

    if template is None:
        return jsonify({
            "result": "ERROR",
            "message": "No enrolment template found"
        }), 400


    similarity = float(
        np.dot(
            template,
            live_embedding
        )
    )

    verification_time = (
        time.perf_counter()
        - start_time
    )


    if similarity >= THRESHOLD:

        result = "VERIFIED"

    else:

        result = "ANOMALY"
    
    print(
    f"LIVE VERIFY | participant={enrolment_code} "
    f"| similarity={similarity:.4f} "
    f"| threshold={THRESHOLD} "
    f"| result={result}"
       )


    return jsonify({
        "result": result,
        "similarity": round(
            similarity,
            4
        ),
        "threshold": THRESHOLD,
        "verification_time": round(
            verification_time,
            4
        )
    })

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )