const express = require('express');
const app = express();
const port = 3000;

//-- router 가져오기 --//
const goodsRouter = require('./routes/goods.js');
const cartRouter = require("./routes/carts.js");

//-- mongodb 연결한 index.js --//
const connet = require("./schemas");
connet();

//------------------------------------------//
app.use(express.json()); // body-parser Middleware(전역 미들웨어)를 쓰기위한 문법이다.
app.use("/api", [goodsRouter, cartRouter]); // router api 연결

app.post("/", (req, res) => {
  console.log(req.body); // 실제 body 데이터 확인

  res.send("기본 URI에 POST 메소드가 정상적으로 실행되었습니다.")
})

app.get("/", (req, res) => {
  console.log(req.query); // 쿼리스트링으로 전달된 정보를 출력하는거다.

  //-- 기본 URI로 전달하는 GET --//
  // res.send('정상적으로 반환되었습니다.') 

  //-- json 문법 활용 = 객체형태로 바로 넣을 수 있다. --//
  res.status(400).json({
    "keykey": "value 입니다.",
    "이름입니다": "이름일까요?"
  })

});

app.get("/:id", (req, res) => {
  console.log(req.params);

  res.send(":id URI에 정상적으로 반환되었습니다.")
});
//------------------------------------------//
//--- 단순 get ----//
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// api 등록 (localhost:3000/api -> goodsRouter)
app.use("/api", goodsRouter); // api경로가 추가된 경우에는 모두 goodsRouter을 통해서 가라

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});