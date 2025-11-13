import React from "react";
import { useParams } from "react-router-dom";
import { useUserData } from "../store/useUsersData";
import { useColors } from "../hooks/useColors";
import { useStore } from "../store/useStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Mail,
  Trash2,
  Ban,
  Download,
  Eye,
  FileText,
  Trash,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";

const UserProfile = () => {
  const { id } = useParams();
  const { users = [], setUsers } = useUserData();
  const { materials = [] } = useStore();
  const [localUsers, setLocalUsers] = useState(users);
  const colors = useColors();
  const [ban, setBan] = useState(false);
  if (!Array.isArray(users)) {
    return (
      <div
        className={`${colors.bg} min-h-screen flex items-center justify-center`}
      >
        <p className={`${colors.textMuted}`}>
          Users data is invalid or loading.
        </p>
      </div>
    );
  }

  const user = users.find((item) => item._id === id);
  if (!user) {
    return (
      <div
        className={`${colors.bg} min-h-screen flex items-center justify-center`}
      >
        <p className={`${colors.textMuted}`}>User not found.</p>
      </div>
    );
  }

  const userMaterials = materials.filter(
    (item) =>
      item?.user?.email === user?.email ||
      item.uploadedBy
        ?.toLowerCase()
        .includes(user?.firstName?.toLowerCase() || "") ||
      item.uploadedBy
        ?.toLowerCase()
        .includes(user?.lastName?.toLowerCase() || "")
  );

  const handleBan = async (id) => {
    try {
      const { data } = await axios.post(`/api/user/profile/${id}`);
      if (data.success) {
        toast.success(data.message);
        setBan(!ban);
        const updated = localUsers.map((u) =>
          u._id === id ? { ...u, ban: !u.ban } : u
        );
        setLocalUsers(updated);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this user? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`/api/user/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        setLocalUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleMail = () => {
    window.location.href = `mailto:${user?.email}?subject=Hello ${user?.firstName}&body=Hi ${user?.firstName},`;
  };

  const materialStats = userMaterials.reduce((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(materialStats).map((date) => ({
    date,
    uploads: materialStats[date],
  }));

  const avatarURL =
    user?.profile && user.profile.trim() !== ""
      ? user.profile
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          `${user.firstName || ""} ${user.lastName || ""}`
        )}&background=0D8ABC&color=fff&size=256`;

  return (
    <motion.div
      className={`${colors.bg} min-h-screen px-8 py-6`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row items-start gap-8 ">
        <motion.div
          className={`${colors.card} ${colors.shadow} rounded-2xl p-6 w-full md:w-1/3   sticky top-10 `}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex flex-col items-center">
            <motion.img
              src={avatarURL}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            <h2 className={`${colors.text} text-2xl font-semibold mt-4`}>
              {user?.firstName} {user?.lastName}
            </h2>
            <p className={`${colors.text}  text-md`}>{user?.email}</p>
            <p className={`${colors.textMuted} text-sm mt-1`}>
              @{user?.userName}
            </p>
            <p className={`${colors.textMuted} text-sm mt-1`}>
              {user?.college}, Year {user?.year}
            </p>
            <p className={`${colors.textMuted} text-center mt-4 text-sm`}>
              {user?.bio}
            </p>

            <div className="flex justify-between w-full mt-6">
              <div className="text-center w-1/3">
                <p className={`${colors.text} text-lg font-bold`}>
                  {user?.xp || 0}
                </p>
                <p className={`${colors.textMuted} text-xs`}>XP</p>
              </div>
              <div className="text-center w-1/3">
                <p className={`${colors.text} text-lg font-bold`}>
                  {user?.streak || 0}
                </p>
                <p className={`${colors.textMuted} text-xs`}>Streak</p>
              </div>
              <div className="text-center w-1/3">
                <p className={`${colors.text} text-lg font-bold`}>
                  {userMaterials.length || 0}
                </p>
                <p className={`${colors.textMuted} text-xs`}>Uploads</p>
              </div>
            </div>

            <div className="flex justify-between mt-8 w-full gap-3">
              <motion.button
                onClick={handleMail}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Mail size={16} /> Mail
              </motion.button>
              <motion.button
                onClick={() => handleBan(user._id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 flex items-center justify-center gap-2 ${
                  user?.ban
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white py-2 rounded-lg transition`}
              >
                <Ban size={16} />
                {ban ? "Unban" : "Ban"}
              </motion.button>
              <motion.button
                onClick={handleDelete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                <Trash2 size={16} /> Delete
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`${colors.card} ${colors.shadow} rounded-2xl p-6 w-full md:flex-1`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h3 className={`${colors.text} text-2xl font-semibold mb-4`}>
            Uploaded Materials
          </h3>
          {userMaterials.length === 0 ? (
            <p className={`${colors.textMuted}`}>No materials uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userMaterials.map((material, i) => (
                <motion.div
                  key={material._id}
                  className={`${colors.card} ${colors.cardHover} rounded-xl p-4 transition-all flex flex-col justify-between`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="text-blue-400" size={20} />
                      <h4
                        className={`${colors.text} text-lg font-semibold truncate`}
                      >
                        {material.title}
                      </h4>
                    </div>
                    <p className={`${colors.textMuted} text-sm mt-1 truncate`}>
                      {material.subject}
                    </p>
                    <p className={`${colors.textMuted} text-xs mt-2`}>
                      {new Date(material.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-500"
                    >
                      <Eye size={16} /> Preview
                    </a>
                    <a
                      href={material.url}
                      download
                      className="flex items-center gap-1 text-green-400 hover:text-green-500"
                    >
                      <Download size={16} /> Download
                    </a>
                  </div>
                  <button
                    className={`${colors.bg}/90 shadow-lg shadow-${colors.bg}/10 text-red-500 rounded-lg mt-2 hover:opacity-70 py-2 flex items-center justify-center gap-2`}
                  >
                    {" "}
                    <span>
                      <Trash className="w-4 h-4" />
                    </span>
                    Delete
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {userMaterials.length > 0 && (
        <motion.div
          className={`${colors.card} ${colors.shadow} rounded-2xl p-6 mt-8`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className={`${colors.text} text-2xl font-semibold mb-4`}>
            Upload Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="uploads" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserProfile;
