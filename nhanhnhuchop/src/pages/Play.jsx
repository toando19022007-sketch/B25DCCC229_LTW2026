import React, { useState, useEffect } from "react";
import axios from "axios";
import { LEVELS, LETTERS } from "../data";

export default function Play() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameConfig, setGameConfig] = useState({
    numQuestions: 5,
    type: "all",
  });
  const [gameState, setGameState] = useState("setup");
  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    axios
      .get("/data/questions.json")
      .then((res) => {
        setAllQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Lỗi tải câu hỏi:", err));
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleStartGame = () => {
    let filtered = [...allQuestions];
    if (gameConfig.type === "chinhthuc")
      filtered = filtered.filter((q) => !q.reserve);
    else if (gameConfig.type === "dubai")
      filtered = filtered.filter((q) => q.reserve);

    filtered.sort(() => Math.random() - 0.5);
    const selected = filtered.slice(0, Number(gameConfig.numQuestions));

    if (selected.length === 0) {
      alert("Không đủ câu hỏi!");
      return;
    }

    setQuizList(selected);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setGameState("playing");
  };

  const handleSelectOption = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const currentQ = quizList[currentIndex];
    if (idx === currentQ.answer) {
      setScore((prev) => prev + currentQ.level * 10);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(15);
    } else {
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        score: score,
        total: quizList.length,
      };
      const existingHistory = JSON.parse(
        localStorage.getItem("gameHistory") || "[]",
      );
      localStorage.setItem(
        "gameHistory",
        JSON.stringify([newHistoryItem, ...existingHistory]),
      );
      setGameState("result");
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  if (gameState === "setup") {
    return (
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>Cấu hình lượt chơi</h2>
        <div style={{ marginBottom: "15px" }}>
          <label>
            <strong>Số lượng câu hỏi:</strong>
          </label>
          <select
            value={gameConfig.numQuestions}
            onChange={(e) =>
              setGameConfig({ ...gameConfig, numQuestions: e.target.value })
            }
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value={5}>5 câu</option>
            <option value={10}>10 câu</option>
            <option value={15}>15 câu</option>
          </select>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Loại câu hỏi:</strong>
          </label>
          <select
            value={gameConfig.type}
            onChange={(e) =>
              setGameConfig({ ...gameConfig, type: e.target.value })
            }
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="all">Tất cả</option>
            <option value="chinhthuc">Chính thức</option>
            <option value="dubai">Dự bị</option>
          </select>
        </div>
        <button
          onClick={handleStartGame}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "orange",
            color: "white",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Bắt đầu chơi
        </button>
      </div>
    );
  }

  if (gameState === "playing") {
    const currentQ = quizList[currentIndex];
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <span>
            <strong>
              Câu {currentIndex + 1} / {quizList.length}
            </strong>
          </span>
          <span
            style={{
              color: timeLeft <= 5 ? "red" : "black",
              fontWeight: "bold",
            }}
          >
            ⏱ {timeLeft}s
          </span>
          <span>
            <strong>Điểm: {score}</strong>
          </span>
        </div>
        <h3 dangerouslySetInnerHTML={{ __html: currentQ.question }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            margin: "20px 0",
          }}
        >
          {currentQ.options.map((opt, idx) => {
            let bg = "#f9f9f9";
            if (selectedAnswer !== null) {
              if (idx === currentQ.answer) bg = "lightgreen";
              else if (idx === selectedAnswer) bg = "lightcoral";
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                style={{
                  padding: "12px",
                  textAlign: "left",
                  backgroundColor: bg,
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                <strong>{LETTERS[idx]}. </strong> {opt}
              </button>
            );
          })}
        </div>
        {selectedAnswer !== null && (
          <button
            onClick={handleNextQuestion}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {currentIndex + 1 < quizList.length
              ? "Câu tiếp theo"
              : "Xem kết quả"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Kết quả lượt chơi</h2>
      <p style={{ fontSize: "18px" }}>
        Tổng điểm: <strong style={{ color: "green" }}>{score} điểm</strong>
      </p>
      <button
        onClick={() => setGameState("setup")}
        style={{
          padding: "10px 20px",
          backgroundColor: "orange",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Chơi lại
      </button>
    </div>
  );
}
