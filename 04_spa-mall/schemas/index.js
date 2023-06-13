//-- db 관련 스키마 관리 파일 --//
const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/spa_mall") // mongodb 연결
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect; // 밖으로 내보내~~