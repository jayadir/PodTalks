import React, { useState, useRef } from "react";
import Card from "../../card/Card";
import "./otp.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/slices/userSlice";
export default function OtpPage({ onNext }) {
  const [index, setIndex] = useState(1);
  const [otp, setOtp] = useState(Array(4).fill(""));
  const inputRefs = useRef([]);
  const data = useSelector((state) => state.user.otp);
  const {name}=useSelector(state=>state.user.user)
  const dispatch = useDispatch();
  const handleInputChange = (e, idx) => {
    const value = e.target.value;
    if (value.length === 1 && idx < inputRefs.current.length - 1) {
      inputRefs.current[idx + 1].focus();
    }
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
  };

  const handleNext = async () => {
    const otpValue = Number(otp.join(""));
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "apiv1/verifyotp",
      {
        name,
        mobile: data.mobile,
        otp: otpValue,
        hashdata: data.hashdata,
        expiry: data.expiry,
      },
      { withCredentials: true }
    );
    console.log(res);
    dispatch(setUser(res.data.user));
    console.log(res.user);
    onNext();
  };
  return (
    <div className="container">
      <Card title={"Enter OTP"} buttonContent={"Verify"} onclick={handleNext}>
        <div className="inputGroup">
          <input
            type="text"
            id="1"
            className="inputbox"
            maxLength="1"
            ref={(el) => (inputRefs.current[0] = el)}
            onChange={(e) => handleInputChange(e, 0)}
          />
          <input
            type="text"
            id="2"
            className="inputbox"
            maxLength="1"
            ref={(el) => (inputRefs.current[1] = el)}
            onChange={(e) => handleInputChange(e, 1)}
          />
          <input
            type="text"
            id="3"
            className="inputbox"
            maxLength="1"
            ref={(el) => (inputRefs.current[2] = el)}
            onChange={(e) => handleInputChange(e, 2)}
          />
          <input
            type="text"
            id="4"
            className="inputbox"
            maxLength="1"
            ref={(el) => (inputRefs.current[3] = el)}
            onChange={(e) => handleInputChange(e, 3)}
          />
        </div>
      </Card>
    </div>
  );
}
