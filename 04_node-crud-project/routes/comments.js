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
const postSchema = require('../schemas/post-shema')
const mongoose = require('mongoose');


// POST : 댓글 등록하기
router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  const commentData = req.body;

  try {

    // 유효성 검사: 게시물 ID 및 게시물 여부 확인 (최상단 위치)
    const postData = await postSchema.findById(postId);
    if (!mongoose.Types.ObjectId.isValid(postId) || !postData) {
      return res.status(404).json({ "message": "게시글 조회에 실패하였습니다." });
    }

    // 유효성 검사 : body, params
    if (!postId || !commentData) {
      return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }

    // 유효성 검사 : 댓글 내용
    if (commentData.content === '') {
      return res.status(400).json({ "message": "댓글 내용을 입력해주세요" })
    }

    const newComment = new commentSchema({
      ...commentData,
      post: postId
    });
    await newComment.save();

    res.status(200).json({ "message": "댓글이 작성되었습니다.", "comment": newComment });
  } catch (error) {
    res.status(400).json({ "message": "오류 발생", "error": error });
  }
});


// GET : 게시물에 맞는 댓글 데이터 가져오기
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {

    // 유효성 검사: 게시물 ID 및 게시물 여부 확인 (최상단 위치)
    const postData = await postSchema.findById(postId);
    if (!mongoose.Types.ObjectId.isValid(postId) || !postData) {
      return res.status(404).json({ "message": "게시글 조회에 실패하였습니다." });
    }

    const resultDatas = await commentSchema.find({ post: postId }, '_id user content'); // 뒤의 '_id .. ' 는 mongoDB 문법으로 특정 필드만 반환하도록 지정함

    // 유효성 검사 : body, params
    if (!postId) {
      return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }

    res.status(200).json({ "message": "데이터 전송완료", "comments": resultDatas })
  } catch (error) {
    res.status(400).json({ "message": error });
  }
});

// PUT : 댓글 수정하기
router.put('/:commentID', async (req, res) => {
  const { commentID } = req.params;
  const editCommentData = req.body;

  try {
    const commentData = await commentSchema.findById(commentID);

    // 유효성 검사 : 댓글 작성 여부
    if (!editCommentData.content) {
      res.status(400).json({ "message": "댓글내용을  입력해주세요." })
      return;
    }

    // 유효성 검사 : body, params
    if (!commentID || !editCommentData) {
      return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }

    // 유효성 검사 : 비밀번호
    if (commentData.password === editCommentData.password) {
      await commentData.updateOne({ $set: editCommentData })
      res.status(200).json({ "message": "댓글 수정 완료" })
    } else {
      res.status(400).json({ "message": "비밀번호가 틀렸습니다." })
    }

  } catch (error) {
    res.status(400).json({ "message": "오류", "error": error })
  }
});


// DELETE : 댓글 삭제
router.delete('/:commentID', async (req, res) => {
  const { commentID } = req.params;
  const deleteData = req.body;

  try {
    const commentData = await commentSchema.findById(commentID);

    // 유효성 검사 : body, params
    if (!commentID || !deleteData) {
      return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }

    if (commentData.password === deleteData.password) {
      await commentData.deleteOne();
      return res.status(200).json({ "message": "댓글 삭제 완료" });
    } else {
      return res.status(400).json({ "message": "비밀번호가 틀렸습니다." });
    }

  } catch (error) {
    return res.status(500).json({ "message": "오류", "error": error });
  }
});



module.exports = router;