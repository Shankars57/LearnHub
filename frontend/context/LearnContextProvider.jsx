import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const LearnContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const LearnContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [materialsData, setMaterialsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [uploadState, setUploadState] = useState(false);
  const getAllMaterials = async () => {
    try {
      const { data } = await axios.get("/api/material/get-materials");
      if (data.success) {
        setMaterialsData(data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllMaterials();
  }, [uploadState]);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setToken(getToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${getToken}`;
    }
  }, []);
  const getUserData = async () => {
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const { data } = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) getUserData();
  }, [token]);
  const context = {
    axios,
    materialsData,
    token,
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
