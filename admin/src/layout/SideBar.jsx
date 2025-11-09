import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Home,
  LampDesk,
  LogOut,
  MessageCircleIcon,
  Settings,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { name: "Dashboard", icon: <Home size={20} /> },
  { name: "Users", icon: <User size={20} /> },
  { name: "Materials", icon: <Book size={20} /> },
  { name: "ChatRoom", icon: <MessageCircleIcon size={20} /> },
  { name: "Settings", icon: <Settings size={20} /> },
];

const SideBar = () => {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      animate={{
        width: open ? 240 : 80,
      }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 100,
      }}
      className="relative  h-screen bg-gray-800 flex flex-col py-6 shadow-xl"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={!open ? { rotate: 180 } : { rotate: 0 }}
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-8 bg-gray-700 text-white p-1.5 rounded-full border z-9999 border-gray-600 shadow-md"
      >
        <motion.div
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </motion.div>
      </motion.button>

      <motion.div
        layout
        className={`flex items-center ${
          open ? "justify-center gap-2" : "justify-center"
        } mb-10`}
      >
        <div className="flex items-center gap-2">
          <LampDesk className="text-white w-7 h-7" />
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="hidden md:block text-white text-xl font-bold tracking-wide"
              >
                LearnHub
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="border-t border-gray-700 mb-6 mx-3"></div>

      <motion.div
        className="flex flex-col gap-3 px-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <NavLink
              to={item.name.toLowerCase()}
              end={item.name === "Dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all duration-200 
                 ${
                   isActive
                     ? "bg-gray-700 font-semibold text-white"
                     : "hover:bg-gray-700/50"
                 }`
              }
            >
              <span className="min-w-[24px] flex justify-center">
                {item.icon}
              </span>

              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm tracking-wide hidden  md:block "
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex items-center gap-2 absolute bottom-20 left-10 w-full   ">
        {!open && (
          <AnimatePresence>
            <LogOut
              className="text-white w-7 h-7 relative -left-5"
              initial={{ rotate: 0 }}
              animate={{ rotate: 270 }}
            />
          </AnimatePresence>
        )}
        <AnimatePresence>
          {open && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="text-white text-md font-small tracking-wide flex items-center gap-2 bg-red-500 px-2 py-2 rounded-md"
            >
              <span>
                {" "}
                <LogOut className="text-white w-4 h-4" />
              </span>{" "}
              Logout
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SideBar;
