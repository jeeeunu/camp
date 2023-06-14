//-- 클라이언트 : 댓글 생성 --//
const clientComments = [
  {
    user: "댓글 작성자1",
    password: "1234",
    content: "안녕하세요 댓글입니다."
  },
  {
    user: "댓글 작성자2",
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
const commentSchema = require('../schemas/comment-shema');
const postSchema = require('../schemas/post-shema')
const mongoose = require('mongoose');


// POST : 댓글 등록하기
// router.post('/:postID', async (req, res) => {
//   const { postID } = req.params;
//   try {

//     const existingPost = await postSchema.findById(postID);
//     if (!existingPost) {
//       return;
//     }
//     req.body = clientComments;

//     await Promise.all(clientComments.map(async (comment) => {
//       const newComment = new commentSchema({
//         ...comment,
//         post: postID,
//         createdAt: new Date(),
//       });
//       await newComment.save();
//     }));

//     res.status(200).json({ message: '댓글이 작성되었습니다.' });

//   } catch (error) {
//     switch (error.name) {
//       case "CastError":
//         res.status(404).json({
//           "message": "그런 게시물은 없습니다만",
//           "error": error
//         });
//         break;
//       default:
//         res.status(400).json({
//           "message": "게시글 조회에 실패하였습니다.",
//           "error": error
//         });
//         break;
//     }
//   }
// });

router.post('/:postID', async (req, res) => {
  const { postID } = req.params;

  req.body = clientComments;

  // postID 유효성 검사
  if (!mongoose.Types.ObjectId.isValid(postID)) {
    res.status(404).json({ message: '유효하지 않은 게시물 ID입니다.' });
    return;
  }

  // req.body 유효성 검사
  if (!req.body.length) {
    res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    return;
  }

  try {
    const commentPromises = clientComments.map(async (comment) => {
      const newComment = new commentSchema({
        ...comment,
        post: postID,
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


module.exports = router;