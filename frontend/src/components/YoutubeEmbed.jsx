import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const YouTubeEmbed = memo(({ href }) => {
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
  const handleNavigate = () => navigate(`/playlist`);

  if (!videoId) return null;

  return (
    <div className="flex flex-col gap-1 items-start">
      <iframe
        width="300"
        height="169"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube video"
        className="rounded-lg"
      />
      <div className="flex items-center gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 px-2 py-1 rounded-lg bg-black/70 block hover:text-white text-xs"
        >
          Youtube
        </a>
        <button
          onClick={handleNavigate}
          className="text-blue-300 px-2 py-1 rounded-lg bg-black/70 block hover:text-white text-xs"
        >
          on-site
        </button>
      </div>
    </div>
  );
});

export default YouTubeEmbed;
