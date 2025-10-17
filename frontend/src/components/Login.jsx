import React, { useEffect, useState, useContext } from "react";
import { LearnContext } from "../../context/LearnContextProvider";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false);
  const { token, setToken, axios, setUserData } = useContext(LearnContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    year: "",
    roll: "",
    email: "",
    password: "",
    college: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/user/${state}`, formData);

      if (data.success) {
        toast.success(data.message);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setFormData({
          firstName: "",
          lastName: "",
          year: "",
          roll: "",
          email: "",
          password: "",
          college: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-navy-900 via-blue-950 to-black px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl backdrop-blur-2xl bg-white/10 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm uppercase tracking-wide text-blue-300/80 font-semibold">
              Welcome to LearnHub
            </p>
            <h1 className="text-blue-300 text-2xl sm:text-3xl font-extrabold mt-2 capitalize">
              {state === "signup" ? "Create Your Account" : "Login to Continue"}
            </h1>
            <p className="text-gray-300/80 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              {state === "signup"
                ? "Join thousands of learners collaborating through playlists, group chats, and AI-powered study tools."
                : "Access your personalized playlists, chat groups, and AI mentor all in one place."}
            </p>
          </div>

          {state === "signup" && (
            <>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  required
                  placeholder="First name"
                  className="border border-gray-100/20 text-white px-3 py-2 rounded-lg placeholder-white/60 outline-none bg-transparent focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  required
                  className="border border-gray-100/20 text-white px-3 py-2 rounded-lg placeholder-white/60 outline-none bg-transparent focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={onChangeHandler}
                  required
                  placeholder="Year of study e.g. 4"
                  className="border border-gray-100/20 text-white px-3 py-2 rounded-lg placeholder-white/60 outline-none bg-transparent focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  type="text"
                  name="roll"
                  value={formData.roll}
                  required
                  onChange={onChangeHandler}
                  placeholder="Roll no / College ID"
                  className="border border-gray-100/20 text-white px-3 py-2 rounded-lg placeholder-white/60 outline-none bg-transparent focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>

              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={onChangeHandler}
                required
                placeholder="College / University name e.g. ACET"
                className="border border-gray-100/20 text-white px-3 py-2 rounded-lg placeholder-white/60 outline-none bg-transparent focus:ring-2 focus:ring-blue-500 w-full"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            required
            placeholder="Email e.g. user@gmail.com"
            className="border border-gray-100/20 text-white px-3 py-2 rounded-lg placeholder-white/60 outline-none bg-transparent focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            placeholder="Password"
            className="border border-gray-100/20 text-white px-3 py-2 rounded-lg placeholder-white/60 outline-none bg-transparent focus:ring-2 focus:ring-blue-500 w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-all duration-300 text-white font-semibold py-2 px-6 rounded-lg shadow-lg shadow-blue-700/30 w-full sm:w-auto mx-auto`}
          >
            {loading
              ? "Please wait..."
              : state === "signup"
              ? "Create Account"
              : "Login"}
          </button>

          <p className="text-center text-gray-300 mt-4 text-sm">
            {state === "signup" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-blue-400 underline cursor-pointer hover:text-blue-300"
                >
                  Login
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => setState("signup")}
                  className="text-blue-400 underline cursor-pointer hover:text-blue-300"
                >
                  Sign Up
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
