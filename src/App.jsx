import { useState } from "react";

function App() {
  const [page, setPage] = useState("role");
  const [verified, setVerified] = useState(false);
  const [verificationState, setVerificationState] = useState("waiting");
  const [sessionOpen, setSessionOpen] = useState(false);
  const [consent, setConsent] = useState(false);

  const styles = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-width: 100%;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #F3EAF8;
      color: #2F2436;
    }

    #root {
      width: 100%;
      min-height: 100vh;
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 8px;
      padding: 12px 18px;
      font-size: 14px;
      transition: 0.2s;
    }

    button:hover {
      opacity: 0.9;
    }

    .primary {
      background: #A865C9;
      color: white;
    }

    .secondary {
      background: #D9BCE8;
      color: #2F2436;
    }

    .danger {
      background: #C95D63;
      color: white;
    }

    .success-button {
      background: #4F9D69;
      color: white;
    }

    .page {
      width: 90%;
      max-width: 1100px;
      margin: 35px auto;
    }

    .login-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #F3EAF8;
      padding: 30px;
    }

    .login-box {
      width: 430px;
      background: white;
      padding: 42px;
      border-radius: 16px;
      box-shadow: 0 8px 25px rgba(86, 48, 105, 0.12);
    }

    .login-box h1 {
      margin: 0 0 8px 0;
      color: #70418C;
      font-size: 38px;
    }

    .login-box h3 {
      margin-top: 28px;
      margin-bottom: 18px;
    }

    .login-box p {
      color: #74687A;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    label {
      display: block;
      margin-top: 15px;
      margin-bottom: 6px;
      font-weight: bold;
    }

    input,
    select {
      width: 100%;
      padding: 12px;
      margin-bottom: 12px;
      border: 1px solid #D9BCE8;
      border-radius: 7px;
      font-size: 14px;
    }

    .login-box button {
      width: 100%;
      margin-top: 12px;
    }

    header {
      background: #70418C;
      color: white;
      padding: 16px 5%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    header h2 {
      margin: 0;
    }

    header button {
      background: transparent;
      color: white;
      padding: 8px 12px;
    }

    header button:hover {
      background: #8652A3;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
      margin: 25px 0;
    }

    .student-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      margin: 25px 0;
    }

    .card {
      background: white;
      padding: 22px;
      border-radius: 11px;
      box-shadow: 0 3px 12px rgba(86, 48, 105, 0.08);
    }

    .card h2 {
      margin: 0;
      color: #70418C;
      font-size: 30px;
    }

    .card p {
      margin-bottom: 0;
      color: #74687A;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 18px;
    }

    .panel {
      background: white;
      padding: 28px;
      border-radius: 12px;
      box-shadow: 0 3px 12px rgba(86, 48, 105, 0.08);
      margin-top: 20px;
    }

    .verify-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
    }

    .camera {
      height: 310px;
      background: #231A29;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      margin-bottom: 15px;
    }

    .success {
      background: #EDF8F0;
      border-left: 5px solid #4F9D69;
      padding: 20px;
      border-radius: 8px;
    }

    .warning {
      background: #FFF7E8;
      border-left: 5px solid #D49A3A;
      padding: 20px;
      border-radius: 8px;
    }

    .error {
      background: #FCEEEF;
      border-left: 5px solid #C95D63;
      padding: 20px;
      border-radius: 8px;
    }

    .info {
      background: #F3EAF8;
      border-left: 5px solid #A865C9;
      padding: 20px;
      border-radius: 8px;
    }

    .consent-box {
      background: #FAF7FC;
      border: 1px solid #D9BCE8;
      padding: 20px;
      border-radius: 8px;
      margin: 18px 0;
    }

    .consent-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .consent-row input {
      width: auto;
      margin-top: 3px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: white;
    }

    th {
      background: #70418C;
      color: white;
    }

    th,
    td {
      padding: 13px;
      text-align: left;
      border-bottom: 1px solid #E9DDF0;
    }

    tr:hover {
      background: #FAF7FC;
    }

    .tag {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 12px;
      background: #F3EAF8;
      color: #70418C;
      font-size: 12px;
      font-weight: bold;
    }

    @media(max-width: 800px) {
      .cards,
      .student-cards {
        grid-template-columns: 1fr 1fr;
      }

      .verify-layout {
        grid-template-columns: 1fr;
      }

      .login-box {
        width: 100%;
      }
    }
  `;

  function LecturerHeader() {
    return (
      <header>
        <h2>VisionAttend</h2>
        <div>
          <button onClick={() => setPage("lecturerDashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("records")}>
            Attendance
          </button>

          <button onClick={() => setPage("anomalies")}>
            Anomalies
          </button>

          <button onClick={() => setPage("role")}>
            Logout
          </button>
        </div>
      </header>
    );
  }

  function StudentHeader() {
    return (
      <header>
        <h2>VisionAttend</h2>
        <div>
          <button onClick={() => setPage("studentDashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("enrolment")}>
            Enrolment
          </button>

          <button onClick={() => setPage("myAttendance")}>
            My Attendance
          </button>

          <button onClick={() => setPage("role")}>
            Logout
          </button>
        </div>
      </header>
    );
  }

  // ACCOUNT TYPE
  if (page === "role") {
    return (
      <>
        <style>{styles}</style>

        <div className="login-page">
          <div className="login-box">
            <h1>VisionAttend</h1>

            <p>
              Automated Vision-Based Attendance and
              Identity Verification System
            </p>

            <h3>Select Account Type</h3>

            <button
              className="primary"
              onClick={() => setPage("studentLogin")}
            >
              Student Login
            </button>

            <button
              className="secondary"
              onClick={() => setPage("lecturerLogin")}
            >
              Lecturer Login
            </button>
          </div>
        </div>
      </>
    );
  }

  // STUDENT LOGIN
  if (page === "studentLogin") {
    return (
      <>
        <style>{styles}</style>

        <div className="login-page">
          <div className="login-box">
            <h1>Student Login</h1>

            <p>Access your personal attendance information.</p>

            <label>Student ID or Email</label>
            <input
              type="text"
              placeholder="Student ID or Email"
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
            />

            <button
              className="primary"
              onClick={() => setPage("studentDashboard")}
            >
              Login as Student
            </button>

            <button
              className="secondary"
              onClick={() => setPage("role")}
            >
              ← Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // LECTURER LOGIN
  if (page === "lecturerLogin") {
    return (
      <>
        <style>{styles}</style>

        <div className="login-page">
          <div className="login-box">
            <h1>Lecturer Login</h1>

            <p>Manage attendance sessions and student records.</p>

            <label>Lecturer Email</label>
            <input
              type="email"
              placeholder="Lecturer Email"
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
            />

            <button
              className="primary"
              onClick={() => setPage("lecturerDashboard")}
            >
              Login as Lecturer
            </button>

            <button
              className="secondary"
              onClick={() => setPage("role")}
            >
              ← Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // STUDENT DASHBOARD
  if (page === "studentDashboard") {
    return (
      <>
        <style>{styles}</style>
        <StudentHeader />

        <main className="page">
          <h1>Student Dashboard</h1>
          <p>Welcome, Sample Student.</p>

          <div className="student-cards">
            <div className="card">
              <h2>8</h2>
              <p>Classes Present</p>
            </div>

            <div className="card">
              <h2>1</h2>
              <p>Classes Absent</p>
            </div>

            <div className="card">
              <h2>89%</h2>
              <p>Attendance Rate</p>
            </div>
          </div>

          <div className="panel">
            <h2>ITS320 - Capstone Experience</h2>

            <p>
              Attendance verification becomes available
              when the lecturer opens the class session.
            </p>

            <div className="actions">
              <button
                className="primary"
                onClick={() => {
                  setVerified(false);
                  setVerificationState("waiting");
                  setPage("studentVerify");
                }}
              >
                Mark Attendance
              </button>

              <button
                className="secondary"
                onClick={() => setPage("myAttendance")}
              >
                View My Attendance
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // STUDENT ENROLMENT + CONSENT
  if (page === "enrolment") {
    return (
      <>
        <style>{styles}</style>
        <StudentHeader />

        <main className="page">
          <h1>Biometric Enrolment</h1>

          <div className="panel">
            <h2>Student Details</h2>

            <label>Student ID</label>
            <input value="S2600001" readOnly />

            <label>Full Name</label>
            <input value="Sample Student" readOnly />

            <div className="consent-box">
              <h3>Biometric Consent</h3>

              <p>
                Facial data will only be used for attendance
                identity verification. Access to biometric
                templates will be restricted.
              </p>

              <div className="consent-row">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />

                <span>
                  I consent to the collection and processing
                  of my facial data for attendance verification.
                </span>
              </div>
            </div>

            <button
              className="primary"
              disabled={!consent}
            >
              Capture Enrolment Images
            </button>
          </div>
        </main>
      </>
    );
  }

  // STUDENT VERIFICATION
  if (page === "studentVerify") {
    return (
      <>
        <style>{styles}</style>
        <StudentHeader />

        <main className="page">
          <h1>Attendance Verification</h1>

          <div className="verify-layout">
            <div className="panel">
              <div className="camera">
                LIVE CAMERA PREVIEW
              </div>

              <p>
                Liveness challenge:
                <strong> Turn your head to the left.</strong>
              </p>

              <div className="actions">
                <button
                  className="success-button"
                  onClick={() => {
                    setVerified(true);
                    setVerificationState("success");
                  }}
                >
                  Simulate Success
                </button>

                <button
                  className="secondary"
                  onClick={() =>
                    setVerificationState("noFace")
                  }
                >
                  No Face
                </button>

                <button
                  className="secondary"
                  onClick={() =>
                    setVerificationState("multiple")
                  }
                >
                  Multiple Faces
                </button>

                <button
                  className="danger"
                  onClick={() =>
                    setVerificationState("failed")
                  }
                >
                  Verification Failed
                </button>
              </div>
            </div>

            <div className="panel">
              {verificationState === "waiting" && (
                <div className="info">
                  <h2>Waiting for Verification</h2>
                  <p>
                    Position yourself clearly in front of the camera.
                  </p>
                </div>
              )}

              {verificationState === "noFace" && (
                <div className="warning">
                  <h2>No Face Detected</h2>
                  <p>
                    Please move closer to the camera and try again.
                  </p>
                </div>
              )}

              {verificationState === "multiple" && (
                <div className="warning">
                  <h2>Multiple Faces Detected</h2>
                  <p>
                    Only one student should be visible during verification.
                  </p>
                </div>
              )}

              {verificationState === "failed" && (
                <div className="error">
                  <h2>Verification Unsuccessful</h2>
                  <p>
                    Your attendance has not been recorded.
                  </p>
                  <p>
                    Please retry or ask the lecturer for assistance.
                  </p>
                </div>
              )}

              {verificationState === "success" && verified && (
                <div className="success">
                  <h2>✓ Identity Verified</h2>

                  <p>
                    Your attendance has been successfully recorded.
                  </p>

                  <p><strong>Course:</strong> ITS320</p>
                  <p><strong>Status:</strong> Present</p>
                  <p><strong>Time:</strong> 10:21 AM</p>

                  {/* Confidence is intentionally hidden from students */}

                  <button
                    className="primary"
                    onClick={() => setPage("myAttendance")}
                  >
                    View My Attendance
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  // STUDENT RECORDS
  if (page === "myAttendance") {
    return (
      <>
        <style>{styles}</style>
        <StudentHeader />

        <main className="page">
          <h1>My Attendance</h1>

          <p>
            Only your own attendance information is available here.
          </p>

          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Week</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>ITS320</td>
                <td>Week 5</td>
                <td>10:18 AM</td>
                <td>Present</td>
              </tr>

              <tr>
                <td>ITS320</td>
                <td>Week 6</td>
                <td>10:21 AM</td>
                <td>Present</td>
              </tr>

              <tr>
                <td>ITS320</td>
                <td>Week 7</td>
                <td>10:21 AM</td>
                <td>Present</td>
              </tr>
            </tbody>
          </table>
        </main>
      </>
    );
  }

  // LECTURER DASHBOARD
  if (page === "lecturerDashboard") {
    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Lecturer Dashboard</h1>

          <p>ITS320 - Capstone Experience</p>

          <div className="cards">
            <div className="card">
              <h2>32</h2>
              <p>Total Students</p>
            </div>

            <div className="card">
              <h2>27</h2>
              <p>Present</p>
            </div>

            <div className="card">
              <h2>5</h2>
              <p>Absent</p>
            </div>

            <div className="card">
              <h2>2</h2>
              <p>Verification Issues</p>
            </div>
          </div>

          <div className="panel">
            <h2>Session Management</h2>

            <p>
              Current Session:
              <strong>
                {sessionOpen ? " Open" : " Closed"}
              </strong>
            </p>

            <div className="actions">
              <button
                className="primary"
                onClick={() => setSessionOpen(true)}
              >
                Open Attendance Session
              </button>

              <button
                className="secondary"
                onClick={() => {
                  setVerificationState("waiting");
                  setVerified(false);
                  setPage("lecturerVerify");
                }}
              >
                Verification Monitor
              </button>

              <button
                className="secondary"
                onClick={() => setPage("records")}
              >
                Attendance Records
              </button>

              <button
                className="secondary"
                onClick={() => setPage("anomalies")}
              >
                Review Anomalies
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // LECTURER VERIFICATION
  if (page === "lecturerVerify") {
    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Verification Monitor</h1>

          <div className="verify-layout">
            <div className="panel">
              <div className="camera">
                LIVE CAMERA PREVIEW
              </div>

              <button
                className="primary"
                onClick={() => {
                  setVerified(true);
                  setVerificationState("success");
                }}
              >
                Simulate Verified Student
              </button>
            </div>

            <div className="panel">
              {!verified ? (
                <div className="info">
                  <h2>Waiting for Student</h2>
                  <p>No verification result available yet.</p>
                </div>
              ) : (
                <div className="success">
                  <h2>✓ Identity Verified</h2>

                  <p><strong>Student:</strong> Sample Student</p>
                  <p><strong>Student ID:</strong> S2600001</p>
                  <p><strong>Course:</strong> ITS320</p>
                  <p><strong>Status:</strong> Present</p>

                  <p>
                    <strong>Confidence:</strong> 96%
                  </p>

                  <span className="tag">
                    Lecturer-only technical information
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  // ATTENDANCE RECORDS
  if (page === "records") {
    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Attendance Records</h1>

          <p>
            Restricted lecturer access.
          </p>

          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Session</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>S2600001</td>
                <td>Sample Student</td>
                <td>Week 7</td>
                <td>10:21 AM</td>
                <td>Present</td>
              </tr>

              <tr>
                <td>S2600002</td>
                <td>Student Two</td>
                <td>Week 7</td>
                <td>10:24 AM</td>
                <td>Present</td>
              </tr>

              <tr>
                <td>S2600003</td>
                <td>Student Three</td>
                <td>Week 7</td>
                <td>-</td>
                <td>Not Recorded</td>
              </tr>
            </tbody>
          </table>

          <p>
            Database rule planned:
            <strong> one attendance record per student per session.</strong>
          </p>
        </main>
      </>
    );
  }

  // ANOMALY REVIEW
  if (page === "anomalies") {
    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Verification Anomalies</h1>

          <div className="panel">
            <h3>Attempt #A001</h3>

            <p><strong>Student ID:</strong> S2600004</p>
            <p><strong>Issue:</strong> Low recognition confidence</p>
            <p><strong>Status:</strong> Pending lecturer review</p>

            <div className="actions">
              <button className="success-button">
                Confirm Attendance
              </button>

              <button className="danger">
                Reject Attempt
              </button>
            </div>
          </div>

          <div className="panel">
            <h3>Attempt #A002</h3>

            <p><strong>Student ID:</strong> Unknown</p>
            <p><strong>Issue:</strong> Multiple faces detected</p>
            <p><strong>Status:</strong> Review required</p>
          </div>
        </main>
      </>
    );
  }

  return null;
}

export default App;