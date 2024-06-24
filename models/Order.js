const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'cart'
    },
    address: {
        type: String,
        required: true
    },
    payment: {
        mode: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        default: 'Ordered',
        // enum: ['Ordered', 'Under Process', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('order', OrderSchema);