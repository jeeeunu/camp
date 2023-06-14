const express = require('express');
const app = express();
const port = 3000;

//-- 미들웨어 설정 --//
app.use(express.json());

//-- DB --//
require('./db/server_mongo');

//-- 라우트 설정 --//
const usersRouter = require('./routes/posts');
app.use('/blog', usersRouter);

//-- 기본 경로 라우트 --//
app.get('/', (req, res) => {
  res.send('안녕하세요, Express 애플리케이션입니다!');
});

//-- 서버 시작 --//
app.listen(port, () => {
  console.log(`http://localhost:${port} 서버 생성`);
});
