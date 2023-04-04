import express from 'express'
import Video from '../Models/VideoModel.js'
import { remove } from 'diacritics';

//  defined Router

const videoRouter = express.Router();

//  get ALL video and Search
videoRouter.get(
  "/all", async (req, res) => {
    try {
      const label = req.query.label
      const react  = req.query.react ? { vd_react: {$gte:800}}:{}
      const keyword = req.query.keyword ? {
        $or: [
          {vd_content: {$regex: req.query.keyword,$options: "i",}},
          {vd_title: {$regex: req.query.keyword,$options: "i",}},
          {vd_description: {$regex: req.query.keyword,$options: "i",}},
        ]
      } : {}
      const videos = label ? await Video.find({vd_label:label,...react,...keyword}): await Video.find({...react,...keyword})
      

      res.json(videos);
    }
    catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
);
// Get video all tag
videoRouter.get('/by-tag',async (req,res)=>{
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


//  get single video
videoRouter.get(
  "/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const video = await Video.findById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    }
    catch (err) {
      res.status(500).json({ message: "Error while handler data" })
    }
  }

);


export default videoRouter;