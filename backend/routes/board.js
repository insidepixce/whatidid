const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

//새로운 게시물 생성
router.post('/', async (req, res) => {
    const entry = new Board(req.body);
    await entry.save();
    res.send(entry);
});

//모든 게시물 가져오기 
router.get('/', async (req, res) => {
    const entries = await Board.find();
    res.send(entries);
});


//특정 id의 게시물 가져오기 
router.get('/:id', async (req, res) => {
    const entry = await Board.findById(req.params.id);
    res.send(entry);
});

//특정 Id의 게시물 삭제 
router.delete('/:id', async (req, res) => {
    await Board.findByIdAndDelete(req.params.id);
    res.send({ message: 'Deleted' });
});

module.exports = router;
