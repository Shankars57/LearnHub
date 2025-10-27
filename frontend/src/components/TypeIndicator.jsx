import React from "react";

const TypingIndicator = ({ users }) => (
  <div className="flex items-center gap-1 text-sm text-gray-400 italic">
    <span>
      {users.join(", ")} {users.length > 1 ? "are" : "is"} typing
    </span>
    <span className="typing-dots">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
    <style jsx>{`
      .typing-dots span {
        animation: blink 1.4s infinite both;
        display: inline-block;
      }
      .typing-dots span:nth-child(1) {
        animation-delay: 0s;
      }
      .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes blink {
        0%,
        80%,
        100% {
          opacity: 0;
        }
        40% {
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

export default TypingIndicator;
