import React from "react";
import Sidebar from "../layout/Sidebar";
import { Outlet } from "react-router-dom";

const Chat = () => {
  return (
    <div className="w-[80%] mx-auto h-[90vh] pb-4 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-700">
        <Sidebar />
      </div>

      {/* Channel Content */}
      <div className="flex-1 bg-gray-950 text-white p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Chat;
