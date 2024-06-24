require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express');
const app = express();
var cors = require('cors');
const path = require('path')

// Connect to mongoose
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, ()=>{
            console.log('E-commarce backend connected to db & listening on port ', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

// To Allow CORS Access
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// To use json as request
app.use(express.json());

//  All Requests
app.use('/api/users', require("./routes/user")); 
app.use('/api/products', require("./routes/products")); 
app.use('/api/carts', require("./routes/carts")); 
app.use('/api/orders', require("./routes/orders")); 