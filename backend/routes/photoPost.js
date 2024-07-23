const express = require ('express');
const router = express.Router();
const PhotoPost = require('../models/PhotoPost');

//사진 포스트 생성 
router.post('/', async (req, res) => {
    try {
        const photoPost = new PhotoPost(req.body);
        await photoPost.save();
        res.status(201).send(photoPost);
    } catch (error) {
        res.status(500).send({ error: '사진 게시물을 등록하는데 실패하였습니다 ' });
    }
});

//모든 사진 게시물들을 불러오는 코드 
router.get('/', async (req, res) => {
    try {
        const photoPosts = await PhotoPost.find();
        res.send(photoPosts);
    } catch (error) {
        res.status(500).send({ error: '사진 게시물을 불러오는데 실패하였습니다' });
    }
});
module.exports = router; 
