import express from "express";
import Video from "../Models/VideoModel.js";
// import { remove } from "diacritics";

//  defined Router
const videoRouter = express.Router();

//  get ALL video and Search
videoRouter.get("/all", async (req, res) => {
  try {
    const label = req.query.label;
    const react = req.query.react ? { vd_react: { $gte: 800 } } : {};
    const keyword = req.query.keyword
      ? {
          $or: [
            { vd_content: { $regex: req.query.keyword, $options: "i" } },
            { vd_title: { $regex: req.query.keyword, $options: "i" } },
            { vd_description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};
    const videos = label
      ? await Video.find({ vd_label: label, ...react, ...keyword }).limit(80)
      : await Video.find({ ...react, ...keyword }).limit(80);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get video all tag
videoRouter.get("/by-tag", async (req, res) => {
  try {
    const tagStatistics = await Video.aggregate([
      { $unwind: "$vd_tag" },
      { $group: { _id: "$vd_tag", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(tagStatistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
})
// Get video all channel
videoRouter.get("/by-channel", async (req, res) => {
  try {
    const channelStatistics = await Video.aggregate([
      { $unwind: "$vd_tag" },
      { $group: { _id: "$vd_channel", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(channelStatistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
})

//  get all video follow 
videoRouter.get("/followed", async (req, res) => {
  try {
    const videos = await Video.find({ vd_followed: 1 });
    res.json(videos);
  } catch (error) {
   
    res.status(400).json({ message: "Internal Server Error" });
  }
});


//  get single video
videoRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Error while handler data" });
  }
});

// Follow/Unfollow video
videoRouter.post("/:id", async (req, res) => {
  const { vd_followed } = req.body;
  const id = req.params.id;
  try {
    // Tìm video theo id
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    // Cập nhật thuộc tính vd_followed của video
    video.vd_followed = vd_followed;
    await video.save();
    // Trả về thông tin video đã cập nhật
    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default videoRouter;
