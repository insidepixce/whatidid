const mongoose = require('mongoose');

const photoPostSchema = new mongoose.Schema({
    //이미지를 저장하는 필드 
    image: String,
    //이미지에 대한 코멘트를 저장하는 필드 
    comment: String
});

module.exports = mongoose.model('PhotoPost', photoPostSchema);
