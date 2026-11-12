import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  const activeStyle = ({ isActive }) => ({
    color: isActive ? "orange" : "black",
    fontWeight: isActive ? "bold" : "normal",
    marginRight: "20px",
    textDecoration: "none",
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <nav
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <NavLink to="/" style={activeStyle} end>
          Trang chủ
        </NavLink>
        <NavLink to="/questions" style={activeStyle}>
          Ngân hàng câu hỏi
        </NavLink>
        <NavLink to="/play" style={activeStyle}>
          Chơi game
        </NavLink>
        <NavLink to="/history" style={activeStyle}>
          Lịch sử
        </NavLink>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
