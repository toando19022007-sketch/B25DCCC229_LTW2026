import React, { useState } from "react";

const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{className}</td>
      <td>{score}</td>
      <td>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};

const StudentList = ({ students, onDelete }) => {
  return (
    <table
      border="1"
      cellPadding="8"
      style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Lớp</th>
          <th>Điểm số</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentItem key={student.id} student={student} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};

const App = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn A", score: 8.5, class: "D21CQCN01" },
    { id: 2, name: "Trần Thị B", score: 4.0, class: "D21CQCN02" },
    { id: 3, name: "Lê Văn C", score: 9.0, class: "D21CQCN01" },
  ]);

  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  const handleAddStudent = (e) => {
    e.preventDefault();
    const parsedScore = parseFloat(score);

    if (!name.trim() || !studentClass.trim() || score === "") {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      setError("Điểm số không hợp lệ (phải từ 0 đến 10)!");
      return;
    }

    const newStudent = {
      id:
        students.length > 0 ? Number(students[students.length - 1].id) + 1 : 1,
      name: name.trim(),
      score: parsedScore,
      class: studentClass.trim(),
    };

    setStudents([...students, newStudent]);
    setName("");
    setScore("");
    setStudentClass("");
    setError("");
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter((s) => {
    if (filter === "GIOI") return s.score >= 8;
    if (filter === "TRUOT") return s.score < 5;
    return true;
  });

  const avgScore =
    students.length > 0
      ? (
          students.reduce((sum, s) => sum + s.score, 0) / students.length
        ).toFixed(2)
      : 0;

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h2>Ứng dụng Quản lý Điểm Sinh viên</h2>

      {/* Form nhập liệu thêm sinh viên */}
      <form
        onSubmit={handleAddStudent}
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lớp"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Điểm số"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Các nút chức năng Lọc (Filter) */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <button onClick={() => setFilter("ALL")}>Tất cả</button>
        <button onClick={() => setFilter("GIOI")}>
          Sinh viên Giỏi (Điểm &ge; 8)
        </button>
        <button onClick={() => setFilter("TRUOT")}>
          Sinh viên Trượt môn (Điểm &lt; 5)
        </button>
      </div>

      {/* Thống kê cơ bản của lớp */}
      <div
        style={{
          marginBottom: "15px",
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p>
          Tổng số sinh viên: <strong>{students.length}</strong>
        </p>
        <p>
          Điểm trung bình toàn lớp: <strong>{avgScore}</strong>
        </p>
      </div>

      {/* Danh sách hiển thị sinh viên */}
      <StudentList students={filteredStudents} onDelete={handleDeleteStudent} />
    </div>
  );
};

export default App;
