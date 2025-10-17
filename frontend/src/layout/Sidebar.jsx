import { Search, Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  const filteredData = sidebarData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-20 left-4 z-50 bg-gray-800/90 p-2 rounded-lg text-white"
        >
          <Menu size={22} />
        </button>
      )}

      <div
        className={`fixed md:static top-20 left-0 h-full w-64 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-r-xl shadow-lg flex flex-col transform transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-white text-xl font-semibold">Channels</h1>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex items-center mx-4 my-3 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 focus-within:ring-2 focus-within:ring-blue-400">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 w-full bg-transparent outline-none text-sm placeholder:text-gray-400 text-white"
            placeholder="Search channels..."
          />
        </div>

        <div className="flex-1 px-2 space-y-2 overflow-y-auto pb-6">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <NavLink
                key={idx}
                to={`/chats/${item.path}`}
                end={item.path === "general"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/60 to-blue-400/40 text-white shadow-md"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/60"
                  }`
                }
              >
                <span className="truncate sm:inline"># {item.name}</span>
              </NavLink>
            ))
          ) : (
            <p className="text-gray-500 text-sm px-4">No channels found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
