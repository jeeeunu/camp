const mongoose = require('mongoose');

// comment 스키마 정의
const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model("Comment", commentSchema);