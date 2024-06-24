const express = require('express');
const {
    getCarts,
    getCart,
    addCart,
    updateCartQty,
    updateCartType,
    deleteCartItem
} = require('../controllers/cartController')
const fetchUser = require('../middleware/fetchUser');

const router = express.Router();
 
// Get All Carts: GET "api/carts/" Login Required
router.get('/', getCarts)
// Get a Single Cart: GET "api/carts/:user_id" Login Required
router.get('/get', fetchUser, getCart)
// Add a Cart: POST "api/carts/" Login Required
router.post('/', fetchUser, addCart)
// Update a Cart: PATCH "api/carts/:id" Login Required
router.patch('/:product_id', fetchUser, updateCartQty)
// Update a Cart: PATCH "api/carts/:id" Login Required
router.post('/place-order', fetchUser, updateCartType)
// Delete a Cart: PATCH "api/carts/:id" Login Required
router.delete('/:id', fetchUser, deleteCartItem)

module.exports = router;