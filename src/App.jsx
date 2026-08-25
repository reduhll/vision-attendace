import { useState } from "react";

function App() {
  const [page, setPage] = useState("login");
  const [verified, setVerified] = useState(false);

  const styles = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-width: 100%;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #f4f7fb;
      color: #1f2937;
    }

    #root {
      width: 100%;
      min-height: 100vh;
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 7px;
      padding: 11px 18px;
      font-size: 14px;
    }

    .primary {
      background: #2563eb;
      color: white;
    }

    .secondary {
      background: #e5e7eb;
      color: #1f2937;
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
      background: #eef3f8;
    }

    .login-box {
      width: 380px;
      background: white;
      padding: 40px;
      border-radius: 14px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    }

    .login-box h1 {
      margin-bottom: 5px;
      color: #173b57;
    }

    .login-box p {
      color: #6b7280;
      margin-bottom: 25px;
    }

    input {
      width: 100%;
      padding: 12px;
      margin: 8px 0;
      border: 1px solid #d1d5db;
      border-radius: 7px;
    }

    .login-box button {
      width: 100%;
      margin-top: 15px;
    }

    header {
      background: #173b57;
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
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
      margin: 25px 0;
    }

    .card {
      background: white;
      padding: 22px;
      border-radius: 10px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.06);
    }

    .card h2 {
      margin: 0;
      color: #173b57;
      font-size: 30px;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .panel {
      background: white;
      padding: 28px;
      border-radius: 12px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.07);
      margin-top: 20px;
    }

    .verify-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
    }

    .camera {
      height: 320px;
      background: #111827;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      margin-bottom: 15px;
    }

    .success {
      background: #ecfdf5;
      border-left: 5px solid #16a34a;
      padding: 20px;
      border-radius: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: white;
    }

    th {
      background: #173b57;
      color: white;
    }

    th, td {
      padding: 13px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    @media(max-width: 800px) {
      .cards {
        grid-template-columns: 1fr 1fr;
      }

      .verify-layout {
        grid-template-columns: 1fr;
      }
    }
  `;

  function Header() {
    return (
      <header>
        <h2>VisionAttend</h2>

        <div>
          <button onClick={() => setPage("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("records")}>
            Records
          </button>

          <button onClick={() => setPage("login")}>
            Logout
          </button>
        </div>
      </header>
    );
  }

  if (page === "login") {
    return (
      <>
        <style>{styles}</style>

        <div className="login-page">
          <div className="login-box">
            <h1>VisionAttend</h1>

            <p>
              Automated Vision-Based Attendance
              and Identity Verification System
            </p>

            <input type="email" placeholder="Lecturer Email" />

            <input type="password" placeholder="Password" />

            <button
              className="primary"
              onClick={() => setPage("dashboard")}
            >
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  if (page === "dashboard") {
    return (
      <>
        <style>{styles}</style>

        <Header />

        <main className="page">
          <h1>Lecturer Dashboard</h1>

          <p>
            ITS320 - Capstone Experience
          </p>

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

          <div className="actions">
            <button
              className="primary"
              onClick={() => {
                setVerified(false);
                setPage("verify");
              }}
            >
              Start Attendance
            </button>

            <button
              className="secondary"
              onClick={() => setPage("records")}
            >
              View Attendance Records
            </button>
          </div>
        </main>
      </>
    );
  }

  if (page === "verify") {
    return (
      <>
        <style>{styles}</style>

        <Header />

        <main className="page">
          <h1>Student Identity Verification</h1>

          <div className="verify-layout">
            <div className="panel">
              <div className="camera">
                LIVE CAMERA PREVIEW
              </div>

              <button
                className="primary"
                onClick={() => setVerified(true)}
              >
                Verify Student
              </button>
            </div>

            <div className="panel">
              {!verified ? (
                <>
                  <h2>Waiting for Verification</h2>

                  <p>
                    Position the student in front of
                    the camera to begin facial recognition.
                  </p>

                  <p>
                    Status: Waiting...
                  </p>
                </>
              ) : (
                <div className="success">
                  <h2>✓ Identity Verified</h2>

                  <p>
                    <strong>Student:</strong> Sample Student
                  </p>

                  <p>
                    <strong>Student ID:</strong> S2600001
                  </p>

                  <p>
                    <strong>Course:</strong> ITS320
                  </p>

                  <p>
                    <strong>Status:</strong> Present
                  </p>

                  <p>
                    <strong>Confidence:</strong> 96%
                  </p>

                  <button
                    className="primary"
                    onClick={() => setPage("records")}
                  >
                    View Attendance Record
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (page === "records") {
    return (
      <>
        <style>{styles}</style>

        <Header />

        <main className="page">
          <h1>Attendance Records</h1>

          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Time</th>
                <th>Status</th>
                <th>Verification</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>S2600001</td>
                <td>Sample Student</td>
                <td>10:21 AM</td>
                <td>Present</td>
                <td>Verified</td>
              </tr>

              <tr>
                <td>S2600002</td>
                <td>Student Two</td>
                <td>10:24 AM</td>
                <td>Present</td>
                <td>Verified</td>
              </tr>

              <tr>
                <td>S2600003</td>
                <td>Student Three</td>
                <td>-</td>
                <td>Absent</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </main>
      </>
    );
  }
}

export default App;