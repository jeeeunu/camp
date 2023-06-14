const express = require('express');
const router = express.Router();

//-- 클라이언트에서 보낼 데이터요 --//
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
]

// POST: post 데이터 내보내기
const postSchema = require('../db/post_schema');

router.post('/', async (req, res) => {
  try {
    for (const post of clientPosts) {
      const newPost = new postSchema(post);
      await newPost.save();
    }
    res.json('post가 저장되었습니다.');
  } catch (error) {
    console.error(error);
  }
});


module.exports = router;
