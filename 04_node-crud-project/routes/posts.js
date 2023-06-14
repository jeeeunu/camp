//-- 클라이언트가 생성한 posts --//
const clientPosts = [
  {
    user: "Developer1",
    password: "1234",
    title: "안녕하세요",
    content: "안녕하세요 Developer1 입니다."
  },
  {
    user: "Developer2",
    password: "1234",
    title: "안녕하세요",
    content: "안녕하세요 Developer2 입니다."
  },
  {
    user: "Developer3",
    password: "1234",
    title: "안녕하세요",
    content: "안녕하세요 Developer3 입니다."
  }
];

//-- 클라이언트가 수정한 posts --//
const clientEditPosts = {
  title: "제목도 수정해떠요!!!",
  content: "수정해떠요!!!!",
}

//-- 클라이언트가 삭제요청. --//
const cliendDeletePosts = {
  password: "1234",
}

// ------------------------------------------------------------------------- //
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

const postSchema = require('../db/post_schema');


// POST: 게시물 데이터 내보내기
router.post('/', async (req, res) => {
  try {
    req.body = clientPosts;

    await Promise.all(req.body.map(async (post) => {
      // for of문 -> 병렬방식으로 변경 (순서를 보장할 필요 없는 반복작업)
      const newPost = new postSchema(
        {
          ...post,
          createdAt: new Date()
        }
      );
      await newPost.save();
    }));

    res.json({ "message": "게시글을 생성하였습니다." });
  } catch (error) {
    res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
  }
});

// GET : 게시물 데이터 가져오기
router.get('/', async (req, res) => {
  try {
    const postDatas = await postSchema.find();
    res.json(postDatas)
  } catch (err) {
    res.status(400).json({ "message": "hey" });
  }
});

// GET : 게시물 상세 페이지 데이터 가져오기
router.get('/:postID', async (req, res) => {
  const { postID } = req.params;

  try {
    const postData = await postSchema.findById(postID);

    if (postData) {
      res.status(200).json({ "결과": postData });
    } else {
      res.status(404).json({ "message": "해당하는 게시물이 없습니다." });
    }
  } catch (err) {
    res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
  }
});

// PUT : 게시물 수정하기
router.put('/:postID', async (req, res) => {
  const { postID } = req.params;
  req.body = clientEditPosts;

  try {
    const postData = await postSchema.findById(postID);

    if (postData && req.body) {
      await postData.updateOne({ $set: { ...clientEditPosts } });
      res.status(200).json({ "message": "게시글을 수정하였습니다." });
    }

  } catch (err) {
    if (err.name === "CastError") {
      res.status(404).json({ "message": "그런 게시물은 없습니다만" });
    } else {
      res.status(400).json({ "message": "게시글 조회에 실패하였습니다.'" });
    }
  }
});

// DELETE : 게시물 삭제하기
router.delete('/:postID', async (req, res) => {
  const { postID } = req.params;
  req.body = cliendDeletePosts;

  try {
    const postData = await postSchema.findById(postID);
    if (postData.password === req.body.password) {
      await postData.deleteOne();
      res.status(200).json({ message: "게시물을 삭제하였습니다." });
    } else {
      res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
  } catch (err) {
    res.status(400).json({ message: "오류 발생", error: err });
  }
});


module.exports = router;
