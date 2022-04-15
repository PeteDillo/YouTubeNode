const {Comment, validateComment} = require("../models/Comment");
const {Reply, validateReply} = require("../models/reply");
const express = require("express");
const {append} = require("express/lib/response")
const router = express.Router();

//GET all comments
//http://localhost:3007/api/comments
router.get("/", async (req, res) => {
    try {
        let comments = await Comment.find();
        if (!comments) return res.status(400).send(`No comments in this collection!`);
        return res.send(comments);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//GET Comment by id
//http://localhost:3007/api/comments/6254d8a0c8b02b63a73c49ad
router.get("/:id", async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id);
        if (!Comment) return res.status(400).send(`Comment with id "${req.params.id}" does not exist!`);
        return res.send(comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//PUT update a Comment
router.put("/:id", async (req, res) => {
    try {
        let comment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                body: req.body.body,
                like: req.body.like,
                dislike: req.body.dislike,
                replies: req.body.replies
            },
            {new:true}
        );
        if (!comment) return res.status(400).send(`Comment with id "${req.params.id}" does not exist!`);
        return res.send(comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//DELETE a Comment
//http://localhost:3007/api/comments/6254e000fbe3ae214584dba7
router.delete("/:id", async (req, res) => {
    try {
        let comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) return res.status(400).send(`Comment with id "${req.params.id}" does not exist!`);
        return res.send(comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//POST new Comment
router.post("/", async (req, res) => {
    try {
        const {error} = validateComment(req.body)
        if (error) return res.status(400).send(error);

        let newComment = await new Comment(req.body);
        await newComment.save();

        return res.status(201).send(newComment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//POST a reply to a comment
//http://localhost:3007/api/comments/:commentId/replies/:replyId
router.post("/:commentId/replies/:replyId", async(req,res)=>{
    try {
        let comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(400).send(`No comment with ID ${req.params.commentId}!`);

        let reply = await Reply.findById(req.params.replyId);
        if (!reply) return res.status(400).send(`Reply with ID ${req.params.replyId} does not exist!`);

        comment.replies.push(reply);
        await comment.save();
        return res.send(comment.replies);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
})
module.exports = router;