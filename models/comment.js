const mongoose = require("mongoose");
const Joi = require("joi");
const { repliesSchema } = require("./reply");

const commentSchema = new mongoose.Schema({
  videoId: { type: String, required: true},
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  body: { type: String, required: true, minlength: 2 },
  like: { type: Boolean, required: true },
  dislike: { type: Boolean, required: true },
  dateAdded: { type: Date, default: Date.now() },
  replies: [repliesSchema],
});

function validateComment(comment) {
  const schema = Joi.object({
    videoId: Joi.string().required(),
    name: Joi.string().min(2).max(255).required(),
    body: Joi.string().required(),
    like: Joi.boolean().required(),
    dislike: Joi.boolean().required(),
  });
  return schema.validate(comment);
}

const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
  Comment,
  validateComment,
  commentSchema,
};
