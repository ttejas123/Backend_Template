const express = require('express');
const app = express()
const mongoose = require('mongoose')
const user = require('./model/user')
const jwt = require('jsonwebtoken');
const GToken = require('./routes/Gtoken');
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('erroe', (error) => console.error(error))
db.once('open', ()=> console.log('connected to database'))

app.use(express.json())

let refreshToken = [];

//Genarate new token after your pre token 
app.post('/token', async (req, res) => {
    const refT = req.body.refT
    if(refT == null) return res.status(404).json({msg: "null Value"});
    if(!refreshToken.includes(refT)) return res.status(403).json({msg: 'Forbidan'}) 
    jwt.verify(refT, process.env.REFRESH_TOKEN_SECRATE, (err, user) => {
        if(err) return res.status(403);
        const accessTokenKy = GToken({
                    id: user.id,
                    user: user.username
        })
        res.status(202).json({token: accessTokenKy})
    })
})

//logout 
app.delete('/deleteRefT', async (req, res) => {
    const refT = req.body.refT;
    if(refT == null) return res.status(404).json({msg: "null Value"});
    if(!refreshToken.includes(refT)) return res.status(403).json({msg: 'Forbidan'}) 
    refreshToken = refreshToken.filter(token => {
        return token != refT
    })
    res.status(202).json({msg: "Deleted"})
})

//login
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    //, $options: "i"
    const data = await user.find({$and: [{ username: { $regex: req.body.username} }, { password: { $regex: password} }]})
    if(data.length > 0){
        const userss = {
                    id: data[0]._id,
                    user: data[0].username
                 }
        const accessToken = GToken(userss)
        const refreshTokenn = jwt.sign(userss, process.env.REFRESH_TOKEN_SECRATE);
        refreshToken.push(refreshTokenn)
        res.status(202).json({accessToken: accessToken, refreshToken: refreshTokenn})
    } else {
        res.status(404).json({msg: "Incorrect Credential"})
    }
})

//server listen
app.listen(4000, ()=> console.log("Started...! at 4000") )