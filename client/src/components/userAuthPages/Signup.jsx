import React, { useEffect, useState } from "react";
import DetaisPage from "./details/DetaisPage";
import UserNamePage from "./username/UserNamePage";
import OtpPage from "./otp/OtpPage";
import styles from "./signup.module.css"; 

function Signup() {
  const [step, setStep] = useState(1);
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
      <div className={styles.progress}>
        <div
          className={`${styles.bar} ${step === 2 ? styles.half : ""} ${
            step === 3 ? styles.full : ""
          }`}
        ></div>
        <div
          className={`${styles.step} ${step >= 1 ? styles.active : ""} ${
            step === 1 ? styles.current : ""
          }`}
          id="1"
        >
          1
        </div>
        <div
          className={`${styles.step} ${step >= 2 ? styles.active : ""} ${
            step === 2 ? styles.current : ""
          }`}
          id="2"
        >
          2
        </div>
        <div
          className={`${styles.step} ${step >= 3 ? styles.active : ""} ${
            step === 3 ? styles.current : ""
          }`}
          id="3"
        >
          3
        </div>
      </div>
      <div className={styles.stepcontainer}>
        {step === 1 && <DetaisPage onNext={moveNext} />}
        {step === 2 && <OtpPage onNext={moveNext} />}
        {step === 3 && <UserNamePage onNext={moveNext} />}
      </div>
    </div>
  );
}

export default Signup;
