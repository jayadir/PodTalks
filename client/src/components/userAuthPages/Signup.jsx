import React, { useEffect, useState } from "react";
import DetaisPage from "./details/DetaisPage";
import UserNamePage from "./username/UserNamePage";
import OtpPage from "./otp/OtpPage";
import "./signup.css";
function Signup() {
  const [step, setStep] = useState(2);
  const moveNext = () => {
    setStep(step + 1);
  };
  let currentPage;
  if (step === 1) {
    currentPage = <DetaisPage />;
  } else if (step === 2) {
    currentPage = <OtpPage />;
  } else if (step === 3) {
    currentPage = <UserNamePage />;
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  useEffect(() => {
    console.log("step", step);
  }, []);
  return (
    <div>
      <div className="progress">
        <div
          className={`bar ${step === 2 ? "half" : ""} ${
            step === 3 ? "full" : ""
          }`}
        ></div>
        <div
          className={`step ${step >= 1 ? "active" : ""} ${
            step == 1 ? "current" : ""
          }`}
          id="1"
        >
          1
        </div>
        <div
          className={`step ${step >= 2 ? "active" : ""} ${
            step == 2 ? "current" : ""
          }`}
          id="2"
        >
          2
        </div>
        <div
          className={`step ${step >= 3 ? "active" : ""} ${
            step == 3 ? "current" : ""
          }`}
          id="3"
        >
          3
        </div>
      </div>
      <div className="stepcontainer">
        {step===1 && <DetaisPage onNext={moveNext}/>}
        {step===2 && <OtpPage onNext={moveNext}/>}
        {step===3 && <UserNamePage onNext={moveNext}/>}
      </div>
      {/* <div className='navigation'>
        <button onClick={handlePrev} disabled={step === 1}>Previous</button>
        <button onClick={handleNext} disabled={step === 3}>Next</button>
      </div> */}
    </div>
  );
}

export default Signup;
