const Product = require('../models/Product')
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');

// Get All Products
const getProducts = async(req, res) => {
    try {
        const products = await Product.find().sort({date: -1})
        products.forEach(p => p.image = `${process.env.APP_URL}/uploads/${p.image}`)
        res.status(200).json(products)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

// Get Single Product
const getProduct = async(req, res) => {
    const { id } = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No Such Product Found'}) //Not Valid Id Type
        }
        const product = await Product.findOne({_id: id})
        product.image = `${process.env.APP_URL}/uploads/${product.image}`
        if(!product) {
            return res.status(404).json({error: 'No Such Product Found'})
        }
        res.status(200).json(product)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

// Create a Product
const addProduct = async(req, res) => {
    if(!req.user) {
        return res.status(401).json({ error: 'You are anauthorized'})
    }else {
        if(req.user.role != 'ADMIN') {
            return res.status(401).json({ error: 'You are anauthorized'})
        }
    }
    const {name, price} = req.body

    const emptyFields = []

    if(!name){
        emptyFields.push('name')
    }
    if(!price){
        emptyFields.push('price')
    }
    if(!req.file){
        emptyFields.push('image')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: 'Name, Price and Image not shoud be empty', emptyFields })
    }

    // add doc to db
    try{
        const product = await Product.create({
            name,
            price, 
            image: req.file.filename,
            user: req.user.id
        })
        res.status(200).json(product)
    }catch(error){
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

// Delete a product
const deleteProduct = async (req, res) => {
    if(!req.user) {
        return res.status(401).json({ error: 'You are anauthorized'})
    }else {
        if(req.user.role != 'ADMIN') {
            return res.status(401).json({ error: 'You are anauthorized'})
        }
    }
    const {id} = req.params

    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No Such Product Found'}) //Not Valid Id Type
        }
        const product = await Product.findOneAndDelete({_id: id, user: req.user.id})
        if(!product){
            return res.status(404).json({error: 'No Such Product Found'})
        }
        res.status(200).json(product)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

// Update a Product
const updateProduct = async (req, res) => {
    if(!req.user) {
        return res.status(401).json({ error: 'You are anauthorized'})
    }else {
        if(req.user.role != 'ADMIN') {
            return res.status(401).json({ error: 'You are anauthorized'})
        }
    }
    const {id} = req.params

    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No Such Product Found'}) ////Not Valid Id Type
        }
        let productDetails = {
            name: req.body.name,
            price: req.body.price
        }
        if(req.file) {
            productDetails = {
                name: req.body.name,
                price: req.body.price,
                image: req.file.filename
            }
        }
        const product = await Product.findOneAndUpdate({_id: id, user: req.user.id}, productDetails)
        if(!product){
            return res.status(404).json({error: 'No Such Product Found'})
        }
        res.status(200).json(product)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}