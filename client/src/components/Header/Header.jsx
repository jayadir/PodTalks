import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <nav className="container ">
      <Link
        to="/"
        style={{
          textDecoration: "none",
          fontSize: "30px",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Logo
      </Link>
    </nav>
  );
}
