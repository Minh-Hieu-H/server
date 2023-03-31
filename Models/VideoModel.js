import mongoose  from "mongoose";


const videosSchema = new mongoose.Schema({
    vd_title: String,
    vd_link: String,
    vd_publishAt: Date,
    vd_channel: String,
    vd_description: String,
    vd_content: String,
    vd_react: Number,
    vd_comment: Number,
    vd_label: Number,
    vd_timestamp: Date,
    vd_tag: String,
    vd_highlight:String,
    vd_embedlink:String,
    vd_followed:Number,
  });
  
const Video = mongoose.model('Video', videosSchema);

export default Video;
  
