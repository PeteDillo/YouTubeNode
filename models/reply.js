const mongoose = require("mongoose");
const Joi = require("joi");

const repliesSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  body: { type: String, required: true, minlength: 2 },
  dateAdded: { type: Date, default: Date.now() },
});

function validateReply(comment) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    body: Joi.string().required(),
  });
  return schema.validate(comment);
}

const Reply = mongoose.model("Reply", repliesSchema);

module.exports = {
  Reply,
  validateReply,
  repliesSchema,
};
