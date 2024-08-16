const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB 연결
mongoose.connect('mongodb://localhost/schedule', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 3000;

// 스케줄 모델 정의
const scheduleSchema = new mongoose.Schema({
    date: String,
    description: String
});
const Schedule = mongoose.model('Schedule', scheduleSchema);

app.use(cors());
app.use(bodyParser.json());

// 모든 일정 가져오기
app.get('/schedules', async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.json(schedules);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 일정 추가하기
app.post('/schedules', async (req, res) => {
    try {
        const { date, description } = req.body;
        const schedule = new Schedule({ date, description });
        await schedule.save();
        res.status(201).json(schedule);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 일정 삭제하기
app.delete('/schedules', async (req, res) => {
    try {
        const { date, description } = req.body;
        await Schedule.deleteOne({ date, description });
        res.status(200).send('Schedule deleted');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
