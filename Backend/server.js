const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let subjects = [];

// 🏠 Root
app.get("/", (req, res) => res.send("✅ Attendance backend running!"));

// 📌 Get all subjects
app.get("/subjects", (req, res) => res.json(subjects));

// 📌 Add new subject
app.post("/subjects", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Subject name required" });

  const newSubject = {
    id: subjects.length + 1,
    name,
    students: [],
  };
  subjects.push(newSubject);
  res.json(newSubject);
});

// 📌 Delete subject
app.delete("/subjects/:id", (req, res) => {
  const subjectId = Number(req.params.id);
  subjects = subjects.filter((s) => s.id !== subjectId);
  res.json({ message: "✅ Subject deleted" });
});

// 📌 Add student to subject
app.post("/subjects/:id/students", (req, res) => {
  const subjectId = Number(req.params.id);
  const { name } = req.body;

  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  const newStudent = {
    id: subject.students.length + 1,
    name,
    status: "Absent",
  };
  subject.students.push(newStudent);

  res.json(newStudent);
});

// 📌 Delete student from subject
app.delete("/subjects/:subjectId/students/:studentId", (req, res) => {
  const subjectId = Number(req.params.subjectId);
  const studentId = Number(req.params.studentId);

  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  subject.students = subject.students.filter((st) => st.id !== studentId);
  res.json({ message: "✅ Student deleted" });
});

// 📌 Update attendance
app.post("/subjects/:subjectId/attendance/:studentId", (req, res) => {
  const subjectId = Number(req.params.subjectId);
  const studentId = Number(req.params.studentId);
  const { status } = req.body;

  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  const student = subject.students.find((st) => st.id === studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  student.status = status;
  res.json({ message: "✅ Attendance updated", student });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
