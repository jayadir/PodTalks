import React, { useState, useRef } from 'react';
import Card from '../../card/Card';
import './otp.css'; 

export default function OtpPage() {
  const [index, setIndex] = useState(1);
  const [otp, setOtp] = useState(Array(4).fill(''));
  const inputRefs = useRef([]);

  const handleInputChange = (e, idx) => {
    const value = e.target.value;
    if (value.length === 1 && idx < inputRefs.current.length - 1) {
      inputRefs.current[idx + 1].focus();
    }
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
  };

  const otpValue = otp.join('');

  return (
    <div className='container'>
      <Card title={"Enter OTP"} buttonContent={"Verify"}>
        <div className='inputGroup'>
          <input
            type='text'
            id='1'
            className='inputbox'
            maxLength='1'
            ref={(el) => (inputRefs.current[0] = el)}
            onChange={(e) => handleInputChange(e, 0)}
          />
          <input
            type='text'
            id='2'
            className='inputbox'
            maxLength='1'
            ref={(el) => (inputRefs.current[1] = el)}
            onChange={(e) => handleInputChange(e, 1)}
          />
          <input
            type='text'
            id='3'
            className='inputbox'
            maxLength='1'
            ref={(el) => (inputRefs.current[2] = el)}
            onChange={(e) => handleInputChange(e, 2)}
          />
          <input
            type='text'
            id='4'
            className='inputbox'
            maxLength='1'
            ref={(el) => (inputRefs.current[3] = el)}
            onChange={(e) => handleInputChange(e, 3)}
          />
        </div>
      </Card>
    </div>
  );
}