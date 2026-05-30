const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require("./config/config");


const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')


const app = express()
//app.use(cors())
app.use(cors({
    origin: ['http://localhost:5173', 'https://task-manager-app-seven-rust.vercel.app'],
    // origin: 'https://task-manager-app-seven-rust.vercel.app',
     credentials: true
   }))
app.use(express.json())

mongoose.connect(config.mongoose.url, config.mongoose.options)
.then(() => {
    console.log('DB connected');
})
.catch((err) => {
    console.log(err);
});


app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(config.port, () => console.log(`Server on ${config.port}`))