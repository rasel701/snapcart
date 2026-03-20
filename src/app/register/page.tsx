"use client";
import Welcome from "@/components/Welcome";
import Reg from "@/components/Reg";
import React, { useState } from "react";

const Register = () => {
  const [step, setStep] = useState<number>(1);
  return (
    <div>
      {step === 1 ? <Welcome nextStep={setStep} /> : <Reg nextStep={setStep} />}
    </div>
  );
};

export default Register;
