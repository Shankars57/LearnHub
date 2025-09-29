import React, { createContext } from "react";
import axios from "axios";

export const LearnContext = createContext();

axios.defaults.baseURL = import.meta.env.BACKEND_URL;

const LearnContextProvider = ({ children }) => {
  const h = "Hello world";
  const context = {
    axios,
    h,
  };
  return (
    <LearnContext.Provider value={context}>{children}</LearnContext.Provider>
  );
};

export default LearnContextProvider;
