import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const YouTubeEmbed = ({ href }) => {
  const navigate = useNavigate();

  const extractId = (url) => {
    const patterns = [
      /youtu\.be\/([^\?&]+)/,
      /v=([^\?&]+)/,
      /embed\/([^\?&]+)/,
      /shorts\/([^\?&]+)/,
    ];
    for (const p of patterns) {
      const match = url.match(p);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = extractId(href);
  const handleNavigate = () => navigate("/playlist");
  if (!videoId) return null;

  return (
    <div className="flex flex-col gap-2 w-full items-start">
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="YouTube video"
          className="w-full h-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 px-2 py-1 rounded-lg bg-black/70 hover:text-white text-xs"
        >
          Youtube
        </a>
        <button
          onClick={handleNavigate}
          className="text-blue-300 px-2 py-1 rounded-lg bg-black/70 hover:text-white text-xs"
        >
          on-site
        </button>
      </div>
    </div>
  );
};

export default memo(YouTubeEmbed, (prev, next) => prev.href === next.href);
