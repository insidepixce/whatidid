const mongoose = require('mongoose');

const stopwatchSchema = new mongoose.Schema({
    logEntry: Number,
    totalTime: Number
});

module.exports = mongoose.model('Stopwatch', stopwatchSchema);
