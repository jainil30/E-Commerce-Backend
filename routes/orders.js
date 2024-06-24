const express = require('express');
const {
    getOrders,
    getOrder,
    addOrder,
    updateOrderStatus
} = require('../controllers/orderController')
const fetchUser = require('../middleware/fetchUser');

const router = express.Router();

// Get All Orders: GET "api/orders/" Login Required
router.get('/', getOrders)
// Get a Single Order: GET "api/orders/:user_id" Login Required
router.get('/get', fetchUser, getOrder)
// Add a Order: POST "api/orders/" Login Required { cart_id, address, payment_mode, payment_details }
router.post('/', fetchUser, addOrder)
// Update a Order: PATCH "api/orders/:id" Login Required
router.patch('/:id', fetchUser, updateOrderStatus)

module.exports = router;