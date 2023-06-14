const mongoose = require('mongoose');

// post 스키마 내용 정의
const postSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Post", postSchema);