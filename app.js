const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const bodyparser = require("body-parser")

let userName = "Chandra Sai Teja Adhikarla"
let participantNames = ["Bhanu Prakash Bhaskarla","Chappati Teja Sanjeev","Tarun Patibandla","HariPrasad Anuganti"];
let assignmentName = ["Lab-01","Lab-02","Lab-03","Lab-04"];
let assignmentPosted = ["Posted Wednesday, Jan22, 2022" , "Posted Tuesday, Jan21, 2022" , "Posted Monday, Jan20, 2022" , "Posted Sunday, Jan19, 2022"];
let taskslists = ["Completing Assignment-1","Reading Textbook from pages 130 to 150","Completing Bootcamp","Completing FSD Project"];

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyparser.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/login-signup',(req,res)=>{
    res.render('Login_SignUp')
})

app.get('/room',(req,res)=>{
    res.render('RoomViewPage' , {participantNames : participantNames , assignmentName : assignmentName , assignmentPosted : assignmentPosted , taskslists : taskslists , userName : userName})
})

app.get('/mentorApplication',(req,res)=>{
    res.render('mentorApplication')
})

app.get('/dashboard',(req,res)=>{
    res.render('dashboard_page')
})

app.post("/login-signup/signup", (req,res)=>{
    console.log("creating acount")
})


app.post('/login-signup/login',(req,res)=>{
    console.log("logging in")
})


app.listen(3000)