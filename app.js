const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static("public"))

app.get('/login',(req,res)=>{
    res.render('Login_SignUp')
})

app.get('/',(req,res)=>{
    res.render('RoomViewPage')
})

app.listen(3000)