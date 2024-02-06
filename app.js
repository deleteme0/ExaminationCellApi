const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const SeatR = require('./controllers/seating')
const StudentR = require('./controllers/managestudents')
const {url} = require('./utils/config') 

mongoose.connect(url).then(()=>{
    console.log("Connected")
})


app.use(cors())
app.use(express.json())
app.use('/seat/',SeatR)
app.use('/student/',StudentR);

module.exports = app