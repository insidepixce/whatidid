const mongoose = require('mongoose');

const guestbookSchema = new mongoose.Schema({
    name: String,
    message: String
});

module.exports = mongoose.model('Guestbook', guestbookSchema);
