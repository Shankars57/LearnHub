import React, { useState, useEffect, useContext } from "react";
import {
  Book,
  User,
  Menu,
  X,
  Video,
  MarsStroke,
  GitCommitVerticalIcon,
  BookOpen,
  MessageSquare,
  Bot,
  Play,
  Star,
  Sparkles,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LearnContext } from "../../context/LearnContextProvider";

const variants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.2,
      stiffness: 500,
      damping: 50,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  initial: { y: -10, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" },
  },
};

const variants2 = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.2,
      stiffness: 200,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const childVariants2 = {
  initial: { x: -100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", duration: 0.5 },
  },
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(location.pathname);
  const { setToken } = useContext(LearnContext);
  const handleLogout = () => {
    const availToken = localStorage.getItem("token");
    if (availToken) {
      setToken("");
      localStorage.removeItem("token");
      navigate("/");
    }
  };
  const navItems = [
    { label: "Home", path: "/", icon: <Home size={18} /> },
    { label: "Playlist", path: "/playlist", icon: <Play size={18} /> },
    { label: "Materials", path: "/materials", icon: <BookOpen size={18} /> },
    {
      label: "Chats",
      path: "/chats",
      icon: <MessageSquare size={18} />,
    },
    { label: "AI", path: "/ai", icon: <Sparkles size={18} /> },
  ];

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 
      w-full transition-all
       duration-300 fade ${
         isScrolled
           ? "bg-white/10 backdrop-blur-sm shadow-md"
           : "bg-transparent"
       }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className="py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            <Link to="/" className="flex items-center gap-2">
              <Book className="text-blue-500" size={28} />
              <span
                className={`font-bold text-xl ${
                  isScrolled ? "text-gray-100" : "text-gray-100"
                }`}
              >
                LearnHub
              </span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            className="hidden md:flex items-center space-x-8"
          >
            {navItems.map((item) => (
              <motion.div
                className="overflow-hidden"
                key={item.path}
                variants={childVariants}
              >
                <Link
                  to={item.path}
                  onClick={() => setActive(item.path)}
                  className={`relative flex items-center gap-2
                  px-2 py-1 text-sm font-medium transition-colors duration-200
                 ${
                   active === item.path
                     ? "text-blue-600 font-semibold"
                     : isScrolled
                     ? "text-gray-700 hover:text-blue-600"
                     : "text-gray-200 hover:text-blue-400"
                 }`}
                >
                  {item.icon}
                  {item.label}
                  {active === item.path && (
                    <motion.div
                      layoutId="active-pill"
                      className={`absolute inset-0 
                      rounded -z-10 ${
                        isScrolled ? "bg-blue-100" : "bg-white/10"
                      }`}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            <div className="relative group">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 
      ${
        isScrolled
          ? "text-gray-700 hover:text-blue-600"
          : "text-gray-200 hover:text-blue-400"
      }
    `}
              >
                <User className="w-5 h-5" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute  -right-20  w-40 flex-col rounded-xl
               bg-white/10 backdrop-blur-md border border-white/20 
               shadow-lg p-2 opacity-0 scale-95 
               group-hover:opacity-100 group-hover:scale-100 
               group-hover:flex hidden z-50 transition-all duration-300"
              >
                <Link
                  to="/profile"
                  className="px-4 py-2 
                  text-sm font-medium text-white text-center
                   rounded-md hover:bg-white/20 transition-colors duration-200"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm 
                  font-medium text-white
                   rounded-md hover:bg-red-500/70 
                   transition-colors duration-200"
                >
                  Logout
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="text-white cursor-pointer" size={26} />
              ) : (
                <Menu className="text-white cursor-pointer" size={26} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            variants={variants2}
            initial="initial"
            animate="animate"
            className="md:hidden mt-4 pb-4 flex flex-col space-y-3"
          >
            {navItems.map((item) => (
              <motion.div key={item.path} variants={childVariants2}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setActive(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                    active === item.path
                      ? "text-blue-600 font-semibold"
                      : "text-gray-400 hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <Link
              to="/profile"
              onClick={() => {
                setActive("/profile");
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                active === "/profile"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-400 hover:text-blue-600"
              }`}
            >
              <User size={18} />
              Profile
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
