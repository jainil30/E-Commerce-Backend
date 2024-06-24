require('dotenv').config()

const jwt = require('jsonwebtoken')

const fetchUser = (req, res, next) => {
    try {
        const token = req.header('Auth-Token')
        if(!token){
            res.status(401).send({error: "Authentication token is invalid"})
        }

        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.user

        next()
    } catch (error) {
        res.status(401).send({error: "Authentication token is invalid"})
    }
}

module.exports = fetchUser