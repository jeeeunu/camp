const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

// 로그인 api
router.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  // 이메일이 일치하는 유저를 찾는다
  const user = await User.findOne({ email });

  // 이메일 일치하는 유저 찾기 / 비밀번호 일치 검증
  if (!user || user.password !== password) {
    res.status(400).json({
      errorMessage: "로그인에 실패했습니다"
    })
    return;
  }

  // jwt 생성
  const token = jwt.sign({ userId: user.userId }, "customized-secret-key");

  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token });
});

module.exports = router;