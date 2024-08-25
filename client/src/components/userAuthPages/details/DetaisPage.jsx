import React, { useState } from "react";
import "./details.css";
import Card from "../../card/Card";

export default function DetaisPage({ onNext }) {
  const [mode, setMode] = useState("mobile");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Enter your mobile number");

  const handleRadioChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
    setTitle(
      selectedMode === "email"
        ? "Enter your email address"
        : "Enter your mobile number"
    );
  };
  const handleNext = () => {
    console.log(name,email)
    if(name==="" || (email==="" && number==="")){
      alert("fill all the fields")
      return
    }
    //backend
    onNext()
  }
  return (
    <div className="container">
      <div className="card-container">
        <Card
          title={title}
          textContent={"ds"}
          buttonContent={"Next"}
          onclick={handleNext}
        >
          <div className="modeInput">
            <label>
              <input
                type="radio"
                value="mobile"
                checked={mode === "mobile"}
                onChange={handleRadioChange}
              />
              Mobile
            </label>
            <label>
              <input
                type="radio"
                value="email"
                checked={mode === "email"}
                onChange={handleRadioChange}
              />
              Email
            </label>
          </div>
          <div className="inputGroup">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {mode === "mobile" ? (
            <div className="inputGroup">
              <label htmlFor="number">Mobile</label>
              <input
                type="text"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
          ) : (
            <div className="inputGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}