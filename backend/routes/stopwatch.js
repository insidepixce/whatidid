const express = require('express');
const multer = require('multer');
const router = express.Router();
const Stopwatch = require('../models/Stopwatch');

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// 로그 저장 엔드포인트
router.post('/log', upload.single('image'), async (req, res) => {
    try {
        const log = new Stopwatch({
            logEntry: req.body.logEntry,
            memo: req.body.memo,
            image: req.file ? req.file.filename : null
        });
        await log.save();
        res.json(log);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 로그 업데이트 엔드포인트 (메모 업데이트)
router.put('/log/:id', async (req, res) => {
    try {
        const log = await Stopwatch.findByIdAndUpdate(req.params.id, { memo: req.body.memo }, { new: true });
        res.json(log);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 메모 삭제 엔드포인트
router.delete('/log/:id/memo', async (req, res) => {
    try {
        const log = await Stopwatch.findByIdAndUpdate(req.params.id, { memo: '' }, { new: true });
        res.json(log);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 로그 삭제 엔드포인트
router.delete('/log/:id', async (req, res) => {
    try {
        await Stopwatch.findByIdAndDelete(req.params.id);
        res.json({ message: 'Log deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 로그 조회 엔드포인트
router.get('/log', async (req, res) => {
    try {
        const logs = await Stopwatch.find({});
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
