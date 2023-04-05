import mongoose from 'mongoose'
const channelsSchema = new mongoose.Schema({
    channel_id:String,
    channel_link:String,
    channel_name:String,
})
const Channel = mongoose.model('Channel',channelsSchema)

export default Channel;