const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
//require('dotenv').config()
const config = require("./config/config");

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(config.mongoose.url, config.mongoose.options)
.then(() => {
    console.log('DB connected');
})
.catch((err) => {
    console.log(err);
});

// mongoose.connect(config.MONGODB_URL, config.mongoose.options).then(() =>
// console.log('DB connected')).catch((err) =>
// console.log(err))

app.listen(config.port, () => console.log(`Server on ${config.port}`))