import { Save, User } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Settings = ({ user, setUserData }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const { data } = await axios.put(
        `/api/user/update/${user._id}`,
        {
          firstName,
          lastName,
          bio,
          userName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setUserData(data.updatedUser);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBio(user.bio || "");
      setUserName(user.userName || "");
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 sm:p-8 bg-gray-700/20 rounded-xl shadow-lg flex flex-col gap-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
        Settings
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        <h3 className="flex items-center gap-3 text-xl sm:text-2xl font-semibold text-white">
          <User className="text-blue-500" /> Profile Information
        </h3>

        <form className="relative flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="firstName" className="text-gray-300 font-medium">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your First Name"
                required
                className="px-3 py-2 w-full rounded-lg bg-gray-600/40 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="lastName" className="text-gray-300 font-medium">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your Last Name"
                required
                className="px-3 py-2 w-full rounded-lg bg-gray-600/40 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-300 font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell something about yourself..."
              required
              className="px-3 py-2 w-full h-24 rounded-lg bg-gray-600/40 text-white placeholder-gray-400 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="userName" className="text-gray-300 font-medium">
              User Name
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              required
              className="px-3 py-2 w-full rounded-lg bg-gray-600/40 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`flex absolute  -top-10  items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md text-white
    ${
      loading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Save /> Save
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
