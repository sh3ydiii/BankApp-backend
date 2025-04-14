const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const router = require('./routes/index')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api', router)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(process.env.PORT, () => console.log(`Server started on PORT ${process.env.PORT}`))
    } catch (err) {
        console.log(err.message)
    }
}

start()