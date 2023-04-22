const express = require('express')
const path = require('path')
const app = express()
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

url = 'mongodb://0.0.0.0/Learnen'

mongoose.connect(url)
let userName = ""
let participantNames = ["Bhanu Prakash Bhaskarla", "Chappati Teja Sanjeev", "Tarun Patibandla", "HariPrasad Anuganti"];
let assignmentName = ["Lab-01", "Lab-02", "Lab-03", "Lab-04"];
let assignmentPosted = ["Posted Wednesday, Jan22, 2022", "Posted Tuesday, Jan21, 2022", "Posted Monday, Jan20, 2022", "Posted Sunday, Jan19, 2022"];
let taskslists = ["Completing Assignment-1"];
let title = "Room";





app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('Login')
})
app.get('/signup',(req,res)=>{
    res.render('SignUp');
})

app.get('/contactus', (req, res) => {
    res.render('contact_us')
})
app.get('/login/mentorApplication', (req, res) => {
    res.render('mentorApplication')
})

app.get('/login/createroom', (req, res) => {
    res.render('createroom')
})

app.get('/about', (req, res) => {
    res.render('AboutUs')
})

app.get('/login/forgot',(req,res)=>{
    res.render('Forgot_Password');
    

})

app.get('/login/index', (req, res) => {
    res.redirect('/')
})

app.get('/login/premium', (req, res) => {
    res.render('premium')
})

app.get('/logout', (req, res) => {
    userName = null;
    res.redirect('/'); 
  });
const con = mongoose.connection;

con.on('open',()=>{
    console.log("MongoDB Connected")
    console.log("Table Created")
})

con.on('error', (err)=> {
    console.log(err);
})



app.post('/login', async (req, res) => {
    
    const email = req.body.logemail;
    const user = await con.collection('users').findOne({Email: email});
    if (user){
        const result = req.body.logpass === user.Password;
        if(result){
            userName = user.userId;
            res.render("dashboard_page",{user: userName});
        }
        else{
            res.status(400).json({ error: "password doesn't match" });
        }

    }
    else{
        res.status(400).json({ error: "User doesn't exist" });
    }

});


app.post('/changepassword', (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    const users = con.collection('users');

      // Find the user with the given email
      return users.findOne({Email: email })
        .then(user => {
          if (!user) {
            return res.status(404).send('User not found');
          }

          if (user.Password !== oldPassword) {
            return res.status(401).send('Old password is incorrect');
          }

          // Update the user's password in the database
          return users.updateOne({Email: email }, { $set: { Password: newPassword } })
            .then(result => {
              if (result.modifiedCount === 1) {
                return res.status(200).send('Password updated successfully');
              } else {
                return res.status(500).send('Error updating password');
              }
            });
        });

})
  
app.get('/login/room', (req, res) => {
    res.render('RoomViewPage', { participantNames: participantNames, assignmentName: assignmentName, assignmentPosted: assignmentPosted, taskslists: taskslists, userName: userName, title: title })
})

app.get('/termsconditions',(req,res)=>{
    res.render('terms_conditions');
})

app.get('/dashboard',(req,res)=>{
    if(userName!=null){
    res.render('dashboard_page',{user : userName});
    }
    else{
        res.redirect('/login');
    }
})

app.get('/login/payment',(req,res)=>{
    res.render('payment');
})

app.get('/paymentstatus',(req,res)=>{
    res.render('paymentstatus');
})

app.post('/signup', (req, res) => {
    const username = req.body.signupname;
    const email = req.body.signupemail;
    const password = req.body.signuppass;

    const newUser = {
        userId : username,
        Email : email,
        Password: password
    }

    con.collection('users').insertOne(newUser)
    .then(async ()=>{
        userName = newUser.userId;
        res.redirect("/login");
    })  
    .catch(err => console.log(err))

});



app.listen(3000)