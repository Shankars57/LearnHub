import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { useColors } from "../hooks/useColors";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const ChatRoom = () => {
  const { chatRooms } = useStore();
  const colors = useColors();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 6;
  const totalPages = Math.ceil(chatRooms.length / limit);

  const start = (page - 1) * limit;
  const paginated = chatRooms.slice(start, start + limit);

  return (
    <div className={`${colors.bg} ${colors.text} min-h-screen p-6`}>
      <h1 className="text-3xl font-bold mb-1">ChatRooms Management</h1>
      <p className="opacity-70 text-sm mb-6">
        Manage chatRooms & view messages.
      </p>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginated.map((room) => (
          <div
            key={room._id}
            onClick={() => navigate(`/chatroom/${room._id}`)}
            className={`p-5 rounded-xl border ${colors.border} ${colors.card} cursor-pointer transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold capitalize">{room.name}</h2>

              <MessageCircle
                size={24}
                className="opacity-70 group-hover:opacity-100"
              />
            </div>

            <p className="text-sm opacity-60 mt-1">
              Admin: {room.admin || "System"}
            </p>

          
            <p className="text-sm opacity-60 mt-1">
              Messages: {room.messages?.length || 0}
            </p>

           
            {room.password && (
              <p className="mt-2 text-xs text-red-400 font-medium">
                🔐 Protected Room
              </p>
            )}
          </div>
        ))}
      </div>

   
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg border ${colors.border} ${
            page === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:opacity-80 cursor-pointer"
          }`}
        >
          Prev
        </button>

        <p className="text-sm opacity-80">
          Page {page} of {totalPages}
        </p>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-lg border ${colors.border} ${
            page === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:opacity-80 cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
