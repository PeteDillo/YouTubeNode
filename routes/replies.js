const express = require("express");
const { Reply, validateReply } = require("../models/reply");
const { send } = require("express/lib/response");
const router = express.Router();


//POST a reply
//http://localhost:3007/api/replies

router.post("/", async (req,res)=>{
    try {
        let { error } = validateReply(req.body);
        if (error) return res.status(400).send(`Body for reply not valid! ${error}`);

        let newReply = await new Reply(req.body);
        await newReply.save();
        return res.status(201).send(newReply);

    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    };
});

//GET all replies
//http://localhost:3007/api/replies
router.get("/", async (req,res)=>{
    try {
        let replies = await Reply.find();
        if (!replies) return res.status(400).send(`No replies in the collection!`);
        return res.send(replies);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//TODO: move these if needed to comments.js
//PUT an existing product in shopping cart
//http://localhost:3007/api/users/:userId/shoppingcart/:productId
router.put("/:userId/shoppingcart/:productId", async(req,res)=>{
    try {
        let { error } = validateProduct(req.body);
        if (error) return res.status(400).send(`Body for product not valid! ${error}`);

        let user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`No user with ID ${req.params.usersId}!`);

        const product = user.shoppingCart.id(req.params.productId);
        if (!product) return res.status(400).send(`The product with the ID: "${req.params.productId}" does not exist in the shopping cart`);

        product.name = req.body.name;
        product.description =  req.body.description;
        product.category = req.body.category;
        product.price = req.body.price;

        await user.save();
        return res.send(product);

    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});


//DELETE an existing product in a shopping cart
//http://localhost:3007/api/users/:userId/shoppingcart/:productId
router.delete("/:userId/shoppingcart/:productId", async(req,res)=>{
    try {
        let user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`No user with ID ${req.params.usersId}!`);

        let product = user.shoppingCart.id(req.params.productId);
        if (!product) return res.status(400).send(`The product with the ID: "${req.params.productId}" does not exist in the shopping cart`);

        product = await product.remove();
        await user.save();
        return res.send(product);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }

});

module.exports = router;