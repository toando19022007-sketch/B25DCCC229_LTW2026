import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LEVELS } from "../data";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("/data/questions.json", { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(true);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  if (loading) return <div>Đang tải câu hỏi...</div>;
  if (error) return <div>Không tải được câu hỏi.</div>;

  const totalCount = questions.length;
  const chinhThucCount = questions.filter((q) => !q.reserve).length;
  const duBiCount = questions.filter((q) => q.reserve).length;

  let filtered = questions.filter((q) => {
    if (filterType === "chinhthuc") return !q.reserve;
    if (filterType === "dubai") return q.reserve;
    return true;
  });

  if (searchTerm.trim()) {
    filtered = filtered.filter((q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  let displayed = [...filtered];
  if (sortOrder === "asc") {
    displayed.sort((a, b) => a.level - b.level || a.id - b.id);
  } else if (sortOrder === "desc") {
    displayed.sort((a, b) => b.level - a.level || a.id - b.id);
  } else {
    displayed.sort((a, b) => a.id - b.id);
  }

  const btnStyle = (type) => ({
    padding: "8px 12px",
    marginRight: "5px",
    backgroundColor: filterType === type ? "orange" : "#eee",
    color: filterType === type ? "white" : "black",
    border: "none",
    cursor: "pointer",
  });

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div style={{ marginBottom: "15px" }}>
        <button style={btnStyle("all")} onClick={() => setFilterType("all")}>
          Tất cả ({totalCount})
        </button>
        <button
          style={btnStyle("chinhthuc")}
          onClick={() => setFilterType("chinhthuc")}
        >
          Chính thức ({chinhThucCount})
        </button>
        <button
          style={btnStyle("dubai")}
          onClick={() => setFilterType("dubai")}
        >
          Dự bị ({duBiCount})
        </button>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Sắp xếp: </label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Theo số thứ tự</option>
          <option value="asc">Mức độ: Dễ → Khó</option>
          <option value="desc">Mức độ: Khó → Dễ</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "20px", padding: "5px" }}
        />
      </div>

      <p>Có {displayed.length} câu hỏi</p>

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Loại</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((q, index) => (
            <tr key={q.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{q.reserve ? "Dự bị" : "Chính thức"}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
