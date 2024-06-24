require('dotenv').config()

const User = require('../models/User')
const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Get Single User
const getUser = async (req, res) => {
    try {
        const userId = req.user.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ error: 'No Such User Found' }) //Not Valid Id Type
        }
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({ error: 'No Such User Found' })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Authenticate a User
const authUser = async (req, res) => {
    const { email, password } = req.body

    const emptyFields = []
    const invalidFields = []

    if (!email) {
        emptyFields.push('email')
    }
    if (!password) {
        emptyFields.push('password')
    } else {
        if (password.length < 3) {
            invalidFields.push('password')
            return res.status(400).json({ error: 'Invalid Password', invalidFields })
        }
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill the all the fields', emptyFields })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Enter valid user details' }) //User not exist
        }

        const passComp = await bcrypt.compare(password, user.password)
        if (!passComp) {
            return res.status(400).json({ error: 'Enter valid user details' }) //Password is wrong
        }

        // JWT Auth
        console.log(user._id)
        console.log(user.role)
        const data = {
            user: {
                id: user._id,
                role: user.role
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET)

        res.status(200).json({ authToken })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Create a User
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body

    const emptyFields = []
    const invalidFields = []

    if (!email) {
        emptyFields.push('email')
    } else {
        try {
            const user = await User.findOne({ email })
            if (user) {
                invalidFields.push('email')
                return res.status(400).json({ error: 'Email is already exist', invalidFields })
            }
        } catch (error) {
            console.error(error.message)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
    if (!name) {
        emptyFields.push('name')
    } else {
        if (name.length < 3) {
            invalidFields.push('name')
        }
    }
    if (!password) {
        emptyFields.push('password')
    } else {
        if (password.length < 3) {
            invalidFields.push('password')
        }
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill the all the fields', emptyFields })
    }
    if (invalidFields.length > 0) {
        if (invalidFields.indexOf('name') >= 0 || invalidFields.indexOf('password') >= 0) {
            return res.status(400).json({ error: 'Name or Password is To Short', invalidFields })
        }
    }

    // Password Hasing
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    // add doc to db
    try {
        let userDetails = { name, email, role, password: secPass }
        if(!role) {
            userDetails = { name, email, password: secPass }
        }
        const user = await User.create(userDetails)

        // JWT Auth
        console.log(user._id)
        console.log(user.role)
        const data = {
            user: {
                id: user._id,
                role: user.role
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET)

        res.status(200).json({ authToken })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Delete a user
const deleteUser = async (req, res) => {
    const userId = req.user.id

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ error: 'No Such User Found' }) //Not Valid Id Type
        }
        const notes = await Note.find({ user: userId })
        notes.forEach(async (user) => {
            let note = await Note.findOneAndDelete({ _id: user._id })
            if (!note) {
                return res.status(500).json({ error: "Internal Server Error" })
            }
        });
        const user = await User.findOneAndDelete({ _id: userId })
        if (!user) {
            return res.status(404).json({ error: 'No Such User Found' })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Update a User
const updateUser = async (req, res) => {
    const userId = req.user.id

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ error: 'No Such User Found' }) ////Not Valid Id Type
        }

        const { name, email, password, role } = req.body

        const emptyFields = []
        const invalidFields = []

        if (!email) {
            emptyFields.push('email')
        } else {
            try {
                const user = await User.findOne({ email })
                if (user) {
                    invalidFields.push('email')
                    return res.status(400).json({ error: 'Email is already exist', invalidFields })
                }
            } catch (error) {
                console.error(error.message)
                res.status(500).json({ error: "Internal Server Error" })
            }
        }
        if (!name) {
            emptyFields.push('name')
        } else {
            if (name.length < 3) {
                invalidFields.push('name')
            }
        }
        if (!role) {
            emptyFields.push('role')
        } else {
            if (role != 'admin' && role != 'user') {
                invalidFields.push('role')
            }
        }
        if (!password) {
            emptyFields.push('password')
        } else {
            if (password.length < 8) {
                invalidFields.push('password')
            }
        }

        if (emptyFields.length > 0) {
            return res.status(400).json({ error: 'Please fill the all the fields', emptyFields })
        }
        if (invalidFields.length > 0) {
            if (invalidFields.indexOf('name') >= 0 || invalidFields.indexOf('password') >= 0) {
                return res.status(400).json({ error: 'Name or Password is To Short', invalidFields })
            }
            if (invalidFields.indexOf('role') >= 0) {
                return res.status(400).json({ error: 'Given Role is invalid', invalidFields })
            }
        }

        const user = await User.findOneAndUpdate({ _id: userId }, {
            ...req.body
        })
        if (!user) {
            return res.status(404).json({ error: 'No Such User Found' })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    authUser,
    updateUser,
    deleteUser
}