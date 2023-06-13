const express = require("express");
const router = express.Router(); // api를 만들다거나 route를 생성할때 이 변수를 통해 사용함

const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

//-- API : 상품목록 가져오기 --//
router.get("/goods", (req, res) => {
  res.status(200).json({ goods }) // goods라는 변수로 goods의 데이터를 넘긴다.
});

//-- API : 특정 상품 데이터 가져오기 --//
router.get("/goods/:goodsId", (req, res) => {
  const { goodsId } = req.params // 정상적으로 전달되었는지 확인

  //-- 1. for문 활용 --//
  // let result = null;
  // for (const good of goods) {
  //   if (Number(goodsId) === good.goodsId) {
  //     result = good;
  //   }
  // }

  //-- 2. filter 메서드 활용 --//
  const [result] = goods.filter((good) => Number(goodsId) === good.goodsId);

  res.status(200).json({ "detail": result });
});


//-- mongodb 관련 코드 --//
const Goods = require("../schemas/goods.js"); 
router.post("/goods/", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) { // goods 데이터가 있을시에 (0이 아닐시)
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 GoodsId입니다."
    });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});


module.exports = router; // 밖으로 넘겨줄것이오 