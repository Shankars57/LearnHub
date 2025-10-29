import React from "react";
import Sidebar from "../layout/Sidebar";
import { Outlet } from "react-router-dom";
import SideBarDemo from "../demo/SideBarDemo";

const Chat = () => {
  return (
    <section
      id="features"
      className="relative py-2 bg-gradient-to-br from-indigo-900/20 via-indigo-950/30 to-indigo-900/20 overflow-hidden"
    >
      <div className="absolute top-0 right-0 bg-grid-pattern opacity-5 -z-1"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-1"></div>
      <div className="absolute top-0 left-0 bg-grid-pattern "></div>
      <div className="flex flex-col md:flex-row md:pl-8 mx-auto h-[90vh]  ">
        <div className="w-full md:w-64 mb-4 md:mb-0 md:mr-4">
          <SideBarDemo />
        </div>
        <div
          className="flex-1
         bg-gray-950 text-white p-2  
         rounded-xl shadow-md shadow-blue-800/50 overflow-y-auto
         border border-gray-800"
        >
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Chat;
