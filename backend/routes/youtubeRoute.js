import express from "express";
import axios from "axios";

const ytRouter = express.Router();
const apiKey = process.env.YT_CLIENT_AUTH;


ytRouter.get("/search", async (req, res) => {
  const query = req.query.q || "dsa course";

  try {
    // Step 1: Search for playlists
    const searchResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "playlist",
          maxResults: 10,
          key: apiKey,
        },
      }
    );

    const playlists = searchResponse.data.items.filter(
      (item) => item.id.kind === "youtube#playlist"
    );

    const playlistIds = playlists.map((p) => p.id.playlistId).join(",");

    // Step 2: Fetch playlist details (includes video count)
    const playlistDetailsRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        params: {
          part: "snippet,contentDetails",
          id: playlistIds,
          key: apiKey,
        },
      }
    );

    const playlistDetails = playlistDetailsRes.data.items;

    // Step 3: Fetch channel info (subscribers, views)
    const channelIds = [
      ...new Set(playlistDetails.map((p) => p.snippet.channelId)),
    ].join(",");

    const channelRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "snippet,statistics",
          id: channelIds,
          key: apiKey,
        },
      }
    );

    const channelMap = {};
    channelRes.data.items.forEach((ch) => {
      channelMap[ch.id] = {
        title: ch.snippet.title,
        subscribers: ch.statistics.subscriberCount,
        totalViews: ch.statistics.viewCount,
      };
    });

    // Step 4: Merge all data
    const enrichedPlaylists = playlistDetails.map((pl) => ({
      playlistId: pl.id,
      title: pl.snippet.title,
      description: pl.snippet.description,
      thumbnail: pl.snippet.thumbnails.medium.url,
      itemCount: pl.contentDetails.itemCount,
      channelTitle: pl.snippet.channelTitle,
      channelId: pl.snippet.channelId,
      channelInfo: channelMap[pl.snippet.channelId] || {},
    }));

    res.json({ items: enrichedPlaylists });
  } catch (error) {
    console.error("YouTube API error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data || "Failed to fetch YouTube data" });
  }
});


ytRouter.get("/playlist/:id", async (req, res) => {
  const playlistId = req.params.id;
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
      params: {
        part: "snippet,contentDetails",
        playlistId,
        maxResults: 25,
        key: apiKey,
      },
    });
    res.json({ items: response.data.items });
  } catch (error) {
    console.error("YouTube playlist error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch playlist videos" });
  }
});

// 🎥 Fetch videos within a playlist
ytRouter.get("/playlist/:id/videos", async (req, res) => {
  const playlistId = req.params.id;

  try {
    const videosRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet,contentDetails",
          playlistId,
          maxResults: 20,
          key: apiKey,
        },
      }
    );

    res.json({ videos: videosRes.data.items });
  } catch (error) {
    console.error(
      "Playlist videos error:",
      error.response?.data || error.message
    );
    res
      .status(error.response?.status || 500)
      .json({
        error: error.response?.data || "Failed to fetch playlist videos",
      });
  }
});

export default ytRouter;
