const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies; // cookies안에 있는 authorization 가져옴

  const [authType, authToken] = (authorization ?? "").split(" ");

  // authType === Bearer값인지 확인 / authToken 검증 필요
  if (authType !== 'Bearer' || !authToken) {
    res.status(400).json({
      errorMessage: "로그인 후에 이용할 수 있는 기능입니다."
    });
    return;
  }

  // authToken이 만료되었는지 확인 , authToken이 서버가 발급 토큰이 맞는지 검증 , authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는 지 확인

  // try/catch => 에러, 서버가 종료되지않고 정상적으로 실패했따고 전달하기 위해 사용
  try {
    // 1. authToken이 만료되었는지 확인
    // 2. authToken이 서버가 발급 토큰이 맞는지 검증
    const { userId } = jwt.verify(authToken, "customized-secret-key");

    // 3. authToekn에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
    const user = await User.findById(userId);
    res.locals.user = user;

    next(); // 이 미들웨어 다음으로 보낸다

  } catch (error) {
    console.error(error);
    res.status(400).json({ errorMessage: "로그인 후에 이용할 수 있는 기능입니다." })
  }
};