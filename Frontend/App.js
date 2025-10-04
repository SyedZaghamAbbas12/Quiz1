import React, { useEffect, useState } from "react";

function App() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newStudent, setNewStudent] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:3000";

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_URL}/subjects`);
      const data = await res.json();
      setSubjects(data);
      if (selectedSubject) {
        setSelectedSubject(data.find((s) => s.id === selectedSubject.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Add subject
  const addSubject = async () => {
    if (!newSubject) return;
    await fetch(`${API_URL}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSubject }),
    });
    setNewSubject("");
    fetchSubjects();
  };

  // Delete subject
  const deleteSubject = async (id) => {
    await fetch(`${API_URL}/subjects/${id}`, { method: "DELETE" });
    if (selectedSubject?.id === id) setSelectedSubject(null);
    fetchSubjects();
  };

  // Add student
  const addStudent = async () => {
    if (!newStudent || !selectedSubject) return;
    await fetch(`${API_URL}/subjects/${selectedSubject.id}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newStudent }),
    });
    setNewStudent("");
    fetchSubjects();
  };

  // Delete student
  const deleteStudent = async (studentId) => {
    await fetch(
      `${API_URL}/subjects/${selectedSubject.id}/students/${studentId}`,
      { method: "DELETE" }
    );
    fetchSubjects();
  };

  // Update attendance
  const updateAttendance = async (studentId, status) => {
    await fetch(
      `${API_URL}/subjects/${selectedSubject.id}/attendance/${studentId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );
    fetchSubjects();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🎓 Attendance Dashboard</h1>

        {/* Add Subject */}
        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="Enter subject name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            style={styles.input}
          />
          <button style={styles.btnPrimary} onClick={addSubject}>
            ➕ Add Subject
          </button>
        </div>

        {/* Subject List */}
        <h3 style={styles.subHeading}>📘 Subjects</h3>
        <ul style={styles.list}>
          {subjects.map((subj) => (
            <li
              key={subj.id}
              style={{
                ...styles.listItem,
                background:
                  selectedSubject?.id === subj.id ? "#d0e7ff" : "#f9f9f9",
              }}
            >
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedSubject(subj)}
              >
                {subj.name}
              </span>
              <button
                style={styles.btnDelete}
                onClick={() => deleteSubject(subj.id)}
              >
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Students Section */}
        {selectedSubject && (
          <div style={styles.section}>
            <h3 style={styles.subHeading}>
              👨‍🎓 Students in {selectedSubject.name}
            </h3>

            <div style={styles.inputRow}>
              <input
                type="text"
                placeholder="Enter student name"
                value={newStudent}
                onChange={(e) => setNewStudent(e.target.value)}
                style={styles.input}
              />
              <button style={styles.btnPrimary} onClick={addStudent}>
                ➕ Add Student
              </button>
            </div>

            {/* Students List */}
            <ul style={styles.list}>
              {selectedSubject.students.map((st) => (
                <li key={st.id} style={styles.studentItem}>
                  <span>
                    {st.name} — <b>{st.status}</b>
                  </span>
                  <div>
                    <button
                      style={{
                        ...styles.btnSmall,
                        background:
                          st.status === "Present" ? "#4CAF50" : "#e0e0e0",
                        color: st.status === "Present" ? "#fff" : "#333",
                      }}
                      onClick={() => updateAttendance(st.id, "Present")}
                    >
                      ✅ Present
                    </button>
                    <button
                      style={{
                        ...styles.btnSmall,
                        background:
                          st.status === "Absent" ? "#f44336" : "#e0e0e0",
                        color: st.status === "Absent" ? "#fff" : "#333",
                        marginLeft: "8px",
                      }}
                      onClick={() => updateAttendance(st.id, "Absent")}
                    >
                      ❌ Absent
                    </button>
                    <button
                      style={styles.btnDeleteSmall}
                      onClick={() => deleteStudent(st.id)}
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Styles
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #74ebd5 0%, #9face6 100%)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "30px 25px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    width: "500px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  subHeading: {
    margin: "15px 0 10px",
    color: "#333",
  },
  inputRow: {
    display: "flex",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  btnPrimary: {
    padding: "10px 15px",
    marginLeft: "10px",
    background: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnDelete: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "5px 10px",
    marginLeft: "10px",
    cursor: "pointer",
  },
  btnDeleteSmall: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "5px 8px",
    marginLeft: "8px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "10px",
    margin: "5px 0",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ccc",
  },
  section: {
    marginTop: "20px",
  },
  studentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#fafafa",
  },
  btnSmall: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};

export default App;
