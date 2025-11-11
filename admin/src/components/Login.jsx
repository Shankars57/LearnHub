import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Lock, Mail } from "lucide-react";
import { useContext } from "react";
import { AdminContext } from "../context/AdminProvider";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { token, setToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Please enter both email and password");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/admin-login", form);

      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
        navigate("/dashboard");
        setForm({email:"" , password:""})
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl shadow-lg shadow-black/40 p-8"
      >
        <h1 className="text-3xl font-bold text-gray-100 text-center mb-6">
          Admin Login
        </h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Access your admin dashboard securely
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Admin Email"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md text-gray-200 px-10 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md text-gray-200 px-10 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 mt-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; {new Date().getFullYear()} LearnHub Admin Portal
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
