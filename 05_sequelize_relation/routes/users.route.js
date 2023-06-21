const express = require("express");
const jwt = require("jsonwebtoken");
const { Users, UserInfos } = require("../models")
const router = express.Router();


// 회원가입 API
router.post("/users", async (req, res) => {
  const { email, password, name, age, gender, profileImage } = req.body;

  const isExistUser = await Users.findOne({
    where: {
      email: email,
    }
  });

  // email과 동일 한 유저가 실제로 존재할때 에러발생
  if (isExistUser) {
    return res.status(400).json({ message: "이미 존재하는 이메일입니다" })
  }

  // 사용자 테이블에 데이터 삽입
  const user = await Users.create({ email, password });

  // 사용자 정보 테이블에 데이터 삽입
  // 어떤 사용자의 정보인지 확인 필요
  await UserInfos.create({
    UserId: user.userId, // 현재 사용자 정보가 19번째 줄에서 생성된 사용자의 userId를 할당한다.
    name, age, gender, profileImage
  });
  return res.status(201).json({ message: "회원가입이 완료되었습니다." });
})


// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  } else if (user.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  // jwt 생성
  const token = jwt.sign({
    userId: user.userId
  }, "customized_secret_key");

  // 쿠키를 발급
  res.cookie("authorization", `Bearer ${token}`);

  // response 할당
  return res.status(200).json({ message: "로그인 성공" });
});



module.exports = router;