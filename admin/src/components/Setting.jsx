import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useColors } from "../hooks/useColors";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Camera, Save, Loader2 } from "lucide-react";
import { useUserData } from "../store/useUsersData";

const Setting = () => {
  const colors = useColors();
  const fileInputRef = useRef(null);
  const { users } = useUserData();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    userName: "",
    profile: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const user = users.find((item) => item.email === "learnHubadmin@gmail.com");
  const userId = user?._id;

  useEffect(() => {
    if (user) {
      const { firstName, lastName, bio, userName, profile } = user;
      setFormData({ firstName, lastName, bio, userName, profile });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.userName)
      return toast.error("First name and username are required!");

    const payload = new FormData();
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("bio", formData.bio);
    payload.append("userName", formData.userName);
    if (formData.file) payload.append("profile_pic", formData.file);

    try {
      setLoading(true);
      const { data } = await axios.put(`/api/user/update/${userId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl =
    preview ||
    formData.profile ||
    (user?.userName
      ? `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.userName}`
      : "https://cdn-icons-png.flaticon.com/512/4140/4140048.png");

  return (
    <div className={`${colors.bg} min-h-screen flex justify-center py-10 px-4`}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-lg rounded-xl p-6 ${colors.card} ${colors.shadow}`}
      >
        <h1
          className={`text-2xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r ${colors.accent}`}
        >
          Edit Profile
        </h1>

        {user ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-24 h-24">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border border-blue-500/40 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition"
                >
                  <Camera size={14} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <p className={`${colors.textMuted} text-xs`}>
                Tap camera to update profile
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`${colors.textMuted} text-xs`}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full mt-1 p-1.5 text-sm rounded-md border ${colors.border} ${colors.bg} ${colors.text} focus:ring-1 focus:ring-blue-500 outline-none`}
                />
              </div>
              <div>
                <label className={`${colors.textMuted} text-xs`}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full mt-1 p-1.5 text-sm rounded-md border ${colors.border} ${colors.bg} ${colors.text} focus:ring-1 focus:ring-blue-500 outline-none`}
                />
              </div>
            </div>

            <div>
              <label className={`${colors.textMuted} text-xs`}>Username</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`w-full mt-1 p-1.5 text-sm rounded-md border ${colors.border} ${colors.bg} ${colors.text} focus:ring-1 focus:ring-blue-500 outline-none`}
              />
            </div>

            <div>
              <label className={`${colors.textMuted} text-xs`}>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className={`w-full mt-1 p-1.5 text-sm rounded-md border ${colors.border} ${colors.bg} ${colors.text} focus:ring-1 focus:ring-blue-500 outline-none resize-none`}
                placeholder="Write something about yourself..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm text-white font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition ${colors.shadow}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Saving...
                </>
              ) : (
                <>
                  <Save size={14} /> Save Changes
                </>
              )}
            </motion.button>
          </form>
        ) : (
          <p className="text-center text-gray-400 text-sm">
            Loading user data...
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Setting;
