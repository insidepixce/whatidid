const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: String,
    content: String
});

module.exports = mongoose.model('Board', boardSchema);
