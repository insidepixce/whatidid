const express = require('express');
const router = express.Router();
const Stopwatch = require('../models/Stopwatch');

router.post('/log', async (req, res) => {
    const log = new Stopwatch(req.body);
    await log.save();
    res.send(log);
});

router.get('/log', async (req, res) => {
    const logs = await Stopwatch.find();
    res.send(logs);
});

router.post('/save', async (req, res) => {
    const { totalTime } = req.body;
    await Stopwatch.updateOne({}, { totalTime }, { upsert: true });
    res.send({ message: 'Total time saved' });
});

router.get('/total', async (req, res) => {
    const total = await Stopwatch.findOne();
    res.send(total);
});

module.exports = router;
