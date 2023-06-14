const express = require('express');
const app = express();
const port = 3000;

//-- 미들웨어 설정 --//
app.use(express.json());

//-- DB --//
require('./db/mongodb');

//-- 라우트 설정 --//
const postsRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
app.use('/posts', postsRouter);
app.use('/comments', commentRouter);

//-- 기본 경로 라우트 --//
app.get('/', (req, res) => {
  res.send('안녕하세요, Express 애플리케이션입니다!');
});

//-- 서버 시작 --//
app.listen(port, () => {
  console.log(`http://localhost:${port} 서버 생성`);
});
