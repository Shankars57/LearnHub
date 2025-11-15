import React from "react";
import { useStore } from "../store/useStore";
import { useColors } from "../hooks/useColors";
import { useState } from "react";

const ChatRoom = () => {
  const { chatRooms } = useStore();
  const colors = useColors();
  const [page, setPage] = useState(1);
  const limit = 3;
  const totalPage = Math.ceil(chatRooms.length / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = chatRooms.slice(start, end);

  console.log(chatRooms, paginated);

  return (
    <div
      className={`${colors.bg} ${colors.text}
    h-screen mt-1
    `}
    >
      <div className="p-4">
        <h1 className="text-3xl font-bold">ChatRooms Management</h1>
        <p className="opacity-60 px-1 text-md font-small">
          Manage and monitor all messages.
        </p>
        {paginated.map((item, i) => (
          <div key={i}>{item.name}</div>
        ))}
        <button
          disabled={page === totalPage}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded-lg border ${colors.text} ${colors.bg} ${
            colors.shadow
          } ${
            page === totalPage
              ? "opacity-40 cursor-not-allowed"
              : "hover:opacity-80"
          }`}
        >
          +
        </button>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded-lg border ${colors.text} ${colors.bg} ${
            colors.shadow
          } ${
            page === 1 ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"
          }`}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
