const express = require("express");
const router = express.Router();

//-- 1. 필요한 스키마 가져오기 --//
const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods.js")

//-- 2. 목록조회 router 만들기 --//
router.get("/carts", async (req, res) => {
  const carts = await Cart.find({}); // cart.js에서 필요한 모든 정보 가져오기
  // [{goodsId,quantity}];

  const goodsIds = carts.map((cart) => {
    return cart.goodsId // cart에 있는 id값만 반환함. ex. [2,11,1]
  });

  //-- 3. Goods에 해당하는 모든 정보를 가져옴, 바로 위에서 map 돌린 goodsIds 변수안에 존재하는 값일때만 조회  --//
  const goods = await Goods.find({ goodsId: goodsIds });

  const results = carts.map((cart) => {
    return {
      "quantity": cart.quantity,
      "goods": goods.find((item) => item.goodsId === cart.goodsId)
    }
  });

  res.json({
    "carts": results,
  })
});

module.exports = router;