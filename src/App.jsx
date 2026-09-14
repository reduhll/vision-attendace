import { useState } from "react";

function App() {
  const [page, setPage] = useState("role");
  const [verificationState, setVerificationState] = useState("waiting");
  const [sessionOpen, setSessionOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [enrolmentCaptured, setEnrolmentCaptured] = useState(false);
  const [optOutSubmitted, setOptOutSubmitted] = useState(false);

  // Lecturer dashboard filters
  const [selectedUnit, setSelectedUnit] = useState("ITS320");
  const [selectedDate, setSelectedDate] = useState("2026-09-08");
  const [statsMode, setStatsMode] = useState("weekly");
  const [selectedWeek, setSelectedWeek] = useState("Week 9");

  // Mock data for Week 9 prototype. Backend/database will replace these later.
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      studentId: "S2600001",
      name: "Sample Student",
      unit: "ITS320",
      week: "Week 9",
      date: "08/09/2026",
      time: "10:21 AM",
      status: "Present",
    },
    {
      studentId: "S2400909",
      name: "Samjhana Thapa",
      unit: "ITS320",
      week: "Week 9",
      date: "08/09/2026",
      time: "-",
      status: "Pending Review",
    },
    {
      studentId: "S2600789",
      name: "Redelle Baylosis",
      unit: "ITS320",
      week: "Week 9",
      date: "08/09/2026",
      time: "10:24 AM",
      status: "Present",
    },
  ]);

  const [anomalies, setAnomalies] = useState([
    {
      id: "A001",
      studentId: "S2400909",
      name: "Samjhana Thapa",
      unit: "ITS320",
      issue: "Low recognition confidence",
      time: "3:18 PM",
      status: "Pending",
    },
    {
      id: "A002",
      studentId: "S2600789",
      name: "Redelle Baylosis",
      unit: "ITS320",
      issue: "Liveness challenge failed",
      time: "3:20 PM",
      status: "Pending",
    },
  ]);

  const [optOutStudents, setOptOutStudents] = useState([]);
  const [statAdjustments, setStatAdjustments] = useState({
    ITS320: { present: 0, absent: 0 },
    ITS204: { present: 0, absent: 0 },
    ITS106: { present: 0, absent: 0 },
  });

  const statsData = {
    ITS320: {
      weekly: { total: 32, present: 27, absent: 3, anomalies: 2, rate: 84 },
      specific: { total: 32, present: 26, absent: 4, anomalies: 2, rate: 81 },
      cumulative: { total: 32, present: 286, absent: 34, anomalies: 8, rate: 89 },
    },
    ITS204: {
      weekly: { total: 28, present: 24, absent: 3, anomalies: 1, rate: 86 },
      specific: { total: 28, present: 23, absent: 4, anomalies: 1, rate: 82 },
      cumulative: { total: 28, present: 244, absent: 36, anomalies: 6, rate: 87 },
    },
    ITS106: {
      weekly: { total: 30, present: 26, absent: 3, anomalies: 1, rate: 87 },
      specific: { total: 30, present: 25, absent: 4, anomalies: 1, rate: 83 },
      cumulative: { total: 30, present: 263, absent: 37, anomalies: 5, rate: 88 },
    },
  };

  const baseStats = statsData[selectedUnit][statsMode];
  const unitAdjustment = statAdjustments[selectedUnit];
  const stats = {
    ...baseStats,
    present: baseStats.present + unitAdjustment.present,
    absent: Math.max(0, baseStats.absent + unitAdjustment.absent),
    anomalies: anomalies.filter(
      (item) => item.unit === selectedUnit && item.status === "Pending"
    ).length,
  };

  const styles = `
    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-width: 100%;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #F3EAF8;
      color: #2F2436;
    }

    #root { width: 100%; min-height: 100vh; }

    button {
      cursor: pointer;
      border: none;
      border-radius: 8px;
      padding: 12px 18px;
      font-size: 14px;
      transition: 0.2s;
    }

    button:hover { opacity: 0.9; }
    button:disabled { opacity: 0.45; cursor: not-allowed; }

    .primary { background: #A865C9; color: white; }
    .secondary { background: #D9BCE8; color: #2F2436; }
    .danger { background: #C95D63; color: white; }
    .success-button { background: #4F9D69; color: white; }

    .page {
      width: 90%;
      max-width: 1150px;
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
      width: 440px;
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

    .login-box h3 { margin-top: 28px; margin-bottom: 18px; }
    .login-box p { color: #74687A; line-height: 1.5; margin-bottom: 24px; }
    .login-box button { width: 100%; margin-top: 12px; }

    label {
      display: block;
      margin-top: 15px;
      margin-bottom: 6px;
      font-weight: bold;
    }

    input, select, textarea {
      width: 100%;
      padding: 12px;
      margin-bottom: 12px;
      border: 1px solid #D9BCE8;
      border-radius: 7px;
      font-size: 14px;
      font-family: Arial, sans-serif;
    }

    textarea { min-height: 100px; resize: vertical; }

    header {
      background: #70418C;
      color: white;
      padding: 16px 5%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    header h2 { margin: 0; }
    header button { background: transparent; color: white; padding: 8px 12px; }
    header button:hover { background: #8652A3; }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 18px;
      margin: 25px 0;
    }

    .card {
      background: white;
      padding: 22px;
      border-radius: 11px;
      box-shadow: 0 3px 12px rgba(86, 48, 105, 0.08);
    }

    .card h2 { margin: 0; color: #70418C; font-size: 30px; }
    .card p { margin-bottom: 0; color: #74687A; }

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

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      align-items: end;
    }

    .filters label { margin-top: 0; }

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
      text-align: center;
      padding: 20px;
    }

    .success { background: #EDF8F0; border-left: 5px solid #4F9D69; padding: 20px; border-radius: 8px; }
    .warning { background: #FFF7E8; border-left: 5px solid #D49A3A; padding: 20px; border-radius: 8px; }
    .error { background: #FCEEEF; border-left: 5px solid #C95D63; padding: 20px; border-radius: 8px; }
    .info { background: #F3EAF8; border-left: 5px solid #A865C9; padding: 20px; border-radius: 8px; }

    .consent-box {
      background: #FAF7FC;
      border: 1px solid #D9BCE8;
      padding: 20px;
      border-radius: 8px;
      margin: 18px 0;
    }

    .consent-row { display: flex; align-items: flex-start; gap: 10px; }
    .consent-row input { width: auto; margin-top: 3px; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: white;
    }

    th { background: #70418C; color: white; }
    th, td { padding: 13px; text-align: left; border-bottom: 1px solid #E9DDF0; }
    tr:hover { background: #FAF7FC; }

    .tag {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 12px;
      background: #F3EAF8;
      color: #70418C;
      font-size: 12px;
      font-weight: bold;
    }

    .status-confirmed { color: #287642; font-weight: bold; }
    .status-pending { color: #B07819; font-weight: bold; }
    .status-rejected { color: #B34047; font-weight: bold; }

    .small-note { color: #74687A; font-size: 13px; }

    @media(max-width: 800px) {
      .verify-layout { grid-template-columns: 1fr; }
      .login-box { width: 100%; }
      header { align-items: flex-start; }
    }
  `;

  function LecturerHeader() {
    return (
      <header>
        <h2>VisionAttend</h2>
        <div>
          <button onClick={() => setPage("lecturerDashboard")}>Dashboard</button>
          <button onClick={() => setPage("records")}>Attendance</button>
          <button onClick={() => setPage("anomalies")}>Anomalies</button>
          <button onClick={() => setPage("optOutList")}>Opt-Out List</button>
          <button onClick={() => setPage("role")}>Logout</button>
        </div>
      </header>
    );
  }

  function StudentHeader() {
    return (
      <header>
        <h2>VisionAttend</h2>
        <div>
          <button onClick={() => setPage("studentDashboard")}>Dashboard</button>
          <button onClick={() => setPage("enrolment")}>Enrolment</button>
          <button onClick={() => setPage("myAttendance")}>My Attendance</button>
          <button onClick={() => setPage("help")}>Help / Contact</button>
          <button onClick={() => setPage("role")}>Logout</button>
        </div>
      </header>
    );
  }

  function AdminHeader() {
    return (
      <header>
        <h2>VisionAttend Admin</h2>
        <div>
          <button onClick={() => setPage("adminDashboard")}>Dashboard</button>
          <button onClick={() => setPage("role")}>Logout</button>
        </div>
      </header>
    );
  }

  function handleConfirmAnomaly(id) {
    const anomaly = anomalies.find((item) => item.id === id);
    if (!anomaly || anomaly.status !== "Pending") return;

    setAnomalies((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Confirmed" } : item
      )
    );

    setAttendanceRecords((current) => {
      const existing = current.find(
        (record) =>
          record.studentId === anomaly.studentId &&
          record.unit === anomaly.unit &&
          record.week === selectedWeek
      );

      if (existing) {
        return current.map((record) =>
          record.studentId === anomaly.studentId && record.unit === anomaly.unit
            ? { ...record, status: "Present", time: anomaly.time }
            : record
        );
      }

      return [
        ...current,
        {
          studentId: anomaly.studentId,
          name: anomaly.name,
          unit: anomaly.unit,
          week: selectedWeek,
          date: selectedDate,
          time: anomaly.time,
          status: "Present",
        },
      ];
    });

    setStatAdjustments((current) => ({
      ...current,
      [anomaly.unit]: {
        present: current[anomaly.unit].present + 1,
        absent: current[anomaly.unit].absent - 1,
      },
    }));
  }

  function handleRejectAnomaly(id) {
    setAnomalies((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Rejected" } : item
      )
    );
  }

  function addDemoAnomaly(type) {
    const testMap = {
      lowConfidence: {
        studentId: "S2400909",
        name: "Samjhana Thapa",
        issue: "Low recognition confidence",
      },
      multipleFaces: {
        studentId: "S2600789",
        name: "Redelle Baylosis",
        issue: "Multiple faces detected",
      },
      livenessFailed: {
        studentId: "S2400909",
        name: "Samjhana Thapa",
        issue: "Liveness challenge failed",
      },
      unknownFace: {
        studentId: "Unknown",
        name: "Unknown Person",
        issue: "Face not matched to an enrolled student",
      },
    };

    const test = testMap[type];
    const newId = `A${String(anomalies.length + 1).padStart(3, "0")}`;

    setAnomalies((current) => [
      ...current,
      {
        id: newId,
        studentId: test.studentId,
        name: test.name,
        unit: selectedUnit,
        issue: test.issue,
        time: "Demo Test",
        status: "Pending",
      },
    ]);
  }

  // ACCOUNT TYPE
  if (page === "role") {
    return (
      <>
        <style>{styles}</style>
        <div className="login-page">
          <div className="login-box">
            <h1>VisionAttend</h1>
            <p>Automated Vision-Based Attendance and Identity Verification System</p>
            <h3>Select Account Type</h3>

            <button className="primary" onClick={() => setPage("studentLogin")}>
              Student Login
            </button>
            <button className="secondary" onClick={() => setPage("lecturerLogin")}>
              Lecturer Login
            </button>
            <button className="secondary" onClick={() => setPage("adminLogin")}>
              Administrator Login
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
            <input type="text" placeholder="Student ID or Email" />

            <label>Password</label>
            <input type="password" placeholder="Password" />

            <button
              className="primary"
              onClick={() => {
                setConsent(false);
                setPage("studentConsent");
              }}
            >
              Login as Student
            </button>

            <button className="secondary" onClick={() => setPage("role")}>
              ← Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // CONSENT / PRIVACY NOTICE AT THE START
  if (page === "studentConsent") {
    return (
      <>
        <style>{styles}</style>
        <div className="login-page">
          <div className="login-box">
            <h1>Biometric Consent</h1>
            <p>
              Before using VisionAttend, please review how facial data will be used
              for attendance identity verification.
            </p>

            <div className="consent-box">
              <h3>Privacy Notice</h3>
              <p>
                VisionAttend will collect facial images and create a facial template
                for identity verification during attendance. Biometric information is
                intended only for the attendance prototype and should have restricted access.
              </p>
              <p>
                Students who do not wish to use biometric verification can request an
                alternative attendance method through Help / Contact.
              </p>

              <div className="consent-row">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                <span>
                  I understand the notice and consent to the collection and processing
                  of my facial data for attendance verification.
                </span>
              </div>
            </div>

            <button
              className="primary"
              disabled={!consent}
              onClick={() => {
                setConsentAccepted(true);
                setPage("studentDashboard");
              }}
            >
              Accept and Continue
            </button>

            <button className="secondary" onClick={() => setPage("help")}>
              I Prefer an Alternative Attendance Method
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
            <p>Manage attendance sessions, units and verification records.</p>

            <label>Lecturer Email</label>
            <input type="email" placeholder="Lecturer Email" />

            <label>Password</label>
            <input type="password" placeholder="Password" />

            <button className="primary" onClick={() => setPage("lecturerDashboard")}>
              Login as Lecturer
            </button>
            <button className="secondary" onClick={() => setPage("role")}>
              ← Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // ADMIN LOGIN
  if (page === "adminLogin") {
    return (
      <>
        <style>{styles}</style>
        <div className="login-page">
          <div className="login-box">
            <h1>Administrator Login</h1>
            <p>Prototype access for managing lecturer/unit assignments.</p>

            <label>Admin Email</label>
            <input type="email" placeholder="Admin Email" />

            <label>Password</label>
            <input type="password" placeholder="Password" />

            <button className="primary" onClick={() => setPage("adminDashboard")}>
              Login as Administrator
            </button>
            <button className="secondary" onClick={() => setPage("role")}>
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

          {!consentAccepted && (
            <div className="warning">
              <strong>Biometric consent has not been completed.</strong>
            </div>
          )}

          <div className="cards">
            <div className="card"><h2>8</h2><p>Classes Present</p></div>
            <div className="card"><h2>1</h2><p>Classes Absent</p></div>
            <div className="card"><h2>89%</h2><p>Attendance Rate</p></div>
          </div>

          <div className="panel">
            <h2>ITS320 - Capstone Experience</h2>
            <p>Attendance verification becomes available when the lecturer opens the class session.</p>

            <div className="actions">
              <button
                className="primary"
                onClick={() => {
                  setVerificationState("waiting");
                  setPage("studentVerify");
                }}
              >
                Mark Attendance
              </button>
              <button className="secondary" onClick={() => setPage("myAttendance")}>
                View My Attendance
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // FACE ENROLMENT (CONSENT IS NO LONGER HERE)
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

            <div className="info">
              <strong>Consent status:</strong> {consentAccepted ? "Accepted" : "Not completed"}
            </div>

            <div className="actions">
              <button
                className="primary"
                disabled={!consentAccepted}
                onClick={() => setEnrolmentCaptured(true)}
              >
                Capture Enrolment Images
              </button>
            </div>

            {enrolmentCaptured && (
              <div className="success" style={{ marginTop: "18px" }}>
                <strong>Prototype:</strong> enrolment images captured successfully.
              </div>
            )}
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
                LIVE CAMERA PREVIEW<br />
                (OpenCV camera will replace this prototype area)
              </div>

              <p><strong>Liveness challenge:</strong> Turn your head to the left.</p>
              <p className="small-note">
                Week 9 validation will use consenting group members to test real-person,
                wrong-person and spoof/error cases.
              </p>

              <div className="actions">
                <button className="success-button" onClick={() => setVerificationState("success")}>
                  Demo Success
                </button>
                <button className="secondary" onClick={() => setVerificationState("noFace")}>
                  No Face
                </button>
                <button className="secondary" onClick={() => setVerificationState("multiple")}>
                  Multiple Faces
                </button>
                <button className="danger" onClick={() => setVerificationState("livenessFailed")}>
                  Liveness Failed
                </button>
                <button className="danger" onClick={() => setVerificationState("failed")}>
                  Low Confidence
                </button>
              </div>
            </div>

            <div className="panel">
              {verificationState === "waiting" && (
                <div className="info">
                  <h2>Waiting for Verification</h2>
                  <p>Position yourself clearly in front of the camera.</p>
                </div>
              )}

              {verificationState === "noFace" && (
                <div className="warning">
                  <h2>No Face Detected</h2>
                  <p>Please move closer to the camera and try again.</p>
                </div>
              )}

              {verificationState === "multiple" && (
                <div className="warning">
                  <h2>Multiple Faces Detected</h2>
                  <p>Only one student should be visible during verification.</p>
                </div>
              )}

              {verificationState === "livenessFailed" && (
                <div className="error">
                  <h2>Liveness Check Failed</h2>
                  <p>The requested head movement was not detected. Please retry.</p>
                </div>
              )}

              {verificationState === "failed" && (
                <div className="error">
                  <h2>Verification Unsuccessful</h2>
                  <p>The face did not meet the recognition threshold.</p>
                  <p>Your attendance has not been recorded. Ask the lecturer for assistance if needed.</p>
                </div>
              )}

              {verificationState === "success" && (
                <div className="success">
                  <h2>✓ Identity Verified</h2>
                  <p>Your attendance has been successfully recorded.</p>
                  <p><strong>Course:</strong> ITS320</p>
                  <p><strong>Status:</strong> Present</p>
                  <p><strong>Time:</strong> 10:21 AM</p>
                  <p className="small-note">Recognition confidence is hidden from the student view.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  // STUDENT ATTENDANCE
  if (page === "myAttendance") {
    const ownRecords = attendanceRecords.filter((record) => record.studentId === "S2600001");

    return (
      <>
        <style>{styles}</style>
        <StudentHeader />

        <main className="page">
          <h1>My Attendance</h1>
          <p>Only your own attendance information is available here.</p>

          <table>
            <thead>
              <tr>
                <th>Unit</th>
                <th>Week</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ownRecords.map((record) => (
                <tr key={`${record.studentId}-${record.unit}-${record.week}`}>
                  <td>{record.unit}</td>
                  <td>{record.week}</td>
                  <td>{record.date}</td>
                  <td>{record.time}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </>
    );
  }

  // HELP / CONTACT + ALTERNATIVE ATTENDANCE FORM
  if (page === "help") {
    return (
      <>
        <style>{styles}</style>
        {consentAccepted ? <StudentHeader /> : null}

        <main className="page">
          <h1>Help / Contact</h1>

          <div className="panel">
            <h2>Alternative Attendance Request</h2>
            <p>
              Students who do not wish to use biometric verification can submit this form
              to request an alternative attendance method. The lecturer can view submitted requests.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setOptOutSubmitted(true);
                setOptOutStudents((current) => {
                  if (current.some((student) => student.studentId === "S2600001")) return current;
                  return [
                    ...current,
                    {
                      studentId: "S2600001",
                      name: "Sample Student",
                      unit: "ITS320",
                      status: "Alternative attendance requested",
                    },
                  ];
                });
              }}
            >
              <label>Student ID</label>
              <input value="S2600001" readOnly />

              <label>Name</label>
              <input value="Sample Student" readOnly />

              <label>Unit</label>
              <select defaultValue="ITS320">
                <option>ITS320</option>
                <option>ITS204</option>
                <option>ITS106</option>
              </select>

              <label>Reason / Notes</label>
              <textarea placeholder="Optional information for the lecturer" />

              <button className="primary" type="submit">
                Submit Alternative Attendance Request
              </button>
            </form>

            {optOutSubmitted && (
              <div className="success" style={{ marginTop: "18px" }}>
                Request submitted. The lecturer can now view it in the Opt-Out List.
              </div>
            )}

            {!consentAccepted && (
              <div className="actions">
                <button className="secondary" onClick={() => setPage("studentConsent")}>
                  ← Back to Consent Notice
                </button>
              </div>
            )}
          </div>
        </main>
      </>
    );
  }

  // LECTURER DASHBOARD WITH UNIT / DATE / STATISTICS FILTERS
  if (page === "lecturerDashboard") {
    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Lecturer Dashboard</h1>
          <p>View attendance statistics by unit, date, week or cumulative period.</p>

          <div className="panel">
            <div className="filters">
              <div>
                <label>Unit</label>
                <select value={selectedUnit} onChange={(event) => setSelectedUnit(event.target.value)}>
                  <option value="ITS320">ITS320 - Capstone Experience</option>
                  <option value="ITS204">ITS204 - Data Structures & Algorithms</option>
                  <option value="ITS106">ITS106 - Webpage Design & Development</option>
                </select>
              </div>

              <div>
                <label>Calendar Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </div>

              <div>
                <label>Statistics View</label>
                <select value={statsMode} onChange={(event) => setStatsMode(event.target.value)}>
                  <option value="weekly">Weekly</option>
                  <option value="specific">Specific Week</option>
                  <option value="cumulative">Cumulative</option>
                </select>
              </div>

              {statsMode === "specific" && (
                <div>
                  <label>Select Week</label>
                  <select value={selectedWeek} onChange={(event) => setSelectedWeek(event.target.value)}>
                    <option>Week 5</option>
                    <option>Week 6</option>
                    <option>Week 7</option>
                    <option>Week 8</option>
                    <option>Week 9</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="cards">
            <div className="card"><h2>{stats.total}</h2><p>Total Students</p></div>
            <div className="card"><h2>{stats.present}</h2><p>Present</p></div>
            <div className="card"><h2>{stats.absent}</h2><p>Absent</p></div>
            <div className="card"><h2>{stats.anomalies}</h2><p>Pending Anomalies</p></div>
            <div className="card"><h2>{stats.rate}%</h2><p>Attendance Rate</p></div>
          </div>

          <div className="panel">
            <h2>Session Management - {selectedUnit}</h2>
            <p>
              Current Session: <strong>{sessionOpen ? "Open" : "Closed"}</strong>
            </p>

            <div className="actions">
              <button className="primary" onClick={() => setSessionOpen(true)}>
                Open Attendance Session
              </button>
              <button className="secondary" onClick={() => setSessionOpen(false)}>
                Close Session
              </button>
              <button className="secondary" onClick={() => setPage("lecturerVerify")}>
                Verification / Error Tests
              </button>
              <button className="secondary" onClick={() => setPage("records")}>
                Attendance Records
              </button>
              <button className="secondary" onClick={() => setPage("anomalies")}>
                Review Anomalies
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // LECTURER VERIFICATION + ERROR EXPERIMENTS
  if (page === "lecturerVerify") {
    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Verification & Liveness Test</h1>
          <p>
            Use consenting group members for the real camera demo. These buttons currently
            create prototype error cases so the anomaly workflow can be tested before OpenCV is connected.
          </p>

          <div className="verify-layout">
            <div className="panel">
              <div className="camera">
                LIVE CAMERA PREVIEW<br />
                Future: OpenCV + face detection + liveness challenge
              </div>

              <h3>Prototype Error Experiments</h3>
              <div className="actions">
                <button className="secondary" onClick={() => addDemoAnomaly("lowConfidence")}>
                  Low Confidence
                </button>
                <button className="secondary" onClick={() => addDemoAnomaly("multipleFaces")}>
                  Multiple Faces
                </button>
                <button className="danger" onClick={() => addDemoAnomaly("livenessFailed")}>
                  Liveness Failed
                </button>
                <button className="danger" onClick={() => addDemoAnomaly("unknownFace")}>
                  Unknown Face
                </button>
              </div>
            </div>

            <div className="panel">
              <div className="info">
                <h2>Validation Plan</h2>
                <p>1. Enrol consenting group members.</p>
                <p>2. Test genuine verification attempts.</p>
                <p>3. Test wrong-person, photo/screen, angle and lighting cases.</p>
                <p>4. Send failed/uncertain attempts to lecturer anomalies.</p>
                <p>5. Record verification results for validation metrics.</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ATTENDANCE RECORDS
  if (page === "records") {
    const filteredRecords = attendanceRecords.filter((record) => record.unit === selectedUnit);

    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Attendance Records - {selectedUnit}</h1>
          <p>Confirmed anomalies automatically update the student's attendance record.</p>

          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Week</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={`${record.studentId}-${record.unit}-${record.week}`}>
                  <td>{record.studentId}</td>
                  <td>{record.name}</td>
                  <td>{record.week}</td>
                  <td>{record.date}</td>
                  <td>{record.time}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="small-note">
            Planned database rule: one attendance record per student per class session.
          </p>
        </main>
      </>
    );
  }

  // ANOMALY REVIEW WITH STUDENT NAME + AUTO ATTENDANCE UPDATE
  if (page === "anomalies") {
    const unitAnomalies = anomalies.filter((item) => item.unit === selectedUnit);

    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Verification Anomalies - {selectedUnit}</h1>
          <p>
            Student name and ID are displayed so the lecturer can confirm the correct person
            before changing attendance.
          </p>

          {unitAnomalies.length === 0 && (
            <div className="panel"><p>No anomalies for this unit.</p></div>
          )}

          {unitAnomalies.map((item) => (
            <div className="panel" key={item.id}>
              <h3>Attempt #{item.id}</h3>
              <p><strong>Student Name:</strong> {item.name}</p>
              <p><strong>Student ID:</strong> {item.studentId}</p>
              <p><strong>Unit:</strong> {item.unit}</p>
              <p><strong>Issue:</strong> {item.issue}</p>
              <p><strong>Time:</strong> {item.time}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    item.status === "Confirmed"
                      ? "status-confirmed"
                      : item.status === "Rejected"
                      ? "status-rejected"
                      : "status-pending"
                  }
                >
                  {item.status}
                </span>
              </p>

              {item.status === "Pending" && (
                <div className="actions">
                  <button className="success-button" onClick={() => handleConfirmAnomaly(item.id)}>
                    Confirm Attendance
                  </button>
                  <button className="danger" onClick={() => handleRejectAnomaly(item.id)}>
                    Reject Attempt
                  </button>
                </div>
              )}

              {item.status === "Confirmed" && (
                <div className="success" style={{ marginTop: "18px" }}>
                  Attendance automatically updated to Present.
                </div>
              )}
            </div>
          ))}
        </main>
      </>
    );
  }

  // LECTURER VIEW OF STUDENTS WHO REQUEST AN ALTERNATIVE METHOD
  if (page === "optOutList") {
    return (
      <>
        <style>{styles}</style>
        <LecturerHeader />

        <main className="page">
          <h1>Alternative Attendance / Opt-Out List</h1>
          <p>Students who request a non-biometric attendance option appear here.</p>

          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {optOutStudents.length === 0 ? (
                <tr>
                  <td colSpan="4">No alternative attendance requests submitted in this prototype session.</td>
                </tr>
              ) : (
                optOutStudents.map((student) => (
                  <tr key={`${student.studentId}-${student.unit}`}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td>{student.unit}</td>
                    <td>{student.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </>
    );
  }

  // ADMIN ACCESS / SCALABILITY DESIGN
  if (page === "adminDashboard") {
    return (
      <>
        <style>{styles}</style>
        <AdminHeader />

        <main className="page">
          <h1>Administrator Dashboard</h1>
          <p>
            Prototype administration area for assigning lecturers to terms and units.
            This supports future scalability across different subjects.
          </p>

          <div className="panel">
            <h2>Lecturer Unit Assignment</h2>

            <label>Lecturer</label>
            <select defaultValue="lecturer1">
              <option value="lecturer1">Lecturer 1</option>
              <option value="lecturer2">Lecturer 2</option>
            </select>

            <label>Term</label>
            <select defaultValue="T2-2026">
              <option value="T2-2026">Trimester 2 - 2026</option>
              <option value="T3-2026">Trimester 3 - 2026</option>
            </select>

            <label>Unit</label>
            <select defaultValue="ITS320">
              <option value="ITS320">ITS320</option>
              <option value="ITS204">ITS204</option>
              <option value="ITS106">ITS106</option>
            </select>

            <button className="primary">Assign Lecturer Access</button>
          </div>

          <div className="panel">
            <h2>Planned Access Structure</h2>
            <p>Administrator → assigns lecturer → trimester → unit.</p>
            <p>Lecturer → sees only units assigned by the administrator.</p>
          </div>
        </main>
      </>
    );
  }

  return null;
}

export default App;
