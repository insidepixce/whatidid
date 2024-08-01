const express = require ('express');
const router = express.Router();
const PhotoPost = require('../models/PhotoPost');

//사진 포스트 생성 
router.post('/', async (req, res) => {
    try {
        const photoPost = new PhotoPost(req.body); //사진 게시물 생성
        await photoPost.save(); //사진 게시물 저장 
        res.status(201).send(photoPost);  //사진 게시물 변환
    } catch (error) { //에러 발생시 사진 게시물을 등록하는데 실패하였습니다 메시지와 함께 어떤 에러인지 출력하기 
        res.status(500).send({ error: '사진 게시물을 등록하는데 실패하였습니다 ' });
    }
});

//모든 사진 게시물들을 불러오는 코드 
router.get('/', async (req, res) => { 
    try {
        const photoPosts = await PhotoPost.find(); //모든 사진 게시물을 불러오기 
        res.send(photoPosts); //사진 게시물 변환
    } catch (error) { //에러 발생시 사진 게시물을 불러오는데 실패하였습니다 메시지와 함께 어떤 에러인지 출력하기 
        res.status(500).send({ error: '사진 게시물을 불러오는데 실패하였습니다' }); 
    }
});
module.exports = router; 
