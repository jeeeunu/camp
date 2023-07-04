const io = require("socket.io")(3000, {
    cors: {
        origin: "*", // 리소스 제한 옵션
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("새로운 소켓이 연결됐어요!");

    socket.on("message", (data) => {
        console.log(data);
    });
});
