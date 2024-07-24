const mongoose = require('mongoose');

const stopwatchSchema = new mongoose.Schema({
    logEntry: { type: Number, required: true },
    memo: { type: String, default: '' },
    image: { type: String, default: '' }
});

module.exports = mongoose.model('Stopwatch', stopwatchSchema);
