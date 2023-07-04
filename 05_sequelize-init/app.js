// app.js

const express = require("express");
const postsRouter = require("./routes/post.route");
const app = express();
const PORT = 3017;

app.use(express.json());
app.use('/api', [postsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})