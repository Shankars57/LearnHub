import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Book,
  Check,
  ChevronDown,
  Home,
  Menu,
  MessageSquare,
  Palette,
  Play,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LearnContext } from "../../context/LearnContextProvider";
import { appThemeOptions, useThemeStore } from "../../store/useThemeStore";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Playlist", path: "/playlist", icon: Play },
  {
    label: "Materials",
    path: "/materials",
    dropdown: [
      { label: "Materials", path: "/materials" },
      { label: "Cheatsheets", path: "/cheatsheets" },
      { label: "Roadmaps", path: "/roadmaps" },
      { label: "Resume Templates", path: "/resumes" },
    ],
  },
  { label: "Chats", path: "/chats", icon: MessageSquare },
  { label: "AI", path: "/ai", icon: Sparkles },
];

const navVariants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", duration: 0.25, staggerChildren: 0.06 },
  },
};

const itemVariants = {
  initial: { y: -8, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isMobileMaterialsOpen, setIsMobileMaterialsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useContext(LearnContext);
  const { theme, setTheme } = useThemeStore();

  const profileRef = useRef(null);
  const themeRef = useRef(null);

  const activePath = location.pathname;

  const activeLabel = useMemo(
    () =>
      navItems.find((item) => {
        if (!item.dropdown) return item.path === activePath;
        return item.dropdown.some((sub) => sub.path === activePath);
      })?.label,
    [activePath]
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsThemeOpen(false);
  }, [activePath]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    if (!localStorage.getItem("token")) return;
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  const isNavActive = (item) => {
    if (!item.dropdown) return item.path === activePath;
    return item.dropdown.some((sub) => sub.path === activePath);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "theme-navbar shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Book size={26} className="theme-accent" />
            <span className="font-bold text-xl theme-text">LearnHub</span>
          </Link>

          <motion.div
            variants={navVariants}
            initial="initial"
            animate="animate"
            className="hidden md:flex items-center gap-3 lg:gap-5"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item);
              const itemClass = active
                ? "theme-btn text-white shadow-md"
                : "theme-btn-secondary theme-text";

              if (item.dropdown) {
                return (
                  <motion.div
                    key={item.path}
                    variants={itemVariants}
                    className="relative"
                    onMouseEnter={() => setIsMaterialsOpen(true)}
                    onMouseLeave={() => setIsMaterialsOpen(false)}
                  >
                    <button
                      type="button"
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${itemClass}`}
                    >
                      {item.label}
                      <ChevronDown size={15} />
                    </button>
                    {isMaterialsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-10 left-0 min-w-52 theme-panel rounded-xl p-2 flex flex-col gap-1"
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`px-3 py-2 rounded-lg text-sm transition ${
                              activePath === subItem.path
                                ? "theme-btn text-white"
                                : "theme-muted hover:opacity-80"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                );
              }

              return (
                <motion.div key={item.path} variants={itemVariants}>
                  <Link
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${itemClass}`}
                  >
                    {Icon ? <Icon size={16} /> : null}
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}

            <div className="relative" ref={themeRef}>
              <button
                type="button"
                onClick={() => setIsThemeOpen((prev) => !prev)}
                className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 theme-btn-secondary theme-text"
              >
                <Palette size={16} />
                Theme
              </button>
              {isThemeOpen && (
                <div className="absolute top-11 right-0 min-w-44 theme-panel rounded-xl p-2 flex flex-col gap-1">
                  {appThemeOptions.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      type="button"
                      onClick={() => setTheme(themeOption.id)}
                      className={`px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between ${
                        theme === themeOption.id
                          ? "theme-btn text-white"
                          : "theme-muted hover:opacity-80"
                      }`}
                    >
                      {themeOption.label}
                      {theme === themeOption.id ? <Check size={15} /> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center rounded-full theme-btn-secondary theme-text"
              >
                <User size={16} />
              </button>
              {isProfileOpen && (
                <div className="absolute top-11 right-0 min-w-36 theme-panel rounded-xl p-2 flex flex-col gap-1">
                  <Link
                    to="/profile"
                    className="px-3 py-2 rounded-lg text-sm theme-muted hover:opacity-80"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg text-sm text-left text-red-500 hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 rounded-lg theme-btn-secondary theme-text flex items-center justify-center"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="theme-panel rounded-xl p-3 space-y-2">
              {navItems.map((item) => {
                const active = isNavActive(item);
                if (item.dropdown) {
                  return (
                    <div key={item.path} className="space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setIsMobileMaterialsOpen((prevState) => !prevState)
                        }
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                          active
                            ? "theme-btn text-white"
                            : "theme-btn-secondary theme-text"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            isMobileMaterialsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isMobileMaterialsOpen && (
                        <div className="pl-2 space-y-1">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`block px-3 py-2 rounded-lg text-sm ${
                                activePath === subItem.path
                                  ? "theme-btn text-white"
                                  : "theme-btn-secondary theme-muted"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      active ? "theme-btn text-white" : "theme-btn-secondary theme-text"
                    }`}
                  >
                    {Icon ? <Icon size={16} /> : null}
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-[var(--border-color)]">
                <p className="text-xs uppercase tracking-[0.2em] theme-muted mb-2">
                  App Theme
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {appThemeOptions.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      type="button"
                      onClick={() => setTheme(themeOption.id)}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold ${
                        theme === themeOption.id
                          ? "theme-btn text-white"
                          : "theme-btn-secondary theme-text"
                      }`}
                    >
                      {themeOption.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex gap-2">
                <Link
                  to="/profile"
                  className="flex-1 px-3 py-2 rounded-lg text-sm text-center theme-btn-secondary theme-text"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 px-3 py-2 rounded-lg text-sm text-center text-red-500 border border-red-500/40"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isMenuOpen ? null : (
        <div className="md:hidden px-4 pb-2">
          <p className="text-center text-xs theme-muted">
            Current: {activeLabel || "Explore LearnHub"}
          </p>
        </div>
      )}
    </header>
  );
};

export default Navbar;
