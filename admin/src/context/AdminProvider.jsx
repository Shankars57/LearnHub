import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUserData } from "../store/useUsersData";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const { setTotalUsers, setUsers } = useUserData();
  const { setMaterials, setChatRooms, chatRooms } = useStore();
  const [uploadState, setUploadState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const getTotalUsers = async () => {
    try {
      const { data } = await axios.get("/api/user/total-users");
      if (data.success) {
        setTotalUsers(data.totalUsers.length);
        setUsers(data.totalUsers);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMaterials = async () => {
    try {
      const { data } = await axios.get("/api/material/get-materials");
      if (data.success) setMaterials(data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getMaterials();
  }, [uploadState]);
  const getChatRooms = async () => {
    try {
      const { data } = await axios.get("/api/channel/get-channels");
      if (data.success) setChatRooms(data.channels);
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage
      .getItem("adminToken")
      ?.replace(/"/g, "")
      .trim();
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    } else {
      localStorage.removeItem("adminToken");
      setToken("");
      navigate("/");
    }
  }, []);

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([getTotalUsers(), getChatRooms(), getMaterials()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const context = {
    axios,
    refreshAll,
    loading,
    token,
    setToken,
    setUploadState,
  };

  return (
    <AdminContext.Provider value={context}>{children}</AdminContext.Provider>
  );
};

export default AdminProvider;
