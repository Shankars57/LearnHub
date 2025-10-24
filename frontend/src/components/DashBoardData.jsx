import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { User, Star, Flame, Clock, Award } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const DashBoardData = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const xpData = [
    { day: "Mon", xp: 20 },
    { day: "Tue", xp: 40 },
    { day: "Wed", xp: 30 },
    { day: "Thu", xp: 50 },
    { day: "Fri", xp: 70 },
    { day: "Sat", xp: 90 },
    { day: "Sun", xp: 60 },
  ];

  const watchData = [
    { day: "Mon", mins: 15 },
    { day: "Tue", mins: 20 },
    { day: "Wed", mins: 5 },
    { day: "Thu", mins: 30 },
    { day: "Fri", mins: 10 },
    { day: "Sat", mins: 40 },
    { day: "Sun", mins: 25 },
  ];

  const stats = [
    { icon: <Flame size={22} />, label: "Streak", value: `${user.streak}` },
    { icon: <Award size={22} />, label: "Level", value: `Lv ${user.level}` },
    { icon: <Star size={22} />, label: "XP", value: `${user.xp} XP` },
    {
      icon: <Clock size={22} />,
      label: "Watch Time",
      value: `${user.totalWatchTime} mins`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full px-4 py-6 sm:p-8 text-gray-200"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <motion.img
          src={user.profile}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-white/20 shadow-lg object-cover"
          whileHover={{ scale: 1.1 }}
        />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-white">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-blue-400">@{user.userName}</p>
          <p className="text-gray-400 mt-1 text-sm">{user.bio}</p>
          <div className="mt-2 text-sm text-gray-500">
             {user.college} | Year {user.year}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg text-center hover:shadow-blue-500/20 hover:border-blue-400/20"
          >
            <div className="flex justify-center text-blue-400 mb-2">
              {stat.icon}
            </div>
            <div className="text-lg font-semibold text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/10 p-4 shadow-xl"
        >
          <h3 className="text-lg font-semibold mb-3 text-blue-400">
            Weekly XP Progress
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#60a5fa"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/10 p-4 shadow-xl"
        >
          <h3 className="text-lg font-semibold mb-3 text-purple-400">
            Watch Time (mins)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={watchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="mins" fill="#a78bfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashBoardData;
