const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number,
        min: 0,
        default: 1
    },
    type: {
        type: String,
        enum: ['ORDER', 'CART'],
        default: 'CART'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('cart', CartSchema);