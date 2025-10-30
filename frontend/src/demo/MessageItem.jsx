import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MoreVertical, Pin, PinOff, Trash } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import usePinnedMessage from "../../store/usePinnedMessage";
import YouTubeEmbed from "./YouTubeEmbed";

const MessageItem = memo(({ msg, username, roomId, onDelete, id }) => {
  const { pinnedMessages, setPinnedMessage, clearPinnedMessage } =
    usePinnedMessage();
  const msgId = msg._id || `${msg.user}-${msg.time}`;
  const pinnedMessage = pinnedMessages[roomId];
  const pinnedId = pinnedMessage?._id || pinnedMessage?.id;
  const isPinned = pinnedId === msgId;

  const togglePin = () => {
    if (isPinned) {
      clearPinnedMessage(roomId);
      toast.custom(() => (
        <div className="bg-white border border-red-500 px-4 py-2 rounded-lg shadow-md text-gray-800 flex items-center gap-1">
          <PinOff size={15} style={{ transform: "rotate(-25deg)" }} />
          <span>Message unpinned</span>
        </div>
      ));
    } else {
      setPinnedMessage(roomId, { ...msg, _id: msgId });
      toast.custom(() => (
        <div className="bg-white border border-green-500 px-4 py-2 rounded-lg shadow-md text-gray-800 flex items-center gap-1">
          <Pin size={15} style={{ transform: "rotate(-25deg)" }} />
          <span>Message pinned</span>
        </div>
      ));
    }
  };

  return (
    <div
      className={`px-3 py-2 rounded-lg w-fit max-w-[90%] sm:max-w-xl break-words ${
        msg.user === username
          ? "ml-auto bg-blue-100 text-gray-700"
          : "bg-gray-100 text-gray-800"
      } ${isPinned ? "sticky top-0 border-2 border-blue-500 z-10" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between">
        <p className="text-xs flex gap-5 justify-between font-semibold mb-1 px-2 py-1 rounded-lg bg-white/40 inline-block">
          <span>{msg.user}</span>
          <span className="pl-2 text-gray-600">
            {moment(msg.time).isSame(new Date(), "day")
              ? moment(msg.time).format("hh:mm A")
              : moment(msg.time).format("MMM D, hh:mm A")}
          </span>
        </p>
        <div className="relative group flex gap-1 h-10">
          <MoreVertical size={14} />
          <div className="absolute hidden group-hover:inline-block right-0">
            <button
              onClick={togglePin}
              className="px-2 py-1 bg-white/80 rounded-lg shadow-lg mr-2"
            >
              {!isPinned ? <Pin size={15} /> : <PinOff size={15} />}
            </button>
            {msg.user === username && (
              <button
                onClick={() => onDelete(msgId)}
                className="px-2 py-1 bg-white/80 rounded-lg shadow-lg"
              >
                <Trash size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <ReactMarkdown
        children={msg.text}
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <div className="mb-1 flex flex-col">{children}</div>
          ),
          a: ({ href, children }) => {
            const isYouTube = href.includes("youtu");
            if (isYouTube)
              return <YouTubeEmbed href={href}>{children}</YouTubeEmbed>;
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {children}
              </a>
            );
          },
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-lg text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-200 px-1 py-0.5 rounded text-pink-700">
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
});

export default MessageItem;
