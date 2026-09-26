import cv2
import numpy as np
import sys
import time
from pathlib import Path


# -----------------------------
# PARTICIPANTS
# -----------------------------

if len(sys.argv) < 2:
    print("Usage:")
    print("Same person: python validate_participant.py P01")
    print("Cross person: python validate_participant.py P01 P03")
    sys.exit()

enrolment_code = sys.argv[1].upper()

# If no second participant is supplied,
# validate against the same participant.
validation_code = (
    sys.argv[2].upper()
    if len(sys.argv) >= 3
    else enrolment_code
)


# -----------------------------
# PATHS
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent

ENROLMENT_DIR = (
    BASE_DIR / "data" / "enrollment" / enrolment_code
)

VALIDATION_DIR = (
    BASE_DIR / "data" / "validation" / validation_code
)

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


# -----------------------------
# MODELS
# -----------------------------

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


# Current prototype threshold
THRESHOLD = 0.363


# -----------------------------
# GET FACE EMBEDDING
# -----------------------------

def get_embedding(image_path):

    image = cv2.imread(str(image_path))

    if image is None:
        print(f"Could not read: {image_path.name}")
        return None

    height, width = image.shape[:2]

    detector.setInputSize((width, height))

    _, faces = detector.detect(image)

    if faces is None or len(faces) == 0:
        print(f"No face detected: {image_path.name}")
        return None

    # Use first detected face
    face = faces[0]

    aligned_face = recognizer.alignCrop(
        image,
        face
    )

    embedding = recognizer.feature(
        aligned_face
    )

    # Normalize embedding
    embedding = embedding.flatten()

    norm = np.linalg.norm(embedding)

    if norm == 0:
        return None

    return embedding / norm


# -----------------------------
# HEADER
# -----------------------------

print()
print("======================================")
print("VisionAttend")
print("Facial Verification Test")
print("======================================")
print()

print(f"Enrolment participant: {enrolment_code}")
print(f"Validation participant: {validation_code}")
print()


# -----------------------------
# CREATE ENROLMENT TEMPLATE
# -----------------------------

enrolment_embeddings = []

for image_path in sorted(
    ENROLMENT_DIR.glob("*.jpg")
):

    embedding = get_embedding(image_path)

    if embedding is None:
        continue

    enrolment_embeddings.append(
        embedding
    )

    print(
        f"Enrolment loaded: {image_path.name}"
    )


if len(enrolment_embeddings) == 0:

    print(
        "\nNo valid enrolment images found."
    )

    sys.exit()


# Average enrolment embeddings
template = np.mean(
    enrolment_embeddings,
    axis=0
)

template = (
    template
    / np.linalg.norm(template)
)

print()
print(
    f"Created {enrolment_code} template "
    f"from {len(enrolment_embeddings)} images."
)


# -----------------------------
# VALIDATION
# -----------------------------

print()
print("VALIDATION RESULTS")
print("--------------------------------------")

attempts = 0
matches = 0
no_matches = 0
verification_times = []


for image_path in sorted(
    VALIDATION_DIR.glob("*.jpg")
):

    # Start timing verification
    start_time = time.perf_counter()

    embedding = get_embedding(image_path)

    if embedding is None:
        continue

    attempts += 1

    # Calculate cosine similarity
    similarity = float(
        np.dot(template, embedding)
    )

    # Compare with threshold
    if similarity >= THRESHOLD:

        result = "MATCH"
        matches += 1

    else:

        result = "NO MATCH"
        no_matches += 1

    # Stop timing
    end_time = time.perf_counter()

    verification_time = (
        end_time - start_time
    )

    verification_times.append(
        verification_time
    )

    print()
    print(image_path.name)
    print(
        f"Similarity: {similarity:.4f}"
    )
    print(
        f"Result: {result}"
    )
    print(
        f"Verification time: "
        f"{verification_time:.4f} seconds"
    )


# -----------------------------
# SUMMARY
# -----------------------------

print()
print("======================================")
print("VALIDATION SUMMARY")
print("======================================")

print(
    f"Enrolment template: {enrolment_code}"
)

print(
    f"Validation images: {validation_code}"
)

print(
    f"Threshold: {THRESHOLD}"
)

print(
    f"Validation attempts: {attempts}"
)

print(
    f"Matches: {matches}"
)

print(
    f"No matches: {no_matches}"
)


if attempts > 0:

    match_rate = (
        matches / attempts
    ) * 100

    print(
        f"Match rate: {match_rate:.2f}%"
    )


if verification_times:

    average_time = (
        sum(verification_times)
        / len(verification_times)
    )

    fastest_time = min(
        verification_times
    )

    slowest_time = max(
        verification_times
    )

    print(
        f"Average verification time: "
        f"{average_time:.4f} seconds"
    )

    print(
        f"Fastest verification time: "
        f"{fastest_time:.4f} seconds"
    )

    print(
        f"Slowest verification time: "
        f"{slowest_time:.4f} seconds"
    )