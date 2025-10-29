import React, { useRef, useState, useEffect } from "react";
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
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[idx] = value[0] || "";
    setOtp(newOtp);
    if (value && idx < inputRefs.current.length - 1) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1].focus();
        newOtp[idx - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1].focus();
    } else if (e.key === "ArrowRight" && idx < inputRefs.current.length - 1) {
      inputRefs.current[idx + 1].focus();
    }
  };

  
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim().slice(0, 4);
    if (/^\d+$/.test(paste)) setOtp(paste.split(""));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
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
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      toast.error("Please enter complete OTP");
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
        toast.error(data.message || "Invalid OTP");
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const { data } = await axios.post("/api/user/send-otp", { email });
      if (data.success) {
        toast.success("OTP resent successfully!");
        setOtp(["", "", "", ""]);
        setResendTimer(30);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, "$1****$2")
    : "";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="bg-gray-800/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700 transition-all duration-300">
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {otpSent ? "Verify OTP" : "Email Verification"}
        </h1>

        {!otpSent ? (
          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col gap-5 animate-fadeIn"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={!email}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <>
            <p className="text-sm text-center mb-4 text-gray-300">
              Enter the 4-digit OTP sent to{" "}
              <span className="font-semibold text-blue-400">{maskedEmail}</span>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div
                className={`flex justify-center gap-4 ${
                  shake ? "animate-shake" : ""
                }`}
              >
                {otp.map((value, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-2xl font-bold rounded-lg border border-gray-600 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg font-semibold transition-all ${
                  isSubmitting ? "animate-pulse opacity-80" : ""
                }`}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="text-sm mt-4 text-center text-gray-400">
              Didn't receive OTP?{" "}
              {resendTimer > 0 ? (
                <span className="text-gray-500">{resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-400 hover:text-blue-300 underline transition-all"
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
