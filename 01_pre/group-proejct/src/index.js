const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');

//const FILE_PATH = path.join(__dirname, '..', 'public', 'seoul.html');

const MONGO_URI = 'mongodb+srv://sparta:test@cluster0.k23feze.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'dbsparta' });

// html index 파일연결
app.get('/', (req, res) => {
    res.sendFile(INDEX_HTML);
});

// 정적 파일을 제공하기 위해 public 디렉토리를 static으로 등록
app.use(express.static(path.join(__dirname, '..', 'public')));

// JSON 형태의 요청과 폼 데이터를 처리하기 위해 bodyParser를 사용하지 않고 대신 express의 내장 기능 사용
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mongoose 모델 정의
const SeoulReview = mongoose.model('SeoulReview', new mongoose.Schema({
    img: String,
    name: String,
    star: Number,
    comment: String,
    address: String
}), 'seoulReview');

// POST 요청을 처리하는 라우트 핸들러. req.body를 통해 클라이언트에서 전송된 데이터를 가져와 Mongoose 모델에 저장
app.post('/seoulReview', async (req, res) => {
    try {
        const { img_give, name_give, star_give, comment_give, address_give } = req.body;
        const review = new SeoulReview({ img: img_give, name: name_give, star: star_give, comment: comment_give, address: address_give });
        await review.save();
        res.json({ msg: '저장완료!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// GET 요청을 처리하는 라우트 핸들러. 모든 리뷰 데이터를 가져옴
app.get('/seoulReview', async (req, res) => {
    try {
        const reviews = await SeoulReview.find({}, { _id: false });
        res.json({ result: reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// 서버를 실행함
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
