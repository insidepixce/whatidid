const express = require('express');
const router = express.Router();
const PhotoPost = require('../models/PhotoPost');

router.post('/', async (req, res) => {
    const post = new PhotoPost(req.body);
    await post.save();
    res.send(post);
});

router.get('/', async (req, res) => {
    const posts = await PhotoPost.find();
    res.send(posts);
});

module.exports = router;
