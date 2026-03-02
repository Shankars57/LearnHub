import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (otpSent) inputRefs.current[0]?.focus();
  }, [otpSent]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (event, index) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    const nextOtp = [...otp];
    nextOtp[index] = value[0] || "";
    setOtp(nextOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const nextOtp = [...otp];
      if (otp[index]) {
        nextOtp[index] = "";
        setOtp(nextOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        nextOtp[index - 1] = "";
        setOtp(nextOtp);
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").trim().slice(0, 4);
    if (/^\d+$/.test(pasted)) {
      const next = pasted.split("");
      while (next.length < 4) next.push("");
      setOtp(next);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    try {
      const { data } = await axios.post("/api/user/send-otp", { email });
      if (data.success) {
        toast.success(data.message);
        setOtpSent(true);
        setOtp(["", "", "", ""]);
        setResendTimer(30);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      toast.error("Please enter complete OTP.");
      return;
    }
    try {
      setIsSubmitting(true);
      const { data } = await axios.post("/api/user/verify-otp", {
        email,
        otp: enteredOtp,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message || "Invalid OTP.");
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const { data } = await axios.post("/api/user/send-otp", { email });
      if (data.success) {
        toast.success("OTP resent successfully.");
        setOtp(["", "", "", ""]);
        setResendTimer(30);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  };

  const maskedEmail = email ? email.replace(/(.{2}).+(@.+)/, "$1****$2") : "";

  return (
    <div className="theme-page flex items-center justify-center min-h-[91vh] px-4">
      <div className="theme-card p-8 rounded-2xl w-full max-w-sm border transition-all duration-300">
        <h1
          className="text-3xl font-bold text-center mb-4"
          style={{
            background:
              "linear-gradient(90deg, var(--accent-color), var(--accent-secondary))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {otpSent ? "Verify OTP" : "Email Verification"}
        </h1>

        {!otpSent ? (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5 animate-fadeIn">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-2 rounded-lg border theme-input focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={!email}
              className="theme-btn text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <>
            <p className="text-sm text-center mb-4 theme-muted">
              Enter the 4-digit OTP sent to{" "}
              <span className="font-semibold theme-accent">{maskedEmail}</span>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className={`flex justify-center gap-4 ${shake ? "animate-shake" : ""}`}>
                {otp.map((value, index) => (
                  <input
                    key={index}
                    ref={(element) => (inputRefs.current[index] = element)}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(event) => handleChange(event, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-2xl font-bold rounded-lg border theme-input focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`theme-btn text-white py-2 rounded-lg font-semibold transition-all ${
                  isSubmitting ? "animate-pulse opacity-80" : ""
                }`}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="text-sm mt-4 text-center theme-muted">
              Did not receive OTP?{" "}
              {resendTimer > 0 ? (
                <span className="opacity-80">{resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  className="theme-accent hover:opacity-80 underline transition-all"
                >
                  Resend
                </button>
              )}
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default OtpVerify;
