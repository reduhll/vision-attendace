import cv2
import time
from pathlib import Path


# -----------------------------
# PATHS
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent

DETECTION_MODEL = (
    BASE_DIR
    / "models"
    / "face_detection_yunet_2023mar.onnx"
)


# -----------------------------
# SETTINGS
# -----------------------------

TURN_THRESHOLD = 0.18

# Number of consecutive frames required
HOLD_FRAMES = 8

# Seconds allowed after baseline
TIME_LIMIT = 15


# -----------------------------
# FACE DETECTOR
# -----------------------------

detector = cv2.FaceDetectorYN_create(
    str(DETECTION_MODEL),
    "",
    (320, 320),
    0.9,
    0.3,
    5000
)


# -----------------------------
# CAMERA
# -----------------------------

camera = cv2.VideoCapture(0)

if not camera.isOpened():
    raise SystemExit("Could not open webcam.")


print()
print("======================================")
print("VisionAttend Liveness Test")
print("======================================")
print()
print("1. Look straight at the camera.")
print("2. Turn your head to one side.")
print("3. Then turn your head to the other side.")
print()
print("Press Q or ESC to quit.")
print()


# -----------------------------
# VARIABLES
# -----------------------------

baseline_samples = []
baseline_offset = None

baseline_start = time.time()

challenge_start = None

stage = "BASELINE"

first_direction = None

hold_count = 0

liveness_passed = False


# -----------------------------
# MAIN LOOP
# -----------------------------

while True:

    ok, frame = camera.read()

    if not ok:
        break

    # Mirror camera
    frame = cv2.flip(frame, 1)

    height, width = frame.shape[:2]

    detector.setInputSize(
        (width, height)
    )

    _, faces = detector.detect(frame)

    message = "No face detected"

    status_colour = (255, 255, 255)


    # -----------------------------
    # EXACTLY ONE FACE
    # -----------------------------

    if faces is not None and len(faces) == 1:

        face = faces[0]

        x = int(face[0])
        y = int(face[1])
        w = int(face[2])
        h = int(face[3])

        # YuNet landmarks
        right_eye_x = face[4]
        right_eye_y = face[5]

        left_eye_x = face[6]
        left_eye_y = face[7]

        nose_x = face[8]
        nose_y = face[9]


        # Draw face box
        cv2.rectangle(
            frame,
            (x, y),
            (x + w, y + h),
            (255, 255, 255),
            2
        )


        # Draw eyes + nose
        cv2.circle(
            frame,
            (int(right_eye_x), int(right_eye_y)),
            4,
            (255, 255, 255),
            -1
        )

        cv2.circle(
            frame,
            (int(left_eye_x), int(left_eye_y)),
            4,
            (255, 255, 255),
            -1
        )

        cv2.circle(
            frame,
            (int(nose_x), int(nose_y)),
            4,
            (255, 255, 255),
            -1
        )


        # -----------------------------
        # NORMALIZED NOSE POSITION
        # -----------------------------

        eye_midpoint_x = (
            right_eye_x + left_eye_x
        ) / 2

        eye_distance = abs(
            left_eye_x - right_eye_x
        )


        if eye_distance > 0:

            nose_offset = (
                nose_x - eye_midpoint_x
            ) / eye_distance


            # -----------------------------
            # STAGE 1: BASELINE
            # -----------------------------

            if stage == "BASELINE":

                message = "Look straight at camera..."

                baseline_samples.append(
                    nose_offset
                )

                # Collect baseline for 2 seconds
                if time.time() - baseline_start >= 2:

                    baseline_offset = (
                        sum(baseline_samples)
                        / len(baseline_samples)
                    )

                    stage = "FIRST_TURN"

                    challenge_start = time.time()

                    baseline_samples.clear()

                    print(
                        f"Baseline recorded: "
                        f"{baseline_offset:.3f}"
                    )

                    print(
                        "Turn your head to one side."
                    )


            # -----------------------------
            # TIME LIMIT
            # -----------------------------

            elif (
                challenge_start is not None
                and
                time.time() - challenge_start
                > TIME_LIMIT
                and
                not liveness_passed
            ):

                stage = "FAILED"

                message = "LIVENESS FAILED - TIMEOUT"

                status_colour = (0, 0, 255)


            # -----------------------------
            # STAGE 2: FIRST TURN
            # -----------------------------

            elif stage == "FIRST_TURN":

                movement = (
                    nose_offset - baseline_offset
                )

                message = (
                    "Turn your head to one side"
                )


                # Turn in positive direction
                if movement >= TURN_THRESHOLD:

                    if first_direction in (
                        None,
                        "POSITIVE"
                    ):

                        first_direction = "POSITIVE"

                        hold_count += 1

                    else:

                        hold_count = 0


                # Turn in negative direction
                elif movement <= -TURN_THRESHOLD:

                    if first_direction in (
                        None,
                        "NEGATIVE"
                    ):

                        first_direction = "NEGATIVE"

                        hold_count += 1

                    else:

                        hold_count = 0

                else:

                    hold_count = 0


                if hold_count >= HOLD_FRAMES:

                    print()
                    print(
                        "First head turn detected."
                    )

                    print(
                        "Now turn to the opposite side."
                    )

                    stage = "SECOND_TURN"

                    hold_count = 0


            # -----------------------------
            # STAGE 3: OPPOSITE TURN
            # -----------------------------

            elif stage == "SECOND_TURN":

                movement = (
                    nose_offset - baseline_offset
                )

                message = (
                    "Now turn to the opposite side"
                )


                # First turn was positive,
                # now require negative
                if (
                    first_direction == "POSITIVE"
                    and
                    movement <= -TURN_THRESHOLD
                ):

                    hold_count += 1


                # First turn was negative,
                # now require positive
                elif (
                    first_direction == "NEGATIVE"
                    and
                    movement >= TURN_THRESHOLD
                ):

                    hold_count += 1

                else:

                    hold_count = 0


                # -----------------------------
                # PASS
                # -----------------------------

                if hold_count >= HOLD_FRAMES:

                    stage = "PASSED"

                    liveness_passed = True

                    message = "LIVENESS PASSED"

                    status_colour = (0, 255, 0)

                    total_time = (
                        time.time()
                        - challenge_start
                    )

                    print()
                    print(
                        "LIVENESS PASSED"
                    )

                    print(
                        f"Challenge time: "
                        f"{total_time:.2f} seconds"
                    )


            elif stage == "PASSED":

                message = "LIVENESS PASSED"

                status_colour = (0, 255, 0)


            elif stage == "FAILED":

                message = "LIVENESS FAILED"

                status_colour = (0, 0, 255)


    # -----------------------------
    # MULTIPLE FACES
    # -----------------------------

    elif faces is not None and len(faces) > 1:

        message = "Multiple faces detected"

        status_colour = (0, 0, 255)


    # -----------------------------
    # DISPLAY MESSAGE
    # -----------------------------

    cv2.putText(
        frame,
        message,
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        status_colour,
        2
    )


    # Display current stage
    cv2.putText(
        frame,
        f"Stage: {stage}",
        (20, 75),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (255, 255, 255),
        1
    )


    cv2.imshow(
        "VisionAttend - Liveness Test",
        frame
    )


    # -----------------------------
    # EXIT
    # -----------------------------

    key = cv2.waitKey(1) & 0xFF

    if (
        key == ord("q")
        or key == ord("Q")
        or key == 27
    ):
        break


# -----------------------------
# CLEANUP
# -----------------------------

camera.release()

cv2.destroyAllWindows()