const express = require("express");
const { User, validateUser } = require("../models/user");
const { Product, validateProduct } = require("../models/product");
const { send } = require("express/lib/response");
const router = express.Router();


//POST a user
//http://localhost:3007/api/users

router.post("/", async (req,res)=>{
    try {
        let { error } = validateUser(req.body);
        if (error) return res.status(400).send(`Body for user not valid! ${error}`);

        let newUser = await new User(req.body);
        await newUser.save();
        return res.status(201).send(newUser);

    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    };
});

//GET all users
//http://localhost:3007/api/users

router.get("/", async (req,res)=>{
    try {
        let users = await User.find();
        if (!users) return res.status(400).send(`No users in the collection!`);
        return res.send(users);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//POST a product to a shopping cart
//http://localhost:3007/api/users/:userId/shoppingcart/:productId
router.post("/:userId/shoppingcart/:productId", async(req,res)=>{
    try {
        let user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`No user with ID ${req.params.usersId}!`);

        let product = await Product.findById(req.params.productId);
        if (!product) return res.status(400).send(`Product with ID ${req.params.productId} does not exist!`);

        user.shoppingCart.push(product);
        await user.save();
        return res.send(user.shoppingCart);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
})

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