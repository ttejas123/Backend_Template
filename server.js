const express = require('express');
const app = express()
const mongoose = require('mongoose')
//const slug = require('mongoose-slug-generator');
//Initialize
//mongoose.plugin(slug);
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('erroe', (error) => console.error(error))
db.once('open', ()=> console.log('connected to database'))

app.use(express.json())

//import Files
const studentR = require('./routes/studentR')
const user = require('./routes/userR')

//Use This api
 app.use('/student', studentR)
 app.use('/user', user)
//server listen
app.listen(3000, ()=> console.log("Started...!") )