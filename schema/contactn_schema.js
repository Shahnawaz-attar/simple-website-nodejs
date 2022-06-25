const mangoose = require('mongoose');

//create schema for the post


const postSchema = new mangoose.Schema({
name: String,
message: String,

});

module.exports = mangoose.model('contacts', postSchema);