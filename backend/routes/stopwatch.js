const express = require('express');
const router = express.Router();
const Stopwatch = require('../models/Stopwatch');

// 로그 저장
router.post('/log', async (req, res) => {
    try {
        const log = new Stopwatch(req.body);
        await log.save();
        res.status(201).send(log);
    } catch (error) {
        res.status(500).send({ error: 'Failed to save log' });
    }
});

// 모든 로그 가져오기
router.get('/log', async (req, res) => {
    try {
        const logs = await Stopwatch.find();
        res.send(logs);
    } catch (error) {
        res.status(500).send({ message: '서버 에러',error: error.message });
    }
});

// 총 시간 저장
router.post('/save', async (req, res) => {
    try {
        const { totalTime } = req.body;
        const result = await Stopwatch.updateOne({}, { totalTime }, { upsert: true });
        res.send({ message: 'Total time saved', result });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save total time' });
    }
});

// 총 시간 가져오기
router.get('/total', async (req, res) => {
    try {
        const total = await Stopwatch.findOne().select('totalTime');
        res.send(total);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch total time' });
    }
});

module.exports = router;
