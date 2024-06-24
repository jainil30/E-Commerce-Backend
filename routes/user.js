const express = require('express');
const {
    createUser,
    getUsers,
    getUser,
    authUser,
    updateUser,
    deleteUser
} = require('../controllers/userController')

const fetchUser = require('../middleware/fetchUser')

const router = express.Router();

// Temp
router.get('/', getUsers)
// Use Token and Get User Details: GET "api/user/get" Login Required
router.get('/get', fetchUser ,getUser)
// Create New User: POST "api/user/signup"
router.post('/signup', createUser)
// Authenticate User and Genrate Token: POST "api/user/login"
router.post('/login', authUser)
// Update User Details: PATCH "api/user/updateuser" Login Required
router.patch('/update', fetchUser ,updateUser)
// Delete User: DELETE "api/user/deleteuser" Login Required
router.delete('/delete', fetchUser ,deleteUser)

module.exports = router;