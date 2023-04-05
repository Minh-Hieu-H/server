import express from "express";
import { google } from 'googleapis';
import Channel from "../Models/ChannelModel.js";
import Video from "../Models/VideoModel.js";
//  defined Router
const channelRouter = express.Router();
// Set up the API client
const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyAHgE5wM-mYD0qT4rvI9Z3vQJ9BRsUYJak'
  });

// Get channel data by ID
async function getChannelData(channelId) {
    try {
      const response = await youtube.channels.list({
        part: 'snippet',
        id: channelId
      });
      const channelData = response.data.items[0].snippet;
      const channelLink = `https://www.youtube.com/channel/${channelId}`;
      return { channelName: channelData.title, channelLink: channelLink };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
// Get list channel
channelRouter.get("/all", async (req, res) => {
  try {
    const channels = await Channel.find({});
    res.json(channels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get video by tag
// channelRouter.get("/:channelId", async (req, res) => {
//   try {
//     //   const encodedTag = req.params.tag;
//     //   const tag = decodeURIComponent(encodedTag);
//     const channel = req.params.channelId;
//     const videos = await Video.find({ vd_channel: channel });
//     res.json(videos);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });
channelRouter.get("/:idchannel", async (req, res) => {
  try {
    const channelId = req.params.idchannel;
    const channel = await Channel.findOne({ channel_id: channelId });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = await Video.find({ vd_channel: channel.channel_name });
    const videoCount = videos.length;

    res.json({
      channel_name: channel.channel_name,
      video_count: videoCount,
      videos: videos.length>80 ?videos.limit(80):videos,
      channel_link: channel.channel_link
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
  // Get channel data by ID
// channelRouter.get("/:channelId", async (req, res) => {
//     try {
//       const channelId = req.params.channelId;
//       const channelData = await getChannelData(channelId);
//       if (channelData) {
//         res.json(channelData);
//       } else {
//         res.status(404).json({ message: 'Channel not found' });
//       }
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });

export default channelRouter;