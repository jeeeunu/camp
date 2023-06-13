const express = require("express");
const router = express.Router(); // api를 만들다거나 route를 생성할때 이 변수를 통해 사용함

// localhost:3000/api/ [GET]
router.get('/', (req, res) => {
  res.send("default url for goods.js GET Method");
});

// localhost:3000/api/about [GET]
router.get('/about', (req, res) => {
  res.send("goods.js about PATH");
});

module.exports = router; // 밖으로 넘겨줄것이오 