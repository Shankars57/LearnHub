import { Camera, Flame, Medal, MoveLeft, Timer, X } from "lucide-react";
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
    { icon: Medal, level: "Level", xp: stats.level },
    { icon: Flame, level: "Days", xp: stats.streak },
    { icon: Timer, level: "Hours", xp: stats.studyTime },
  ];

  return (
    <section className="relative max-w-full bg-gradient-to-tr from-black-900 via-black-800 to-blue-950 sm:px-10 sm:py-5 lg:px-34 py-15">
      <div className="relative opacity-100 top-10 bg-grid-pattern"></div>
      <div className="relative opacity-100 bottom-10 bg-grid-pattern"></div>
      <div className="group inline-block mb-5">
        <button
          onClick={() => navigate("/")}
          className="flex text-xl items-center text-gray-300 gap-2"
        >
          <MoveLeft className="relative group-hover:-left-2" /> Back
        </button>
      </div>
      <div className="sm:px-5 lg:px-5 relative sm:w-full py-8 bg-violet-600/10 shadow-xs shadow-blue-700 rounded-lg flex flex-wrap items-center justify-center gap-4">
        <div className="relative group px-1 py-1 shadow-xl shadow-blue-600/20 bg-white/40 w-42 h-42 flex items-center justify-center rounded-full">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.profile
                ? user.profile
                : avatarUrl
            }
            alt="Profile Preview"
            className="w-40 h-40 rounded-full object-cover select-none pointer-events-none"
          />
          {image && (
            <span className="opacity-0 flex items-center justify-center group-hover:opacity-100 absolute inset-0 w-full h-full bg-black/30 text-white rounded-full">
              <X onClick={() => setImage(null)} className="cursor-pointer" />
            </span>
          )}
          <span className="absolute cursor-pointer bottom-2 right-5 bg-white px-1 py-1 rounded-full">
            <input
              onChange={handleImage}
              type="file"
              title="select picture"
              className="w-full h-full absolute opacity-0"
            />
            <Camera size={20} className="text-blue-500" />
          </span>
        </div>
        <div className="flex flex-col flex-wrap items-center justify-center">
          <div className="flex flex-wrap justify-center gap-3 items-center">
            <h1 className="capitalize text-center flex gap-2 text-2xl text-white font-bold">
              {userData.firstName}
              <span className="capitalize">
                {userData.lastName + " ".toUpperCase()}
              </span>
            </h1>
            <p className="px-2 bg-white/30 text-white rounded-lg">
              @
              {userData.userName
                ? userData.userName
                : userData.firstName + "".toLowerCase()}
            </p>
          </div>
          <p className="sm:text-xs px-4 w-100 mx-auto text-center lg:text-lg text-white/70">
            {userData.bio
              ? userData.bio
              : "Hey! Welcome to LearnHub, Please updated your bio in settings."}
          </p>
          <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-4 flex-nowrap overflow-x-auto">
            {studentStatusData.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 sm:gap-3 bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-3 sm:px-4 py-2 min-w-[90px] sm:min-w-[110px] md:min-w-[120px] lg:min-w-[130px]"
                >
                  <div className="bg-white/30 p-1.5 sm:p-2 rounded-full flex items-center justify-center">
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col text-white text-xs sm:text-sm md:text-base lg:text-base">
                    <span className="font-semibold">{item.level}</span>
                    <span className="text-gray-200">{item.xp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:hidden max-sm:block ">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm absolute max-sm:top-5 top-1 max-sm:right-2 right-10 font-medium text-white rounded-md bg-red-500/70 hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center py-4"
      >
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-1 flex gap-1 shadow-md shadow-black/50">
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
      {state === "ov" ? (
        <UserOverview />
      ) : (
        <div className="py-10">
          <Settings
            user={user}
            setUserData={setUserData}
            image={image ? image : ""}
            setImage={setImage}
          />
        </div>
      )}
    </section>
  );
};

export default Profile;
