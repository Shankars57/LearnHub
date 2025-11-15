import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useColors } from "../hooks/useColors";
import { useUserData } from "../store/useUsersData";
import { useStore } from "../store/useStore";
import {
  Users,
  MessageSquare,
  BookOpen,
  Clock,
  ArrowRight,
  PlaneTakeoff
} from "lucide-react";

const Dashboard = () => {
  const color = useColors();
  const { totalUsers, users } = useUserData();
  const { chatRooms, materials } = useStore();

  const extractCreatedAt = (arr) =>
    arr
      ?.map((item) => {
        if (item?.createdAt) return item;
        if (item?.user?.createdAt) return item.user;
        return null;
      })
      .filter(Boolean) || [];

  const groupByDate = (arr) => {
    const map = {};
    arr.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-CA");
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  };
  const chartData = useMemo(() => {
    const userData = groupByDate(extractCreatedAt(users || []));
    const materialData = groupByDate(extractCreatedAt(materials || []));
    const chatData = groupByDate(extractCreatedAt(chatRooms || []));
    const allDates = Array.from(
      new Set([
        ...Object.keys(userData),
        ...Object.keys(materialData),
        ...Object.keys(chatData),
      ])
    ).sort();
    return allDates.map((date) => ({
      date,
      Users: userData[date] || 0,
      Materials: materialData[date] || 0,
      Chats: chatData[date] || 0,
    }));
  }, [users, materials, chatRooms]);

  const cards = [
    {
      title: "Users",
      count: totalUsers || users?.length || 0,
      icon: <Users size={22} />,
      color: "from-indigo-500/70 to-indigo-700/90",
    },
    {
      title: "Chat Rooms",
      count: chatRooms?.length || 0,
      icon: <MessageSquare size={22} />,
      color: "from-emerald-500/70 to-emerald-700/90",
    },
    {
      title: "Materials",
      count: materials?.length || 0,
      icon: <BookOpen size={22} />,
      color: "from-pink-500/70 to-pink-700/90",
    },
  ];

  const pieData = [
    {
      name: "Users",
      value: totalUsers || users?.length || 0,
      color: "#6366f1",
    },
    { name: "Chat Rooms", value: chatRooms?.length || 0, color: "#22c55e" },
    { name: "Materials", value: materials?.length || 0, color: "#ec4899" },
  ];

  const recentActivities = useMemo(() => {
    const all = [
      ...(users || []).map((u) => ({
        type: "User",
        name: u.name || "New User",
        date: u.createdAt,
        icon: <Users className="text-indigo-400" size={18} />,
      })),
      ...(chatRooms || []).map((c) => ({
        type: "Chat",
        name: c.roomName || "New Chat Room",
        date: c.createdAt,
        icon: <MessageSquare className="text-emerald-400" size={18} />,
      })),
      ...(materials || []).map((m) => ({
        type: "Material",
        name: m.title || "New Material",
        date: m.createdAt,
        icon: <BookOpen className="text-pink-400" size={18} />,
      })),
    ];
    return all
      .filter((a) => a.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [users, chatRooms, materials]);

  return (
    <div className={`${color.bg} ${color.text} p-4 sm:p-6 md:p-10 mt-2`}>
      <motion.div
        className="mb-6 md:mb-8 text-center md:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Dashboard Overview
        </h1>
        <p className="opacity-70 text-sm sm:text-base mt-1">
          Welcome back! Here's what's happening in LearnHub today.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delayChildren: 0.2, staggerChildren: 0.1 },
          },
        }}
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.08 }}
            className={`rounded-xl bg-gradient-to-br ${card.color} p-3 sm:p-4 text-white shadow-md flex flex-col justify-center items-center hover:shadow-xl transition-transform duration-300 min-w-[90px] min-h-[80px]`}
          >
            <div className="mb-1 opacity-90">{card.icon}</div>
            <h3 className="text-xs sm:text-sm font-medium text-center">
              {card.title}
            </h3>
            <p className="text-base sm:text-lg font-bold mt-0.5">
              {card.count}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:gap-10 md:grid-cols-2">
        <motion.div
          className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-xl backdrop-blur-md border border-white/10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
            Daily Activity (Bar Overview)
          </h2>
          <div className="w-full h-[200px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Bar dataKey="Users" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Materials" fill="#ec4899" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Chats" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-xl backdrop-blur-md border border-white/10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
            User Growth Trend (Line Chart)
          </h2>
          <div className="w-full h-[200px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Users"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="Materials"
                  stroke="#ec4899"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="Chats"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-2 bg-white/10 p-4 sm:p-6 rounded-xl shadow-xl backdrop-blur-md border border-white/10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
            Data Distribution (Pie Overview)
          </h2>
          <div className="w-full h-[200px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    borderRadius: 8,
                  }}
                />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-white/10 p-4 sm:p-6 mt-8 sm:mt-10 rounded-xl shadow-xl backdrop-blur-md border border-white/10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Clock size={18} className="text-yellow-400" />
          <h2 className="text-lg sm:text-xl font-semibold">Recent Activity</h2>
        </div>

        {recentActivities.length === 0 ? (
          <p className="text-sm opacity-60 text-center">
            No recent activities yet.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {recentActivities.map((act, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between py-2 sm:py-3 hover:bg-black/10 px-2 rounded-lg"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {act.icon}
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {act.name}
                    </p>
                    <p className="text-xs opacity-60">
                      {act.type} •{" "}
                      {new Date(act.date).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="opacity-50" />
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      <motion.p
        className="text-center mt-8 sm:mt-10 text-xs sm:text-sm opacity-60 flex items-center gap-2 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Data updates automatically as your platform grows <span><PlaneTakeoff /></span>
      </motion.p>
    </div>
  );
};

export default Dashboard;
