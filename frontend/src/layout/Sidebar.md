import {
Search,
Menu,
X,
PlusCircle,
Lock,
MoreVertical,
Trash,
} from "lucide-react";
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
const [username, setUsername] = useState(
() => localStorage.getItem("username") || ""
);
const [socket, setSocket] = useState(null);
const [activeDropdown, setActiveDropdown] = useState(null);
const scrollRef = useRef(null);

// Default rooms (cannot be deleted)
const defaultRooms = ["general", "dsa", "web", "aiml", "system", "career"];

// Persist username in localStorage
useEffect(() => {
if (username) localStorage.setItem("username", username);
}, [username]);

// Initialize Socket.IO connection
useEffect(() => {
const s = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");
setSocket(s);

    // Receive list of all channels
    s.on("channels_list", (list) => setChannels(list));

    // Room creation success
    s.on("room_created", (room) =>
      toast.success(`Room "${room.name}" created by ${room.admin}`)
    );

    // Errors
    s.on("room_error", (msg) => toast.error(msg));

    // Room deletion success
    s.on("room_deleted", ({ roomId }) => {
      setChannels((prev) => prev.filter((ch) => ch._id !== roomId));
      toast.success("Room deleted successfully");
    });

    return () => s.disconnect();

}, []);

// Auto scroll channels to bottom when new channels are added
useEffect(() => {
if (scrollRef.current) {
scrollRef.current.scrollTo({
top: scrollRef.current.scrollHeight,
behavior: "smooth",
});
}
}, [channels]);

// Filter channels by search term
const filteredData = channels.filter((item) =>
item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Create a new custom room
const handleCreateRoom = () => {
if (!roomName.trim() || !username.trim()) {
toast.error("Enter both room name and username!");
return;
}

    socket.emit("create_room", {
      name: roomName.trim(),
      user: username.trim(),
      password: roomPassword.trim() || null,
    });

    setRoomName("");
    setRoomPassword("");

};

// Delete a custom room (only by admin)
const handleDeleteRoom = (roomId, roomName) => {
if (!confirm(`Are you sure you want to delete room "${roomName}"?`)) return;
socket.emit("delete_room", { roomId, user: username });
setActiveDropdown(null);
};

return (
<>
{/_ Mobile sidebar toggle button _/}
{!open && (
<button
onClick={() => setOpen(true)}
className="md:hidden fixed top-20 left-4 z-50 bg-gray-800/90 p-2 rounded-lg text-white" >
<Menu size={22} />
</button>
)}

      {/* Sidebar container */}
      <div
        className={`fixed md:static top-14 left-0 h-full w-72 bg-gray-800/90 border-r
        border-gray-700 shadow-lg flex flex-col transform transition-transform duration-300 z-40 rounded-lg ${
          open ? "translate-x-0" : "-translate-x-full md:-translate-x-5"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-white text-xl font-semibold">Channels</h1>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Create Room Section */}
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

        {/* Search Bar */}
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

        {/* Channel List */}
        <div
          ref={scrollRef}
          className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar pb-10"
        >
          {filteredData.length > 0 ? (
            filteredData.map((item) => {
              const isDefault = defaultRooms.includes(item.name.toLowerCase());
              const isCustom = !isDefault;

              return (
                <div
                  key={item._id}
                  className="group relative flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"
                >
                  {/* Channel Navigation Link */}
                  <NavLink
                    to={`/chats/${item._id}`}
                    className={({ isActive }) =>
                      `flex-1 text-left ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/60 to-blue-400/40 text-white px-2 py-1 rounded-lg"
                          : "text-gray-300"
                      }`
                    }
                  >
                    <div className="flex flex-col">
                      <span className="font-medium truncate">
                        # {item.name}
                      </span>

                      {item.password && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <Lock size={12} /> Protected
                        </span>
                      )}

                      <span className="text-xs text-gray-400">
                        Admin: {item.admin || "System"}
                      </span>
                    </div>
                  </NavLink>

                  {/* Delete button dropdown (visible only for admin + custom room) */}
                  {isCustom && item.admin === username && (
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item._id ? null : item._id
                          )
                        }
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeDropdown === item._id && (
                        <div className="absolute right-0 top-6 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50 min-w-[120px]">
                          <button
                            onClick={() =>
                              handleDeleteRoom(item._id, item.name)
                            }
                            className="flex items-center px-4 py-2 text-xs text-red-400 hover:bg-gray-700 hover:text-red-600 rounded-md w-full text-left gap-2"
                          >
                            <Trash size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm px-4">No channels found</p>
          )}
        </div>
      </div>
    </>

);
};

export default Sidebar;

/**\* Sidebar \*\***/

import {
Search,
Menu,
X,
PlusCircle,
Lock,
MoreVertical,
Trash,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const Sidebar = () => {
// --- State ---
const [searchTerm, setSearchTerm] = useState("");
const [open, setOpen] = useState(false);
const [channels, setChannels] = useState([]);
const [roomName, setRoomName] = useState("");
const [roomPassword, setRoomPassword] = useState("");
const [username, setUsername] = useState(
() => localStorage.getItem("username") || ""
);
const [socket, setSocket] = useState(null);
const scrollRef = useRef(null);

// Default system rooms
const defaultRooms = ["general", "dsa", "web", "aiml", "system", "career"];

// --- Persist username ---
useEffect(() => {
if (username) localStorage.setItem("username", username);
}, [username]);

// --- Socket.IO connection ---
useEffect(() => {
const s = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");
setSocket(s);

    s.on("channels_list", (list) => setChannels(list));
    s.on("room_created", (room) =>
      toast.success(`Room "${room.name}" created by ${room.admin}`)
    );
    s.on("room_error", (msg) => toast.error(msg));
    s.on("room_deleted", ({ roomId }) => {
      setChannels((prev) => prev.filter((ch) => ch.id !== roomId));
      toast.success(`#${roomId} deleted`);
    });

    return () => s.disconnect();

}, []);

