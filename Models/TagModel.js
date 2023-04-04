import mongoose from 'mongoose'
const tagsSchema = new mongoose.Schema({
    vd_tag:String
})
const Tag = mongoose.model('Tag',tagsSchema)

export default Tag;