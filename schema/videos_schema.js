const mangoose = require('mongoose');

//create schema for the post


const postSchema = new mangoose.Schema({
    title: String,
    video_url: String,
    status: Number,
    date: Date,
    order: Number,

});

module.exports = mangoose.model('videos', postSchema);