// --- Scroll to bottom on channels update ---
useEffect(() => {
if (scrollRef.current) {
scrollRef.current.scrollTo({
top: scrollRef.current.scrollHeight,
behavior: "smooth",
});
}
}, [channels]);

// Filter channels based on search term
const filteredData = channels.filter((item) =>
item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// --- Create a new room ---
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

// --- Delete a custom room ---
const handleDeleteRoom = (roomId) => {
if (!confirm(`Are you sure you want to delete #${roomId}?`)) return;
socket.emit("delete_room", { roomId, user: username });
};

return (
<>
{/_ Mobile Menu Toggle _/}
{!open && (
<button
onClick={() => setOpen(true)}
className="md:hidden fixed top-20 left-4 z-50 bg-gray-800/90 p-2 rounded-lg text-white" >
<Menu size={22} />
</button>
)}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-14 left-0 h-full w-72 bg-gray-800/90 border-r
        border-gray-700 shadow-lg flex flex-col transform transition-transform duration-300 z-40 rounded-lg ${
          open ? "translate-x-0" : "-translate-x-full md:-translate-x-5"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-white text-xl font-semibold">Channels</h1>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Create Room Inputs */}
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

        {/* Search Bar */}
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

        {/* Channels List */}
        <div
          ref={scrollRef}
          className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar pb-10"
        >
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => {
              // Only non-default rooms are custom
              const isCustom = item.admin && !defaultRooms.includes(item.id);

              return (
                <div
                  key={idx}
                  className="group relative flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"
                >
                  {/* Channel Link */}
                  <NavLink
                    to={`/chats/${item.id}`}
                    className={({ isActive }) =>
                      `flex-1 text-left ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/60 to-blue-400/40 text-white px-2 py-1 rounded-lg"
                          : "text-gray-300"
                      }`
                    }
                  >
                    <div className="flex flex-col">
                      <span className="font-medium truncate">
                        # {item.name}
                      </span>
                      {item.password && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
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


                  {isCustom && item.admin === username && (
                    <div className="group relative flex-shrink-0">
                      <div className="cursor-pointer text-gray-400 hover:text-white">
                        <MoreVertical size={16} />
                      </div>
                      <div className="absolute top-4 -right-5 hidden group-hover:block bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50 min-w-[120px]">
                        <button
                          onClick={() => handleDeleteRoom(item.id)}
                          className="flex items-center px-4 py-2 text-xs text-red-400 hover:bg-gray-700 hover:text-red-600 rounded-md w-full text-left gap-2"
                        >
                          <Trash size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm px-4">No channels found</p>
          )}
        </div>
      </div>
    </>

);
};

export default Sidebar;
