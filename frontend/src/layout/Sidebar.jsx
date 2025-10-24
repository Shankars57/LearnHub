import { Search, Menu, X, PlusCircle, Lock } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");
    setSocket(s);

    s.on("channels_list", (list) => setChannels(list));
    s.on("room_created", (room) =>
      toast.success(`Room "${room.name}" created by ${room.admin}`)
    );
    s.on("room_error", (msg) => toast.error(msg));

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [channels]);

  const filteredData = channels.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoom = () => {
    if (!roomName.trim() || !username.trim()) {
      toast.error("Enter both room name and username!");
      return;
    }
    socket.emit("create_room", {
      name: roomName,
      user: username,
      password: roomPassword,
    });
    setRoomName("");
    setRoomPassword("");
  };

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
        className={`fixed md:static top-14 left-0  h-full w-72 bg-gray-800/90 border-r 
        border-gray-700 shadow-lg flex flex-col transform transition-transform duration-300 z-40 ${
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

        <div className="px-4 py-3 border-b border-gray-700 space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Name"
            className="w-full px-3 py-2 bg-gray-700/60 rounded-lg text-white outline-none text-sm"
          />
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="New Room Name"
            className="w-full px-3 py-2 bg-gray-700/60 rounded-lg text-white outline-none text-sm"
          />
          <input
            type="password"
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
            placeholder="Room Code (optional)"
            className="w-full px-3 py-2 bg-gray-700/60 rounded-lg text-white outline-none text-sm"
          />
          <button
            onClick={handleCreateRoom}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} /> Create Room
          </button>
        </div>

        <div className="flex items-center mx-4 my-3 px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 w-full bg-transparent outline-none text-sm text-white"
            placeholder="Search channels..."
          />
        </div>

        <div
          ref={scrollRef}
          className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar pb-6 h-screen"
        >
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <NavLink
                key={idx}
                to={`/chats/${item.id}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/60 to-blue-400/40 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/60"
                  }`
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium truncate"># {item.name}</span>
                  {item.password && (
                    <span
                      className="text-xs text-red-400
                     flex items-center gap-1
                    "
                    >
                      <Lock size={12} /> Protected
                    </span>
                  )}
                  {item.admin && (
                    <span className="text-xs text-gray-400">
                      Admin: {item.admin}
                    </span>
                  )}
                </div>
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
