const mongoose = require('mongoose');

const guestbookSchema = new mongoose.Schema({
    //이름 저장 필드 
    name: String,
    //메시지 저장 필드 
    message: String
});

module.exports = mongoose.model('Guestbook', guestbookSchema);
