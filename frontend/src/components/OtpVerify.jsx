import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const OtpVerify = ({ userEmail }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  userEmail = user.email;
  const navigate = useNavigate();
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
        email: user.email,
        otp: enteredOtp,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message || "Invalid OTP");
        setOtp(new Array(4).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await axios.post("/api/user/send-otp", {
        email: userEmail,
      });

      if (data.success) {
        toast.success(data.message);
        setOtp(new Array(4).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Verify OTP</h1>
        <p className="text-sm mb-4 text-center">
          Enter the 4-digit OTP sent to your email
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-center gap-3">
            {otp.map((value, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-12 text-center text-xl rounded border border-gray-600 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-sm mt-3 text-center text-gray-400">
          Didn't receive OTP?{" "}
          <button onClick={handleResend} className="text-blue-400 underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;
