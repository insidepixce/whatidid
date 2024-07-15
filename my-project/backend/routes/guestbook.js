const express = require('express');
const router = express.Router();
const Guestbook = require('../models/Guestbook');

router.post('/', async (req, res) => {
    const entry = new Guestbook(req.body);
    await entry.save();
    res.send(entry);
});

router.get('/', async (req, res) => {
    const entries = await Guestbook.find();
    res.send(entries);
});

router.delete('/:id', async (req, res) => {
    await Guestbook.findByIdAndDelete(req.params.id);
    res.send({ message: 'Deleted' });
});

module.exports = router;
