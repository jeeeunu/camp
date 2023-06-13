const mongoose = require("mongoose");

//-- 스키마 내용 정의 --//
const goodSchema = new mongoose.Schema({
  goodsId: {
    type: Number,
    required: true, // 꼭 있어야 하는가
    unique: true // 고유한 값이여야 하는가
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  thumbnailUrl: {
    type: String,

  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  }
});

module.exports = mongoose.model("Goods", goodSchema); // Goods라는 모델명으로 goodSchema를 사용할 것이다.