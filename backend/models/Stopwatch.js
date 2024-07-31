const mongoose = require('mongoose');
//스톱워치 로그 저장에 대한 스키마 
const stopwatchSchema = new mongoose.Schema({
    //로그 항목 저장 필드, 숫자(함수) 
    logEntry: { type: Number, required: true },
    //메모 저장 필드 
    memo: { type: String, default: '' },
    //이미지 저장 필드 
    image: { type: String, default: '' }
});

module.exports = mongoose.model('Stopwatch', stopwatchSchema);
