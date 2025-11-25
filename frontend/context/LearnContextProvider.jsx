import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/useAuthStore";
export const LearnContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const LearnContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuthStore();
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({});
  const [materialsData, setMaterialsData] = useState([]);
  const [uploadState, setUploadState] = useState(false);

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token")?.replace(/"/g, "").trim();
    if (storedToken && isTokenValid(storedToken)) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    } else {
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    }
  }, []);

  const getUserData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
        const { email, ...safeUser } = data.user;
        localStorage.setItem("user", JSON.stringify(safeUser));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    }
  };

  useEffect(() => {
    if (token) getUserData();
  }, [token]);

  const getAllMaterials = async () => {
    try {
      const { data } = await axios.get("/api/material/get-materials");
      if (data.success) setMaterialsData(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAllMaterials();
  }, [uploadState]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 403) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          setToken("");
          navigate("/");
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const context = {
    axios,
    materialsData,
    token,
    navigate,
    setToken,
    userData,
    setUserData,
    uploadState,
    setUploadState,
  };

  return (
    <LearnContext.Provider value={context}>{children}</LearnContext.Provider>
  );
};

export default LearnContextProvider;
