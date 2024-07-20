const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const guestbookRoutes = require('./routes/guestbook');
const photoPostRoutes = require('./routes/photoPost');
const stopwatchRoutes = require('./routes/stopwatch');
const boardRoutes = require('./routes/board');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MongoDB 연결 설정 (환경 변수 사용)
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

app.use('/api/guestbook', guestbookRoutes);
app.use('/api/photoPost', photoPostRoutes);
app.use('/api/stopwatch', stopwatchRoutes);
app.use('/api/board', boardRoutes);

// 정적 파일 제공
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
