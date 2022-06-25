const express = require('express');
require('../config');
const posts = require('../schema/posts_schema');
const fs = require('fs');
const path = require('path');

const ObjectId = require('mongoose').Types.ObjectId;
const app = express();
app.use(express.json());




const get_posts = () => {
    return posts.find({});

}

//add_post
const add_post = (post) => {
    return posts.create(post);
}

//delete_post
const delete_post = async (id) => {
    const post = await posts.findById(id);
    // if post is found
    if (post) {
        const img_name = post.img;
        const img_path = path.join(__dirname, 'uploads', img_name) ;
        if (img_path !== '' && fs.existsSync(img_path)) {
            fs.unlink(img_path, (err) => {
                if (err) throw err;
            }
            );
        }
    }

    return await posts.deleteOne({ _id: ObjectId(id) });
}

const get_post = async (id) => {
    return await posts.findById(id);
}

// update_post
const update_post = async (id, post,is_file_change) => {
    const post_to_update = await posts.findById(id);
    if (post_to_update) {
        if (is_file_change) {
            const img_name = post_to_update.img;
            const img_path = path.join(__dirname, 'uploads', img_name) ;
            if (img_path !== '' && fs.existsSync(img_path)) {
                fs.unlink(img_path, (err) => {
                    if (err) throw err;
                }
                );
            }
        }
    }
    return await posts.updateOne({ _id: ObjectId(id) }, post);
}




module.exports = {
    get_posts,
    add_post,
    delete_post,
    get_post,
    update_post
}


