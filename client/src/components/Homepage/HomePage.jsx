import React from "react";
import "./Homepage.css";
import { Link,useNavigate } from "react-router-dom";
import Card from "../card/Card";
export default function HomePage() {
  const navigate = useNavigate();
  const handleNext = () => {
    navigate("/login")
  }
  const text =
    "Discover, listen, and enjoy a wide variety of podcasts from creators around the world. Whether you're into technology, storytelling, or education, we have something for everyone. Dive in and start exploring today!";
  return (
    <div className="container">
      <div className="cardItem">
        <Card title={"Welcome!"} textContent={text} buttonContent="Get Started" onclick={handleNext} />
      </div>
    </div>
  );
}
