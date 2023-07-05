const express = require("express");
const { Server } = require("http"); // 1. 모듈 불러오기
const socketIo = require("socket.io"); // 1. 모듈 불러오기

const cookieParser = require("cookie-parser");
const goodsRouter = require("./routes/goods.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const connect = require("./schemas");
const goods = require("./schemas/goods.js");

connect(); // mongoose를 연결합니다.

const app = express();
const http = Server(app); // 2. express app을 http 서버로 감싸기
const io = socketIo(http); // 3. http 객체를 Socket.io 모듈에 넘겨서 소켓 핸들러 생성
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("assets"));
app.use("/api", [goodsRouter, usersRouter, authRouter]);

// socket이 접속했을때 해당하는 콜백 함수 실행
io.on("connection", (sock) => {
    console.log("새로운 소켓이 연결되었습니다."); // 1. 소켓 사용자가 접속한다.

    // 1. 클라이언트가 상품을 구매했을때 발생하는 이벤트
    sock.on("BUY", (data) => {
        const { nickname, goodsId, goodsName } = data;
        const emitData = {
            // 2. emit 데이터 만들기
            nickname: nickname,
            goodsId: goodsId,
            goodsName: goodsName,
            date: new Date().toString(),
        };
        // 3. 클라이언트가 구매한 정보를 바탕으로 BUY_GOODS 메시지 전달해줘야 한다. (소켓에 접속한 모든 사용자)
        // sock.emit
        io.emit("BUY_GOODS", emitData);
    });
});

// 5. app 대신 http 객체로 서버 열기
http.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
});
