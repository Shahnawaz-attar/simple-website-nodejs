const express = require('express');
require('../config');
const posts = require('../schema/videos_schema');
const fs = require('fs');
const path = require('path');

const ObjectId = require('mongoose').Types.ObjectId;
const app = express();
app.use(express.json());


const get_videos = () => {
    return posts.find({});

}

module.exports = {
    get_videos
}