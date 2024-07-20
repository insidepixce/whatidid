const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

router.post('/', async (req, res) => {
    const entry = new Board(req.body);
    await entry.save();
    res.send(entry);
});

router.get('/', async (req, res) => {
    const entries = await Board.find();
    res.send(entries);
});

router.get('/:id', async (req, res) => {
    const entry = await Board.findById(req.params.id);
    res.send(entry);
});

router.delete('/:id', async (req, res) => {
    await Board.findByIdAndDelete(req.params.id);
    res.send({ message: 'Deleted' });
});

module.exports = router;
