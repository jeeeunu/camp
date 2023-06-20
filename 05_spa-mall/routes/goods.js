const express = require("express");
const router = express.Router();
const Goods = require("../schemas/goods");
const authMiddleware = require("../middlewares/auth-middleware");

// 장바구니 조회 api
router.get("/goods/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  const carts = await Cart.find({ userId: userId });
  const goodsIds = carts.map((cart) => {
    return cart.goodsId;
  })

  const goods = await Goods.find({ goodsId: goodsIds });
  const results = carts.map((cart) => {
    return {
      "quantity": cart.quantity,
      "goods": goods.find((item) => item.goodsId === cart.goodsId),
    }
  })
  res.json({
    "carts": results
  })
});


// 상품 목록 조회 API
router.get("/goods", async (req, res) => {
  const { category } = req.query;

  const goods = await Goods.find(category ? { category } : {})
    .sort("-date") // 내림차순 정렬
    .exec();

  const results = goods.map((item) => {
    return {
      goodsId: item.goodsId,
      name: item.name,
      price: item.price,
      thumbnailUrl: item.thumbnailUrl,
      category: item.goodsId
    }
  })

  res.status(200).json({ goods: results })
});


// 상품 상세 조회 API
router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;

  const goods = await Goods.findOne({ goodsId: goodsId })
    .sort("-date") // 내림차순 정렬
    .exec();

  const result = {
    goodsId: goods.goodsId,
    name: goods.name,
    price: goods.price,
    thumbnailUrl: goods.thumbnailUrl,
    category: goods.goodsId
  }

  res.status(200).json({ goods: result })
});


const Cart = require("../schemas/cart.js");


// 장바구니 등록 API
router.post("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  // 사용자정보를 가지고 장바구니 조회
  const existsCarts = await Cart.find({ userId, goodsId });
  if (existsCarts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 장바구니에 해당하는 상품이 존재합니다.",
    })
  }

  // 해당하는 사용자의 정보를 가지고 장바구니에 상품 등록
  await Cart.create({ userId, goodsId, quantity });

  res.json({ result: "success" });
})


// 장바구니 수정 API
router.put("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ userId, goodsId });
  if (existsCarts.length > 0) {
    await Cart.updateOne(
      { userId, goodsId: goodsId },
      { $set: { quantity: quantity } }
    );
  }
  res.status(200).json({ success: true });
});



// 장바구니 삭제 API
router.delete("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ userId, goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ userId, goodsId });
  }

  res.json({ result: "success" });
})


router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 GoodsId입니다."
    });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
})

module.exports = router;