const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  value: String, // 할일이 어떤것인지 확인하는 컬럼
  doneAt: Date, // 할일이 언제 완료되었는지
  order: Number, // 몇번째 할일인지
});

// 프론트엔드에 가상의 컬럼(virtual) 제공 => db에는 없으나 express내부에서만 확인가능함.
TodoSchema.virtual("todoId").get(() => { this._id.toHexString(); }) // toHexString(); < 에러방지
TodoSchema.set("toJSON", {
  virtuals: true
})

module.exports = mongoose.model("Todo", TodoSchema);