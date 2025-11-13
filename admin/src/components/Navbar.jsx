import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Palette, User } from "lucide-react";
import { useTheme } from "../store/useTheme";
import { themes } from "../utils/theme";
import { useNavigate } from "react-router-dom";

const Navbar = ({ sticky }) => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const colors = themes[theme];
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`z-50 w-full flex justify-between items-center px-6 py-3 border-b ${
        colors.border
      } ${colors.bg} ${colors.text} transition-all duration-300 ${
        !sticky
          ? "sticky top-0 lg:-top-9 backdrop-blur-md bg-opacity-80 shadow-md"
          : "bg-opacity-100"
      }`}
    >
      <div className="text-lg font-semibold select-none">
        Admin <span className="opacity-70 font-normal">| Dashboard</span>
      </div>

      <div className="flex gap-6 items-center relative">
        <div className="relative">
          <Palette
            size={22}
            onClick={() => setOpen((prev) => !prev)}
            className="cursor-pointer hover:scale-110 transition-transform"
          />

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 mt-3 flex flex-col rounded-xl shadow-2xl border 
                ${colors.border} backdrop-blur-lg ${colors.chatBg}
                p-3 z-50 w-32`}
              >
                {Object.entries(themes).map(([themeName, t]) => (
                  <button
                    key={themeName}
                    onClick={() => {
                      setTheme(themeName);
                      setOpen(false);
                    }}
                    className={`capitalize text-xs w-full px-3 py-2 rounded-md transition-all mt-1 truncate cursor-pointer ${t.bg} ${t.text} hover:scale-[1.02] hover:shadow`}
                  >
                    {themeName.replace("-", " ")}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Bell
          size={22}
          className="cursor-pointer hover:scale-110 transition-transform"
        />

        <div className="flex items-center gap-2 font-medium select-none">
          <User
            size={22}
            onClick={() => navigate("settings")}
            className="p-1 hover:border rounded-full w-8 h-8"
          />
          <span className="hidden sm:inline">Welcome, Shankar</span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
