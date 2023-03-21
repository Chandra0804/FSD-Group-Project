const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static("public"))

app.get('/',(req,res)=>{
    res.render('Login_SignUp')
})

app.get('/room',(req,res)=>{
    res.render('RoomViewPage')
})

app.get('/mentorApplication',(req,res)=>{
    res.render('mentorApplication')
})

app.listen(3000)