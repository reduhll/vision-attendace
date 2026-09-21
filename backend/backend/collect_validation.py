import argparse
from pathlib import Path
import cv2

parser = argparse.ArgumentParser(
    description="Collect validation face images for VisionAttend."
)

parser.add_argument(
    "participant_id",
    help="Participant code such as P01 or P02"
)

parser.add_argument(
    "--count",
    type=int,
    default=10,
    help="Number of validation images"
)

args = parser.parse_args()

output_dir = (
    Path(__file__).parent
    / "data"
    / "validation"
    / args.participant_id
)

output_dir.mkdir(parents=True, exist_ok=True)

camera = cv2.VideoCapture(0)

if not camera.isOpened():
    raise SystemExit("Could not open webcam.")

face_detector = cv2.CascadeClassifier(
    cv2.data.haarcascades
    + "haarcascade_frontalface_default.xml"
)

saved = 0

print("VisionAttend Validation Capture")
print("Press SPACE to save.")
print("Press Q to quit.")

while saved < args.count:

    ok, frame = camera.read()

    if not ok:
        break

    gray = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80)
    )

    status = "Position one face in frame"

    if len(faces) == 1:

        x, y, w, h = faces[0]

        cv2.rectangle(
            frame,
            (x, y),
            (x + w, y + h),
            (255, 255, 255),
            2
        )

        status = "Face detected - press SPACE"

    elif len(faces) > 1:

        status = "Multiple faces detected"

    cv2.putText(
        frame,
        f"{status} | Saved {saved}/{args.count}",
        (15, 35),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (255, 255, 255),
        2
    )

    cv2.imshow(
        "VisionAttend - Validation Capture",
        frame
    )

    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        break

    if key == 32 and len(faces) == 1:

        x, y, w, h = faces[0]

        margin = int(0.15 * max(w, h))

        x1 = max(0, x - margin)
        y1 = max(0, y - margin)

        x2 = min(
            frame.shape[1],
            x + w + margin
        )

        y2 = min(
            frame.shape[0],
            y + h + margin
        )

        face = frame[y1:y2, x1:x2]

        if face.size == 0:
            continue

        face = cv2.resize(
            face,
            (160, 160)
        )

        saved += 1

        filename = (
            output_dir
            / f"{args.participant_id}_val_{saved:03d}.jpg"
        )

        cv2.imwrite(
            str(filename),
            face
        )

        print(f"Saved {filename}")

camera.release()
cv2.destroyAllWindows()

print(
    f"Finished. Saved {saved} validation images."
)