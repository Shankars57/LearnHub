import { Search } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const sidebarData = [
  { path: "general", name: "General" },
  { path: "dsa", name: "DSA Group" },
  { path: "web", name: "Web Dev" },
  { path: "aiml", name: "AI/ML" },
  { path: "system", name: "System Design" },
  { path: "career", name: "Career Advice" },
];

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // filter based on search
  const filteredData = sidebarData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="relative flex flex-col h-full 
      md:w-60
      sm:w-50
      bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg
      border border-gray-700"
    >
      {/* Header */}
      <div
        className="flex 
      flex-col items-center gap-3 pt-6 px-4"
      >
        <h1 className="text-white text-2xl font-semibold tracking-wide">
          Channels
        </h1>

        {/* Search box */}
        <div
          className="flex items-center
           w-full px-3 py-2 
          rounded-lg bg-gray-700/50 border border-gray-600 
          focus-within:ring-2 
          focus-within:ring-blue-400"
        >
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 w-full bg-transparent outline-none text-sm 
            placeholder:text-gray-400 text-white"
            placeholder="Search channels..."
          />
        </div>
      </div>

      <hr className="my-4 border-gray-700" />

      {/* Navigation Links */}
      <div className="flex-1 px-2 space-y-2 overflow-y-auto">
        {filteredData.length > 0 ? (
          filteredData.map((item, idx) => (
            <NavLink
              key={idx}
              to={`/chats/${item.path}`}
              end={item.path === "general"}
              className={({ isActive }) =>
                `
                flex items-center gap-2 px-4 py-2 rounded-lg
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/60 to-blue-400/40 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/60"
                }
                `
              }
            >
              <span className="hidden sm:inline"># {item.name}</span>
            </NavLink>
          ))
        ) : (
          <p className="text-gray-500 text-sm px-4">No channels found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
