import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LEVELS, LETTERS } from "../data";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios
      .get("/data/questions.json")
      .then((res) => {
        const found = res.data.find((q) => q.id === Number(id));
        if (found) {
          setQuestion(found);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound)
    return (
      <div>
        Không tìm thấy câu hỏi.{" "}
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  if (!question) return <div>Đang tải...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>Quay lại</button>
      <h3>
        Câu hỏi số {question.id} – {LEVELS[question.level]} –{" "}
        {question.reserve ? "Dự bị" : "Chính thức"}
      </h3>
      <p dangerouslySetInnerHTML={{ __html: question.question }} />

      <ul>
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.answer;
          const bg = showAnswer && isCorrect ? "lightgreen" : "transparent";
          return (
            <li
              key={idx}
              style={{
                backgroundColor: bg,
                padding: "5px",
                marginBottom: "5px",
              }}
            >
              <strong>{LETTERS[idx]}. </strong>
              <span dangerouslySetInnerHTML={{ __html: opt }} />
              {showAnswer && isCorrect && (
                <span style={{ color: "green", marginLeft: "10px" }}>
                  <strong>(Đáp án đúng)</strong>
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <button onClick={() => setShowAnswer(!showAnswer)}>
        {showAnswer ? "Ẩn đáp án" : "Xem đáp án"}
      </button>

      {showAnswer && (
        <p style={{ marginTop: "10px", fontStyle: "italic" }}>
          <strong>Giải thích:</strong> {question.explain}
        </p>
      )}
    </div>
  );
}
