const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require("./config/config");


const authRoutes = require('./routes/authRoutes')

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
app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// mongoose.connect(config.MONGODB_URL, config.mongoose.options).then(() =>
// console.log('DB connected')).catch((err) =>
// console.log(err))

app.listen(config.port, () => console.log(`Server on ${config.port}`))