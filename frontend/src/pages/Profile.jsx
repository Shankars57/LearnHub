import { Camera, Flame, Medal, MoveLeft, MoveRight, Timer } from "lucide-react";
import Settings from "../components/Settings";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LearnContext } from "../../context/LearnContextProvider";
import { useState } from "react";
import { motion } from "framer-motion";
const studentStatusData = [
  {
    icon: Medal,
    level: "Level",
    xp: "xp",
  },
  {
    icon: Flame,
    level: "days",
    xp: "streak",
  },
  {
    icon: Timer,
    level: "h",
    xp: "study time",
  },
];
const Profile = () => {
  const { userData, setToken, setUserData } = useContext(LearnContext);
  const navigate = useNavigate();
  const user = Object.assign(userData);
  const [state, setState] = useState("ov");

  const handleLogout = () => {
    const availToken = localStorage.getItem("token");
    if (availToken) {
      setToken("");
      localStorage.removeItem("token");
      navigate("/");
    }
  };
  useEffect(() => {
    console.log(userData, user);
  }, [user]);

  return (
    <section
      className="relative 
   max-w-full
   bg-gradient-to-tr from-black-900
    via-black-800 to-blue-950 
    sm:px-10 
    sm:py-5 
    lg:px-34 py-15"
    >
      <div className="relative opacity-100 top-10 bg-grid-pattern "></div>
      <div className="relative  opacity-100 bottom-10 bg-grid-pattern "></div>

      <div className=" group inline-block ">
        <button
          onClick={() => navigate("/")}
          className="flex text-xl items-center text-gray-300 gap-2 "
        >
          <MoveLeft className="relative group-hover:-left-2" /> Back
        </button>
      </div>
      {/*Header part */}
      <div
        className="sm:px-5 lg:px-10 
        w-full
        relative
      py-6 bg-violet-600/10 shadow-xs 
      shadow-blue-700 rounded-lg flex flex-wrap
         items-center justify-center
       gap-4"
      >
        <div
          className="relative px-1 py-1 
        shadow-xl shadow-blue-600/20 bg-white/40
        w-42 h-42 flex items-center justify-center
         rounded-full "
        >
          <img
            src={`https://info.aec.edu.in/ACET/StudentPhotos/${userData.roll}.jpg`}
            alt=""
            className="w-40 h-40 select-none  pointer-events-none object-fit rounded-full "
          />
          <span className="absolute cursor-pointer bottom-2 right-2 bg-white px-1 py-1 rounded-full ">
            <Camera size={20} className="text-blue-500" />
          </span>
        </div>
        <div className="flex flex-col flex-wrap items-center justify-center">
          <div className="flex flex-wrap justify-center gap-3 items-center">
            {" "}
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
          <p className="sm:text-xs px-4 w-100 mx-auto  text-center lg:text-lg text-white/70 ">
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
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm 
        absolute top-5 right-10
                  font-medium text-white
                   rounded-md bg-red-500/70 
                   hover:bg-red-600
                   transition-colors duration-200"
        >
          Logout
        </button>
      </div>
      {/* Body Part */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full flex items-center justify-center"
      >
        <div
          className=" px-3 mt-5 py-2   flex gap-4 bg-gray-800 text-xl rounded-lg border
         border-gray-100/10 justify-center items-center
             inline-block shadow-md shadow-gray-400/20 relative"
        >
          {["ov", "set"].map((key) => (
            <motion.button
              key={key}
              onClick={() => setState(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative z-10 text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                state === key
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {key === "ov" ? "Overview" : "Settings"}
              {state === key && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-blue-600/80 rounded-lg -z-10 shadow-lg shadow-blue-600/30"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {state === "ov" ? (
        <div className="text-white">Overview</div>
      ) : (
        <div className="py-10">
          <Settings user={user} setUserData={setUserData}/>
        </div>
      )}
    </section>
  );
};

export default Profile;
