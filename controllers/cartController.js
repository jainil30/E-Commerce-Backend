const Cart = require('../models/Cart')
const mongoose = require('mongoose')

const getCarts = async(req, res) => {
    try {
        const carts = await Cart.find().sort({date: -1}).populate(['user', 'product'])
        res.status(200).json(carts)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

const getCart = async(req, res) => {
    if(!req.user) {
        return res.status(401).json({error: 'User is unauthorized'})
    }
    try {
        const userId = req.user.id
        const cart = await Cart.find({ user: userId, type: 'CART' }).sort({date: -1}).populate(['user', 'product'])
        res.status(200).json(cart)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

const addCart = async(req, res) => {
    if(!req.user) {
        return res.status(401).json({error: 'User is unauthorized'})
    }
    const user_id = req.user.id
    const { product_id } = req.body

    const emptyFields = []
    const invalidFields = []

    if(!product_id){
        emptyFields.push('product_id')
    }else {
        if(!mongoose.Types.ObjectId.isValid(product_id)){
            invalidFields.push('product_id')
            return res.status(400).json({error: 'Invalid ProductId', invalidFields})
        }
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: 'ProductId and Type not shoud be empty', emptyFields })
    }

    try{
        const cart = await Cart.create({
            user: user_id,
            product: product_id
        })
        res.status(200).json(cart)
    }catch(error){
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

const updateCartQty = async(req, res) => {
    if(!req.user) {
        return res.status(401).json({error: 'User is unauthorized'})
    }
    const user_id = req.user.id
    const { product_id } = req.params
    const { qty } = req.body

    const emptyFields = []
    const invalidFields = []

    if(!product_id){
        emptyFields.push('product_id')
    }else {
        if(!mongoose.Types.ObjectId.isValid(product_id)){
            invalidFields.push('product_id')
            return res.status(400).json({error: 'Invalid ProductId', invalidFields})
        }
    }
    if(!qty){
        emptyFields.push('qty')
    }else {
        if(qty < 0){
            invalidFields.push('qty')
            return res.status(400).json({error: "Quantity can't be nagative", invalidFields})
        }
    }

    try {
        const cart = await Cart.findOneAndUpdate({ user: user_id, product: product_id }, {
            quantity: qty
        })
        if(!cart){
            return res.status(404).json({error: 'No Such Cart Found'})
        }
        res.status(200).json(cart)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

const updateCartType = async(req, res) => {
    if(!req.user) {
        return res.status(401).json({error: 'User is unauthorized'})
    }
    const user_id = req.user.id
    const { cart_ids } = req.body

    const emptyFields = []
    const invalidFields = []

    if(!cart_ids){
        emptyFields.push('cart_ids')
    }else {
        if(Array.isArray(cart_ids) && cart_ids.length > 0){
            let invalid = false;
            for(let i=0; i<cart_ids.length; i++) {
                if(!mongoose.Types.ObjectId.isValid(cart_ids[i])){
                    invalid = true;
                    break;
                }
            }
            if(invalid) {
                invalidFields.push('cart_ids')
                return res.status(400).json({error: 'Invalid Cart Ids', invalidFields})
            }
        }else {
            invalidFields.push('cart_ids')
            return res.status(400).json({error: 'Invalid Cart Ids', invalidFields})
        }
    }

    try {
        let failed = false
        for(let i=0; i<cart_ids.length; i++) {
            let cart = await Cart.findOneAndUpdate({ _id: cart_ids[i], user: user_id }, { type: 'ORDER' })
            if(!cart){
                failed = true;
                break;
            }
        }
        if(failed) {
            return res.status(400).json({error: 'Failed to update cart'})
        }
        res.status(200).json({success: true, message: "Order has been placed"})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

const deleteCartItem = async(req, res) => {
    const {id} = req.params

    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No Such Cart Found'})
        }
        const cart = await Cart.findOneAndDelete({_id: id, user: req.user.id})
        if(!cart){
            return res.status(404).json({error: 'No Such Cart Found'})
        }
        res.status(200).json(cart)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = {
    addCart,
    getCarts,
    getCart,
    updateCartQty,
    updateCartType,
    deleteCartItem
}