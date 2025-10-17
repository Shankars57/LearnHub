import React from "react";
import Sidebar from "../layout/Sidebar";
import { Outlet } from "react-router-dom";

const Chat = () => {
  return (
    <div className="flex flex-col md:flex-row w-[95%] md:w-[80%] mx-auto h-[90vh] pb-4">
      <div className="w-full md:w-64 mb-4 md:mb-0 md:mr-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-950 text-white p-4 sm:p-6 rounded-xl shadow-2xl shadow-blue-800/50 overflow-y-auto border border-gray-800">
        <Outlet />
      </div>
    </div>
  );
};

export default Chat;
