const {Product, validateProduct} = require("../models/product");
const express = require("express");
const {append} = require("express/lib/response")
const router = express.Router();

//GET all products
//http://localhost:3007/api/products
router.get("/", async (req, res) => {
    try {
        let products = await Product.find();
        if (!products) return res.status(400).send(`No products in this collection!`);
        return res.send(products);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//GET product by id
//http://localhost:3007/api/products/6254d8a0c8b02b63a73c49ad
router.get("/:id", async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(400).send(`Product with id "${req.params.id}" does not exist!`);
        return res.send(product);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//PUT update a product
router.put("/:id", async (req, res) => {
    try {
        let product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
            },
            {new:true}
        );
        if (!product) return res.status(400).send(`Product with id "${req.params.id}" does not exist!`);
        return res.send(product);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//DELETE a product
//http://localhost:3007/api/products/6254e000fbe3ae214584dba7
router.delete("/:id", async (req, res) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);

        if (!product) return res.status(400).send(`Product with id "${req.params.id}" does not exist!`);
        return res.send(product);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//POST new product
router.post("/", async (req, res) => {
    try {
        const {error} = validateProduct(req.body)
        if (error) return res.status(400).send(error);

        let newProduct = await new Product(req.body);
        await newProduct.save();

        return res.status(201).send(newProduct);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});


module.exports = router;