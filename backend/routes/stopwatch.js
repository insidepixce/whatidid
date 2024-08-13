const express = require('express');
const multer = require('multer');
const router = express.Router();
const Stopwatch = require('../models/Stopwatch');

// multer 설정
const storage = multer.diskStorage({ //파일 저장 경로 및 파일명 설정 
    destination: (req, file, cb) => { //파일 저장 경로 설정 
        cb(null, 'uploads/');//파일 저장 폴더 설정 
    },
    filename: (req, file, cb) => {//파일명 설정 
        cb(null, Date.now() + '-' + file.originalname);//파일명  : 날짜_파일명
    }
});
const upload = multer({ storage });

// 로그 저장 엔드포인트
router.post('/log', upload.single('image'), async (req, res) => {//파일 업로드를 위한 미들웨어 추가 
    try {//요청으로 전달된 로그 데이터를 저장 
        const log = new Stopwatch({//새로운 로그 생성
            logEntry: req.body.logEntry,//로그 항목 저장 필드, 숫자(함수)
            memo: req.body.memo,//메모 저장 필드 
            image: req.file ? req.file.filename : null//이미지 저장 필드 
        });
        await log.save();//로그 저장 
        res.json(log);//저장된 로그 반환
    } catch (error) {//에러 발생시 서버에 에러가 있어요 메시지와 함께 어떤 에러인지 출력하기 
        res.status(500).json({ message: '서버에 에러가 있어요', error: error.message });
    } //이미지 파일이 업로드되었을떄 이미지 파일명을 저장하고 이미지 파일이 없을때는 null값을 저장한다 
});

//  로그 업데이트 엔드포인트 (메모 업데이트)
router.put('/log/:id', async (req, res) => {//메모 업데이트 엔드포인트 
    console.log(`Updating memo for log ID: ${req.params.id} with memo: ${req.body.memo}`);//업데이트할 로그의 id와 업데이트할 메모를 콘솔에 출력해주기 
    try { //요청으로 전달된 id값을 가진 로그를 찾아 메모 업데이트 
        const log = await Stopwatch.findByIdAndUpdate(req.params.id, { memo: req.body.memo }, { new: true });//요청으로 전달된 id값을 가진 로그를 찾아 메모 업데이트  
        if (!log) {//업데이트할 로그가 없을때 404에러와 함께 로그가 발견되지 않았어요 메시지 출력 
            console.log('로그가 발견되지 않았어요');
            return res.status(404).json({ message: '로그가 발견되지 않았어용 ' });//업데이트된 로그를 반환
        }
        console.log('로그가 업데이트되었어요 :', log);//업데이트 된 로그를 콘솔에 출력((*이는 삭제해야 할 기능)
        res.json(log);//업데이트한 로그를 반환
    } catch (error) { //에러 발생시 메세지 출력과 함꼐 에러 메세지 출력하기 
        console.error('메모를 업데이트하는데 문제가 있어요:', error);
        res.status(500).json({ message: '서버에 오류가 있어요', error: error.message });//서버에 에러가 있을때는 서버에 오류가 있다고 말해주기 
    }
});


// 메모 삭제 엔드포인트
router.delete('/log/:id/memo', async (req, res) => {
    try {
        const log = await Stopwatch.findByIdAndUpdate(req.params.id, { memo: '' }, { new: true });
        if (!log) {
            return res.status(404).json({ message: '로그가 발견되지 않았어요 ㅠ ' });
        }
        res.json(log);
    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message });
    }
});

// 로그 삭제 엔드포인트
router.delete('/log/:id', async (req, res) => {
    try {
        const log = await Stopwatch.findByIdAndDelete(req.params.id);
        if (!log) {
            return res.status(404).json({ message: '로그가 발견되지 않았어요 ㅠ' });
        }
        res.json({ message: 'Log deleted' });
    } catch (error) {
        res.status(500).json({ message: '서버 에러 ', error: error.message });
    }
});


// 로그 조회 엔드포인트
router.get('/log', async (req, res) => {
    try {
        const logs = await Stopwatch.find({});
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: '서버 에러 ', error: error.message });
    }
});

module.exports = router;