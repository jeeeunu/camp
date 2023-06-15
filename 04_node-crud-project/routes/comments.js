//-- 클라이언트 : 댓글 생성 --//
const clientComments = [
  {
    user: "댓글 작성자1",
    password: "1234",
    content: "안녕하세요 댓글입니다."
  },
  {
    user: "댓글 작성자2",
    password: "12ㄴㄴ34",
    content: "안녕하세요 댓글입니다.22"
  },
];

//-- 클라이언트 : 댓글 수정 --//
const clientEditComments = {
  password: "1234",
}

//-- 클라이언트 : 댓글 삭제 --//
const cliendDeleteComments = {
  password: "1234",
}

// ------------------------------------------------------------------------- //
const express = require('express');
const router = express.Router();
const commentSchema = require('../schemas/comment-shema');
// const postSchema = require('../schemas/post-shema')
const mongoose = require('mongoose');


// POST : 댓글 등록하기
router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  req.body = clientComments;

  // postId 유효성 검사
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(404).json({ message: '유효하지 않은 게시물 ID입니다.' });
    return;
  }

  try {


    // req.body 유효성 검사
    if (!req.body.length) {
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      return;
    }

    const commentPromises = clientComments.map(async (comment) => {
      const newComment = new commentSchema({
        ...comment,
        post: postId,
        createdAt: new Date(),
      });
      await newComment.save();
    });
    await Promise.all(commentPromises);

    res.status(200).json({ message: '댓글이 작성되었습니다.' });
  } catch (error) {
    res.status(400).json({ message: '게시글 조회에 실패하였습니다.', error: error });
  }
});

// GET : 게시물에 맞는 댓글 데이터 가져오기
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const resultDatas = await commentSchema.find({ post: postId }, '_id user content'); // 뒤의 '_id .. ' 는 mongoDB 문법으로 특정 필드만 반환하도록 지정함

    // 해당하는 postId만 가져오기
    res.json(resultDatas);
  } catch (error) {
    res.status(400).json({ "message": "Error" });
  }
});

// PUT : 댓글 수정하기
router.put('/:commentID', async (req, res) => {
  const { commentID } = req.params;
  req.body = clientEditComments;

  // commentID 유효성 검사
  if (!mongoose.Types.ObjectId.isValid(commentID)) {
    res.status(404).json({ "message": "해당하는 데이터가 없습니다." })
    return;
  }

  try {
    const commentData = await commentSchema.findById(commentID);


    if (!req.body.comment) {
      res.status(400).json({ "message": "댓글내용을  입력해주세요." })
      return;
    }

    if (commentData.password === req.body.password) {
      await commentData.updateOne({ $set: req.body })
      res.status(200).json({ "message": "댓글 수정 완료" })
    } else {
      res.status(400).json({ "message": "비번 아님" })
    }

  } catch (error) {
    res.status(400).json({ "message": "오류", "error": error })
  }
});


// DELETE : 댓글 삭제
router.delete('/:commentID', async (req, res) => {
  const { commentID } = req.params;
  req.body = cliendDeleteComments;

  // commentID 유효성 검사
  if (!mongoose.Types.ObjectId.isValid(commentID)) {
    return res.status(404).json({ "message": "해당하는 데이터가 없습니다." });
  }

  try {
    const commentData = await commentSchema.findById(commentID);

    if (!commentData) {
      return res.status(404).json({ "message": "해당하는 데이터가 없습니다." });
    }

    if (commentData.password === req.body.password) {
      await commentData.deleteOne();
      return res.status(200).json({ "message": "댓글 삭제 완료" });
    } else {
      return res.status(400).json({ "message": "비번 아님" });
    }

  } catch (error) {
    return res.status(500).json({ "message": "오류", "error": error });
  }
});



module.exports = router;