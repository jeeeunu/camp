//-- 클라이언트 : 댓글 생성 --//
const clientComments = [
  {
    user: "Developer",
    password: "1234",
    content: "안녕하세요 댓글입니다."
  },
  {
    user: "댓글",
    password: "1234",
    content: "안녕하세요 댓글입니다.22"
  },
];

//-- 클라이언트 : 댓글 수정 --//
const clientEditComments = {
  password: "1234",
  content: "수정된 댓글입니다.",
}

//-- 클라이언트 : 댓글 삭제 --//
const cliendDeleteComments = {
  password: "1234",
}

// ------------------------------------------------------------------------- //
const express = require('express');
const router = express.Router();
const commentSchema = require('../schemas/comment');

// POST : 댓글 등록하기
router.post("/", async (req, res) => {
  try {
    req.body = clientComments;

    await Promise.all(req.body.map(async (comment) => {
      const newComment = new commentSchema(
        {
          ...comment,
          createdAt: new Date()
        }
      );
      await newComment.save();
    }))

    res.json({ "message": "댓글 생성 완료" })
  } catch (error) {
    res.status(400).json({ "message": "오류" })
  }
});

module.exports = router;