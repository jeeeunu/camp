const express = require("express");
const { createServer } = require("http");

const app = express();
const http = createServer(app);

const io = require("socket.io")(3000, {
    // 3000번 포트로 pocket사용
    cors: {
        origin: "*", // 리소스 제한 옵션
        methods: ["GET", "POST"],
    },
});

http.listen(3000, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
});
