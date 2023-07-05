const jwt = require("jsonwebtoken"); // JWT 생성 및 검증을 위한 패키지 import
const cookieParser = require("cookie-parser"); // 쿠키 파싱을 위한 패키지 import
const express = require("express"); // Express 웹 프레임워크 import
const app = express(); // Express 애플리케이션 초기화
const port = 3002; // 애플리케이션 포트 설정
const SECRET_KEY = `HangHae99`; // 비밀키 설정

app.use(cookieParser()); // Express 애플리케이션에 쿠키 파싱 미들웨어 등록

let tokenObject = {}; // Refresh Token을 저장할 Object

//-- set-token --//
app.get("/set-token/:id", (req, res) => {
    const id = req.params.id; // URL 파라미터에서 사용자 ID 추출
    const accessToken = createAccessToken(id); // 사용자 ID를 이용해 Access Token 생성
    const refreshToken = createRefreshToken(); // Refresh Token 생성

    tokenObject[refreshToken] = id; // Refresh Token을 이용하여 해당 유저의 정보를 서버에 저장
    res.cookie("accessToken", accessToken); // Access Token을 쿠키에 저장
    res.cookie("refreshToken", refreshToken); // Refresh Token을 쿠키에 저장

    return res.status(200).send({ message: "Token이 정상적으로 발급되었습니다." }); // 응답 메시지 전송
});

// Access Token을 생성합니다.
function createAccessToken(id) {
    const accessToken = jwt.sign(
        { id: id }, // JWT 페이로드 데이터로 사용자 ID 포함
        SECRET_KEY, // 비밀키
        { expiresIn: "10s" } // Access Token의 만료 시간 설정 (10초)
    );

    return accessToken;
}

// Refresh Token을 생성합니다.
function createRefreshToken() {
    const refreshToken = jwt.sign(
        {}, // JWT 페이로드 데이터 없음
        SECRET_KEY, // 비밀키
        { expiresIn: "7d" } // Refresh Token의 만료 시간 설정 (7일)
    );

    return refreshToken;
}

//-- get-token --//
app.get("/get-token", (req, res) => {
    const accessToken = req.cookies.accessToken; // 쿠키에서 Access Token 추출
    const refreshToken = req.cookies.refreshToken; // 쿠키에서 Refresh Token 추출

    if (!refreshToken) return res.status(400).json({ message: "Refresh Token이 존재하지 않습니다." });
    if (!accessToken) return res.status(400).json({ message: "Access Token이 존재하지 않습니다." });

    const isAccessTokenValidate = validateAccessToken(accessToken); // Access Token 유효성 검사
    const isRefreshTokenValidate = validateRefreshToken(refreshToken); // Refresh Token 유효성 검사

    if (!isRefreshTokenValidate) return res.status(419).json({ message: "Refresh Token이 만료되었습니다." });

    if (!isAccessTokenValidate) {
        const accessTokenId = tokenObject[refreshToken]; // Refresh Token을 이용하여 해당 유저의 ID 확인
        if (!accessTokenId) return res.status(419).json({ message: "Refresh Token의 정보가 서버에 존재하지 않습니다." });

        const newAccessToken = createAccessToken(accessTokenId); // 새로운 Access Token 생성
        res.cookie("accessToken", newAccessToken); // 새로운 Access Token을 쿠키에 저장
        return res.json({ message: "Access Token을 새롭게 발급하였습니다." });
    }

    const { id } = getAccessTokenPayload(accessToken); // Access Token에서 유저 ID 추출
    return res.json({ message: `${id}의 Payload를 가진 Token이 성공적으로 인증되었습니다.` });
});

// Access Token을 검증합니다.
function validateAccessToken(accessToken) {
    try {
        jwt.verify(accessToken, SECRET_KEY); // Access Token을 검증합니다.
        return true;
    } catch (error) {
        return false;
    }
}

// Refresh Token을 검증합니다.
function validateRefreshToken(refreshToken) {
    try {
        jwt.verify(refreshToken, SECRET_KEY); // Refresh Token을 검증합니다.
        return true;
    } catch (error) {
        return false;
    }
}

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken) {
    try {
        const payload = jwt.verify(accessToken, SECRET_KEY); // Access Token에서 Payload를 추출합니다.
        return payload;
    } catch (error) {
        return null;
    }
}

app.get("/", (req, res) => {
    res.status(200).send("Hello Token!");
});

app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
});
