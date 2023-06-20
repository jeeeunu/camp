const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // objectedId이기 때문에 문자열
    required: true, // 장바구니는 특정한 id가 있는 사람만 사용 가능하다
  },
  goodsId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Cart", cartSchema);