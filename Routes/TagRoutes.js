import express from "express";
import Tag from "../Models/TagModel.js";
import Video from "../Models/VideoModel.js";
const tagRouter = express.Router();

// get all tag
tagRouter.get("/all", async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get video by tag
tagRouter.get("/:tagid", async (req, res) => {
  try {
    //   const encodedTag = req.params.tag;
    //   const tag = decodeURIComponent(encodedTag);
    const tagId = req.params.tagid;
    const tag = await Tag.findOne({ _id: tagId });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found data" });
    }
    const videos = await Video.find({ vd_tag: tag.vd_tag })
    const negative_list = videos.filter((video) => video.vd_label === 2)
    const positive_list = videos.filter((video) => video.vd_label === 1)
    const neural_list = videos.filter((video) => video.vd_label === 0)
    const countVideos = videos.length
    const arr_statitics = [
      neural_list ? neural_list.length :0,
      positive_list ? positive_list.length:0,
      negative_list? negative_list.length :0,]
    res.json(
      { 
        vd_tag: tag.vd_tag,
        countVideos:countVideos, 
        arr_statitics: arr_statitics,
        videos:videos.length>80 ?videos.slice(0,80):videos,
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Add new tag
tagRouter.post("/", async (req, res) => {
  const { tagValue } = req.body;
  try {
    // Kiểm tra xem tag đã tồn tại trong cơ sở dữ liệu chưa
    const existingTag = await Tag.findOne({ vd_tag: tagValue });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }
    // Tạo tag mới và lưu vào cơ sở dữ liệu
    const newTag = new Tag({ vd_tag: tagValue });
    await newTag.save();
    // Trả về thông tin của tag mới đã tạo
    res.json(newTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default tagRouter;
