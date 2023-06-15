const express = require('express');
const router = express.Router();
const postSchema = require('../schemas/post-shema');
const mongoose = require('mongoose');


// POST: 게시물 등록하기
router.post('/', async (req, res) => {
  const postDatas = req.body;
  try {
    // 유효성 검사 : body, params
    if (!postDatas || !postDatas.length) {
      return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }

    await postSchema.create(postDatas);

    res.status(200).json({ "message": "게시글을 생성하였습니다.", "post": postDatas });
  } catch (error) {
    res.status(400).json({ "message": "오류 발생", "error": error });
  }
});



// GET : 게시물 데이터 가져오기
router.get('/', async (req, res) => {
  try {
    const postDatas = await postSchema.find();
    res.json({ "result": postDatas })
  } catch (error) {
    res.status(400).json({ "message": "오류 발생", "error": error });
  }
});


// GET : 게시물 상세 페이지 데이터 가져오기
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const postData = await postSchema.findById(postId);

    if (!postData) {
      return res.status(404).json({ "message": "유효하지 않은 게시물 ID입니다." });
    }

    res.status(200).json({ "message": "데이터 전송완료", "post": postData });
  } catch (error) {
    res.status(400).json({ "message": "오류 발생", "error": error });
  }
});


// PUT : 게시물 수정하기
router.put('/:postId', async (req, res) => {
  const { postId } = req.params;
  const editData = req.body;

  try {
    // 유효성 검사: 게시물 ID 및 게시물 여부 확인 (최상단 위치)
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({ "message": "유효하지 않은 게시물 ID입니다." });
    }

    const postData = await postSchema.findById(postId);
    if (!postData) {
      return res.status(404).json({ "message": "해당하는 게시물이 없습니다." });
    }

    // 유효성 검사 : body, params
    if (!postId || !editData || !editData.password) {
      return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }

    // 유효성 검사 : 비밀번호 일치 여부
    if (postData.password !== editData.password) {
      return res.status(400).json({ "message": "비밀번호가 일치하지 않습니다." });
    }

    const updatedPost = await postSchema.findByIdAndUpdate(postId, editData);

    res.status(200).json({ "message": "게시글을 수정하였습니다.", "post": updatedPost });
  } catch (error) {
    res.status(400).json({ "message": "오류 발생", "error": error });
  }
});


// DELETE : 게시물 삭제하기
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const deleteData = req.body;

  try {
    // 유효성 검사: 게시물 ID 및 게시물 여부 확인 (최상단 위치)
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({ "message": "유효하지 않은 게시물 ID입니다." });
    }

    const postData = await postSchema.findById(postId);
    if (!postData) {
      return res.status(404).json({ "message": "해당하는 게시물이 없습니다." });
    }

    // 유효성 검사 : body, params
    if (!postId || !deleteData || !deleteData.password) {
      return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }

    // 유효성 검사 : 비밀번호 일치 여부
    if (postData.password !== deleteData.password) {
      return res.status(401).json({ "message": "비밀번호가 일치하지 않습니다." });
    }

    await postData.deleteOne();

    res.status(200).json({ "message": "게시물을 삭제하였습니다." });
  } catch (error) {
    res.status(400).json({ "message": "오류 발생", "error": error });
  }
});




module.exports = router;
