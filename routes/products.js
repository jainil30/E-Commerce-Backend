const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')
const fetchUser = require('../middleware/fetchUser');

const router = express.Router();
const getFormBody = bodyParser.urlencoded({ extended: false })
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
 
const upload = multer({ storage: storage });

// Get All Products: GET "api/products/" Login Required
router.get('/', getProducts)
// Get a Single Product: GET "api/products/:id" Login Required
router.get('/:id', getProduct)
// Add a Product: POST "api/products/" Login Required
router.post('/', [fetchUser, getFormBody, upload.single('image')], addProduct)
// Update a Product: PATCH "api/products/:id" Login Required
router.patch('/:id', [fetchUser, getFormBody, upload.single('image')], updateProduct)
// Delete a Product: PATCH "api/products/:id" Login Required
router.delete('/:id', fetchUser, deleteProduct)

module.exports = router;