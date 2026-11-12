import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";
import Play from "./pages/Play";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="questions" element={<Questions />} />
        <Route path="questions/:id" element={<QuestionDetail />} />
        <Route path="play" element={<Play />} />
        <Route path="history" element={<History />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
