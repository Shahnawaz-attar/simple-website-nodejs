const mangoose = require('mongoose');

//create schema for the post


const postSchema = new mangoose.Schema({
    title: String,
    description: String,
    img : String,
    date: String,
    order : Number,
    post_type : String

});

module.exports = mangoose.model('posts', postSchema);