import React, { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MoreVertical, Pin, PinOff, Trash } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import usePinnedMessage from "../../store/usePinnedMessage";
import YouTubeEmbed from "./YouTubeEmbed";

const MessageItem = ({ msg, username, roomId, onDelete }) => {
  const { pinnedMessages, setPinnedMessage, clearPinnedMessage } =
    usePinnedMessage();
  const msgId = msg._id || `${msg.user}-${msg.time}`;
  const pinnedMessage = pinnedMessages[roomId];
  const pinnedId = pinnedMessage?._id || pinnedMessage?.id;
  const isPinned = pinnedId === msgId;
  const [menuOpen, setMenuOpen] = useState(false);

  const togglePin = () => {
    if (isPinned) {
      clearPinnedMessage(roomId);
      toast.custom(() => (
        <div className="theme-panel border border-red-500/60 px-4 py-2 rounded-lg shadow-md theme-text flex items-center gap-1">
          <PinOff size={15} style={{ transform: "rotate(-25deg)" }} />
          <span>Message unpinned</span>
        </div>
      ));
    } else {
      setPinnedMessage(roomId, { ...msg, _id: msgId });
      toast.custom(() => (
        <div className="theme-panel border border-green-500/60 px-4 py-2 rounded-lg shadow-md theme-text flex items-center gap-1">
          <Pin size={15} style={{ transform: "rotate(-25deg)" }} />
          <span>Message pinned</span>
        </div>
      ));
    }
    setMenuOpen(false);
  };

  return (
    <div
      className={`px-3 py-2 rounded-lg w-fit max-w-[90%] sm:max-w-xl break-words relative ${
        msg.user === username
          ? "ml-auto bg-gradient-to-r from-blue-500/25 to-cyan-500/20 theme-text border border-blue-500/35"
          : "theme-surface theme-text border border-[var(--border-color)]"
      } ${isPinned ? "sticky top-0 border-2 border-blue-500 z-10" : ""}`}
    >
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold mb-1 px-2 py-1 rounded-lg bg-black/10 inline-block">
          <span>{msg.user}</span>
          <span className="pl-2 theme-muted">
            {moment(msg.time).isSame(new Date(), "day")
              ? moment(msg.time).format("hh:mm A")
              : moment(msg.time).format("MMM D, hh:mm A")}
          </span>
        </p>

        {/* Menu Button (works on mobile + desktop) */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="theme-muted hover:opacity-80 focus:outline-none"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-1 theme-panel rounded-md shadow-lg border border-[var(--border-color)] z-50 w-28"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={togglePin}
                className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 flex items-center gap-2 theme-text"
              >
                {!isPinned ? (
                  <>
                    <Pin size={14} /> Pin
                  </>
                ) : (
                  <>
                    <PinOff size={14} /> Unpin
                  </>
                )}
              </button>
              {msg.user === username && (
                <button
                  onClick={() => {
                    onDelete(msgId);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <Trash size={14} /> Delete
                </button>
              )}
            </div>
          )}
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
            if (isYouTube) return <YouTubeEmbed href={href} />;
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
              <code className="theme-chip px-1 py-0.5 rounded text-rose-600">
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default memo(
  MessageItem,
  (prev, next) => prev.msg.text === next.msg.text
);
