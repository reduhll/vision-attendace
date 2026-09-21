VISIONATTEND - OPENCV STARTER

1. From the project root, create a virtual environment:
   python -m venv .venv

2. Activate it on Windows CMD:
   .venv\Scripts\activate.bat

   Or PowerShell:
   .venv\Scripts\Activate.ps1

3. Install packages:
   python -m pip install --upgrade pip
   python -m pip install -r backend\requirements.txt

4. Test the camera + basic face detection:
   python backend\camera_test.py

   Press Q to quit.

5. Collect enrolment samples for a consenting participant:
   python backend\collect_faces.py P01 --count 20

   Press SPACE to save a detected face.
   Press Q to stop.

IMPORTANT:
- Use pseudonymous participant codes such as P01/P02 in the image folders.
- Do not put real student IDs in image filenames.
- Do not commit biometric images, embeddings, or the local participant mapping to GitHub.
- Keep enrolment, validation, and final test captures separate.
- This starter uses OpenCV Haar face detection only to get the camera/data collection pipeline working.
  The final detector/recognition model can be upgraded later.
