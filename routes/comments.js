const {Comment, validateComment} = require("../models/Comment");
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
        let Comment = await Comment.findById(req.params.id);
        if (!Comment) return res.status(400).send(`Comment with id "${req.params.id}" does not exist!`);
        return res.send(Comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//PUT update a Comment
router.put("/:id", async (req, res) => {
    try {
        let Comment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
            },
            {new:true}
        );
        if (!Comment) return res.status(400).send(`Comment with id "${req.params.id}" does not exist!`);
        return res.send(Comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//DELETE a Comment
//http://localhost:3007/api/comments/6254e000fbe3ae214584dba7
router.delete("/:id", async (req, res) => {
    try {
        let Comment = await Comment.findByIdAndDelete(req.params.id);

        if (!Comment) return res.status(400).send(`Comment with id "${req.params.id}" does not exist!`);
        return res.send(Comment);
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


module.exports = router;