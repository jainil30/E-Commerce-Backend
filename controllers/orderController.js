const Order = require('../models/Order')
const mongoose = require('mongoose')

const getOrders = async(req, res) => {
    try {
        const orders = await Order.find().sort({date: -1}).populate(['user', 'products'])
        res.status(200).json(orders)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

const getOrder = async(req, res) => {
    if(!req.user) {
        return res.status(401).json({error: 'User is unauthorized'})
    }
    try {
        const userId = req.user.id
        const order = await Order.find({ user: userId }).sort({date: -1}).populate(['user', 'products'])
        res.status(200).json(order)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

const addOrder = async(req, res) => {
    if(!req.user) {
        return res.status(401).json({error: 'User is unauthorized'})
    }
    const user_id = req.user.id
    const { cart_ids, address, payment_mode, payment_details } = req.body

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
    if(!address){
        emptyFields.push('address')
    }
    if(!payment_mode){
        emptyFields.push('payment_mode')
    }
    if(!payment_details){
        emptyFields.push('payment_details')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: 'Product Id, Address, Payment Mode and Payment Details not shoud be empty', emptyFields })
    }

    try{
        const order = await Order.create({
            user: user_id,
            products: cart_ids,
            address,
            payment: {
                mode: payment_mode,
                details: payment_details
            }
        })
        res.status(200).json(order)
    }catch(error){
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

const updateOrderStatus = async(req, res) => {
    if(!req.user) {
        return res.status(401).json({error: 'User is unauthorized'})
    }
    const user_id = req.user.id
    const { id } = req.params
    const { status } = req.body

    const emptyFields = []

    if(!status){
        emptyFields.push('status')
    }

    if(emptyFields.length > 0){
        return res.status(400).json({ error: 'Status not shoud be empty', emptyFields })
    }

    try {
        const order = await Order.findOneAndUpdate({ _id: id, user: user_id }, {
            status
        })
        if(!order){
            return res.status(404).json({error: 'No Such Order Found'})
        }
        res.status(200).json(order)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = {
    addOrder,
    getOrders,
    getOrder,
    updateOrderStatus
}