from pathlib import Path
import cv2
import numpy as np


# -----------------------------
# PATHS
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "models"

ENROLLMENT_DIR = (
    BASE_DIR
    / "data"
    / "enrollment"
    / "P01"
)

VALIDATION_DIR = (
    BASE_DIR
    / "data"
    / "validation"
    / "P01"
)

DETECTOR_MODEL = (
    MODEL_DIR
    / "face_detection_yunet_2023mar.onnx"
)

RECOGNITION_MODEL = (
    MODEL_DIR
    / "face_recognition_sface_2021dec.onnx"
)


# -----------------------------
# INITIAL THRESHOLD
# -----------------------------

# Provisional starting threshold.
# We will later calibrate this using
# Redelle + Rupesh validation results.

THRESHOLD = 0.363


# -----------------------------
# LOAD MODELS
# -----------------------------

detector = cv2.FaceDetectorYN_create(
    str(DETECTOR_MODEL),
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


# -----------------------------
# GET FACE EMBEDDING
# -----------------------------

def get_embedding(image_path):

    image = cv2.imread(str(image_path))

    if image is None:
        print(f"Could not read: {image_path.name}")
        return None

    height, width = image.shape[:2]

    detector.setInputSize(
        (width, height)
    )

    _, faces = detector.detect(image)

    if faces is None:
        print(
            f"{image_path.name}: "
            "No face detected"
        )
        return None

    if len(faces) != 1:
        print(
            f"{image_path.name}: "
            f"{len(faces)} faces detected"
        )
        return None

    face = faces[0]

    aligned_face = recognizer.alignCrop(
        image,
        face
    )

    feature = recognizer.feature(
        aligned_face
    )

    feature = feature.flatten().astype(
        np.float32
    )

    norm = np.linalg.norm(feature)

    if norm == 0:
        return None

    return feature / norm


# -----------------------------
# CREATE ENROLMENT TEMPLATE
# -----------------------------

print("\nVisionAttend")
print("P01 Facial Verification Test")
print("-" * 45)

enrollment_embeddings = []

image_extensions = (
    "*.jpg",
    "*.jpeg",
    "*.png"
)

for extension in image_extensions:

    for image_path in sorted(
        ENROLLMENT_DIR.glob(extension)
    ):

        embedding = get_embedding(
            image_path
        )

        if embedding is not None:

            enrollment_embeddings.append(
                embedding
            )

            print(
                f"Enrolment loaded: "
                f"{image_path.name}"
            )


if len(enrollment_embeddings) == 0:

    raise SystemExit(
        "\nNo valid enrolment faces found."
    )


# Average all enrolment embeddings

reference_embedding = np.mean(
    enrollment_embeddings,
    axis=0
)

reference_embedding = (
    reference_embedding
    / np.linalg.norm(reference_embedding)
)


print(
    f"\nCreated P01 template from "
    f"{len(enrollment_embeddings)} images."
)


# -----------------------------
# VALIDATION
# -----------------------------

print("\nVALIDATION RESULTS")
print("-" * 45)

total = 0
matches = 0

validation_files = []

for extension in image_extensions:

    validation_files.extend(
        VALIDATION_DIR.glob(extension)
    )


for image_path in sorted(
    validation_files
):

    test_embedding = get_embedding(
        image_path
    )

    if test_embedding is None:
        continue

    # Cosine similarity
    similarity = float(
        np.dot(
            reference_embedding,
            test_embedding
        )
    )

    if similarity >= THRESHOLD:

        result = "MATCH"
        matches += 1

    else:

        result = "NO MATCH"

    total += 1

    print(
        f"\n{image_path.name}"
    )

    print(
        f"Similarity: "
        f"{similarity:.4f}"
    )

    print(
        f"Result: {result}"
    )


# -----------------------------
# SUMMARY
# -----------------------------

print("\n" + "=" * 45)
print("VALIDATION SUMMARY")
print("=" * 45)

print(
    f"Participant: P01"
)

print(
    f"Threshold: {THRESHOLD}"
)

print(
    f"Validation attempts: {total}"
)

print(
    f"Matches: {matches}"
)

if total > 0:

    success_rate = (
        matches / total
    ) * 100

    print(
        f"Verification success rate: "
        f"{success_rate:.2f}%"
    )

print("=" * 45)