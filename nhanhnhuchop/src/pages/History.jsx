import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("gameHistory") || "[]",
    );
    setHistoryList(savedHistory);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch sử không?")) {
      localStorage.removeItem("gameHistory");
      setHistoryList([]);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Lịch sử các lượt chơi</h2>
      {historyList.length === 0 ? (
        <p>
          Chưa có lịch sử. Vào mục <Link to="/play">Chơi game</Link> để thử
          ngay!
        </p>
      ) : (
        <>
          <button
            onClick={handleClearHistory}
            style={{
              marginBottom: "15px",
              padding: "6px 12px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Xóa lịch sử
          </button>
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th>STT</th>
                <th>Thời gian</th>
                <th>Số câu</th>
                <th>Điểm số</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>{item.total}</td>
                  <td>
                    <strong style={{ color: "green" }}>
                      {item.score} điểm
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
