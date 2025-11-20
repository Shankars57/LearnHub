import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useColors } from "../hooks/useColors";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

const renderYouTube = (text) => {
  const yt =
    /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+)/g;

  if (!yt.test(text)) return null;

  const url = text.match(yt)[0];
  let id = "";

  if (url.includes("watch?v=")) id = url.split("watch?v=")[1].split("&")[0];
  else id = url.split("/").pop().split("?")[0];

  return (
    <iframe
      className="rounded-lg mt-2"
      width="300"
      height="170"
      src={`https://www.youtube.com/embed/${id}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    ></iframe>
  );
};

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chatRooms } = useStore();
  const colors = useColors();

  const room = useMemo(
    () => chatRooms.find((r) => r._id === id),
    [chatRooms, id]
  );

  if (!room) {
    return (
      <div
        className={`${colors.bg} ${colors.text} h-[90vh] flex items-center justify-center`}
      >
        Room Not Found
      </div>
    );
  }

  return (
    <div className={`${colors.bg} ${colors.text} h-[87vh] flex flex-col`}>
      <div
        className={`px-5 py-3 flex items-center gap-3 border-b ${colors.border}`}
      >
        <ArrowLeft
          size={22}
          className="cursor-pointer hover:opacity-70"
          onClick={() => navigate(-1)}
        />
        <div>
          <h1 className="text-xl font-bold capitalize">{room.name}</h1>
          <p className="text-sm opacity-70">Admin: {room.admin || "System"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll p-5">
        {room.messages?.length === 0 && (
          <p className="text-center opacity-50 mt-10">No messages yet</p>
        )}

        <div className="flex flex-col gap-3">
          {room.messages?.map((msg, i) => {
            const isUser = msg.sender === "You" || msg.sender === "admin";
            const youtubeEmbed = renderYouTube(msg.text);

            return (
              <div
                key={i}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-xl ${
                    isUser ? colors.msgUser : colors.msgBot
                  }`}
                >
                  {!isUser && (
                    <p className="text-xs opacity-80 mb-1">{msg.sender}</p>
                  )}

                  {msg.user && (
                    <p
                      className={`text-xs px-2 py-1 rounded-lg inline-block ${colors.text} ${colors.shadow}`}
                    >
                      {msg.user}
                    </p>
                  )}

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      p: ({ children }) => (
                        <p className={`${colors.text} break-words text-sm`}>
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                        >
                          {children}
                        </a>
                      ),
                      li: ({ children }) => (
                        <li className="ml-4 list-disc">{children}</li>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>

                  {youtubeEmbed}

                  <p className="text-[10px] opacity-50 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`px-5 py-3 border-t ${colors.border} opacity-60 text-sm`}>
        Message input will be here later...
      </div>
    </div>
  );
};

export default Chat;
