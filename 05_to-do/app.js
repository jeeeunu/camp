const express = require("express");

const db = require("./models/index.js");
const todosRouter = require("./routes/todos.router.js");

const app = express();

app.use("/api", express.json(), todosRouter); // express.json(): 바디로 들어오는 데이터에 대해 사용할 수 있도록 하는 미들웨어
app.use(express.static("./assets")); // static 정적파일을 연결해주는 미들웨어

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});