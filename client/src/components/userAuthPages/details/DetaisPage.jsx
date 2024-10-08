import React, { useState } from "react";
import styles from "./details.module.css"; // Import CSS Module
import Card from "../../card/Card";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtp, setUser } from "../../../redux/slices/userSlice";

export default function DetaisPage({ onNext }) {
  const [mode, setMode] = useState("mobile");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Enter your mobile number");
  const dispatch = useDispatch();

  const handleRadioChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
    setTitle(
      selectedMode === "email"
        ? "Enter your email address"
        : "Enter your mobile number"
    );
  };

  const handleNext = async () => {
    console.log(name, email);
    if (name === "" || (email === "" && number === "")) {
      alert("fill all the fields");
      return;
    }
    // backend req
    console.log("API URL:", process.env.REACT_APP_API_URL);

    const res = await axios.post(process.env.REACT_APP_API_URL + "apiv1/sendotp", {
      mobile: "+91" + number,
    });
    const data = res.data;
    console.log(data);
    dispatch(setUser({ name }));
    dispatch(setOtp({ mobile: data.mobile, hash: data.hashdata, expiry: data.expiry }));
    onNext();
  };

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsCardContainer}>
        <Card
          title={title}
          textContent={"ds"}
          buttonContent={"Next"}
          onclick={handleNext}
        >
          <div className={styles.detailsModeInput}>
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
          <div className={styles.detailsInputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {mode === "mobile" ? (
            <div className={styles.detailsInputGroup}>
              <label htmlFor="number">Mobile</label>
              <input
                type="text"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
          ) : (
            <div className={styles.detailsInputGroup}>
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