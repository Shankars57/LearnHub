import { Camera, Flame, Medal, MoveLeft, Timer, X, LogOut } from "lucide-react";
import Settings from "../components/Settings";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LearnContext } from "../../context/LearnContextProvider";
import { motion } from "framer-motion";
import axios from "axios";
import UserOverview from "../components/UserOverView";

const Profile = () => {
  const { userData, setToken, setUserData } = useContext(LearnContext);
  const navigate = useNavigate();
  const user = { ...userData };
  const [state, setState] = useState("ov");
  const [image, setImage] = useState(null);
  const [stats, setStats] = useState({
    level: "-",
    xp: "-",
    streak: "-",
    studyTime: "-",
  });

  const initials = userData?.firstName
    ? userData.firstName.slice(0, 2).toUpperCase()
    : "U";

  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;

  const handleLogout = () => {
    const availToken = localStorage.getItem("token");
    if (availToken) {
      setToken("");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleImage = (e) => {
    const img = e.target.files[0];
    if (img) {
      setImage(img);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (!userData?._id) return;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/user/stats/${userData._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const data = res.data.data;
          setStats({
            level: data.level,
            xp: data.xp,
            streak: data.streak,
            studyTime: data.totalWatchTime,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [userData?._id]);

  const studentStatusData = [
    { icon: Medal, label: "Level", value: stats.level },
    { icon: Flame, label: "Streak", value: stats.streak },
    { icon: Timer, label: "Watch Time", value: stats.studyTime + " mins" },
  ];

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-10 py-10 bg-gradient-to-tr from-gray-950 via-gray-900 to-blue-950 min-h-screen">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <MoveLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-5xl mx-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-25"></div>

        <div className="relative bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
        
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
            <div className="relative group">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : user?.profile
                    ? user.profile
                    : avatarUrl
                }
                alt="Profile"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-white/20 shadow-lg object-cover"
              />
              {image && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <X
                    onClick={() => setImage(null)}
                    className="cursor-pointer text-white"
                  />
                </span>
              )}
              <span className="absolute cursor-pointer bottom-2 right-4 bg-white px-1 py-1 rounded-full">
                <input
                  onChange={handleImage}
                  type="file"
                  title="Select picture"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Camera size={20} className="text-blue-500" />
              </span>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-semibold text-white">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-blue-400">@{userData.userName}</p>
              <p className="text-gray-400 mt-1 text-sm max-w-md">
                {userData.bio ||
                  "Hey! Welcome to LearnHub. Update your bio in settings."}
              </p>
              <div className="mt-2 text-gray-500 text-sm">
                {userData.college} | Year {userData.year}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="mt-4  flex items-center gap-2 text-sm bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-md text-white shadow-md"
              >
                <LogOut size={16} /> Logout
              </motion.button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {studentStatusData.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-center shadow-lg hover:shadow-blue-500/20 hover:border-blue-400/20"
                >
                  <div className="flex justify-center text-blue-400 mb-2">
                    <Icon size={22} />
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {item.value}
                  </div>
                  <div className="text-gray-400 text-sm">{item.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mt-10"
      >
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-1 flex gap-1 shadow-md shadow-black/40">
          {["ov", "set"].map((key) => (
            <motion.button
              key={key}
              onClick={() => setState(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                state === key
                  ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/30"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {key === "ov" ? "Overview" : "Settings"}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="mt-8">
        {state === "ov" ? (
          <UserOverview />
        ) : (
          <Settings
            user={user}
            setUserData={setUserData}
            image={image ? image : ""}
            setImage={setImage}
          />
        )}
      </div>
    </section>
  );
};

export default Profile;
