const mongoose = require('mongoose');

const photoPostSchema = new mongoose.Schema({
    image: String,
    comment: String
});

module.exports = mongoose.model('PhotoPost', photoPostSchema);
