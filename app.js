const express = require('express')
const path = require('path')
const app = express()
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const { create } = require('domain')



url = 'mongodb+srv://Cluster56859:Hari123@cluster56859.rute9cj.mongodb.net/Learnen'

mongoose.connect(url)
let security_question = ""
let userName = ""
let participantNames = ["Bhanu Prakash Bhaskarla", "Chappati Teja Sanjeev", "Tarun Patibandla", "HariPrasad Anuganti"];
let assignmentName = ["Lab-01", "Lab-02", "Lab-03", "Lab-04"];
let assignmentPosted = ["Posted Wednesday, Jan22, 2022", "Posted Tuesday, Jan21, 2022", "Posted Monday, Jan20, 2022", "Posted Sunday, Jan19, 2022"];
let taskslists = ["Completing Assignment-1"];
let title = "Room";

let emailCheck = ""



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

app.get('/login/forgot/change',(req,res)=>{
    res.render('Change_Password');
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

app.post('/forgotpassword',async (req,res)=>{
    const email = req.body.email;
    emailCheck = email;
    const user = await con.collection('users').findOne({Email: email});
    res.render('Security_Question',{sec_ques : user.Security_Question});
})


app.post('/changePW',async (req,res)=>{
    const email = emailCheck;
    const user = await con.collection('users').findOne({Email: email});
    const answer = req.body.sec_ans;
    if (user){
        const answerCheck = answer === user.Security_Answer;
        if(answerCheck){
            res.render('Change_Password');
        }
        else{
            res.status(404).send("Wrong Answer");
        }
    }
    else{
        res.status(401).send("User Not Found");
    }
    
});
  
app.post('/changepassword', (req, res) => {
    const { newPassword ,confirmPW} = req.body;
    const users = con.collection('users');
    const email = emailCheck;
      // Find the user with the given email
      return users.findOne({Email: email })
        .then(user => {
          if (!user) {
            return res.status(404).send('User not found');
          }

          if (newPassword != confirmPW) {
            return res.send('Please match the Confirm Password');
          }

          // Update the user's password in the database
          return users.updateOne({Email: email }, { $set: { Password: newPassword } })
            .then(result => {
              if (result.modifiedCount === 1) {
                res.redirect('/login');
                // return res.status(200).send('Password updated successfully');
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
    const security_question = req.body.security_question;
    const security_answer = req.body.security_answer;
    const JoinedRoom = []
    const createdRooms = []
    const role = "Student"
    const tags = []
    const isPremium = "False"

    const newUser = {
        userId : username,
        Email : email,
        Password: password,
        Security_Question: security_question,
        Security_Answer: security_answer,
        Joined_Room : JoinedRoom,
        Created_Room : createdRooms,
        Position: role,
        Tags : tags,
        Premium : isPremium
    }

    con.collection('users').insertOne(newUser)
    .then(async ()=>{
        userName = newUser.userId;
        res.redirect("/login");
    })  
    .catch(err => console.log(err))

});


app.post('/createRoom', (req,res)=>{
    const title = req.body.title
    const tags = req.body.tags
    const description = req.body.desc
    const publicAccess = req.body.access 
    const assignments =  []
    const resources = []
    const participants = []
    const syllabus = req.body.syllabus
    const mentor = userName

    const newRoom = {
        Title  : title,
        Description : description,
        Tags : tags,
        Access : publicAccess,
        Assignments :assignments,
        Syllabus: syllabus,
        Resources : resources,
        Participants : participants,
        Mentor : mentor
    }

    con.collection('Study-rooms').insertOne(newRoom)
    .then(async ()=>{
        res.redirect('/dashboard')
    })  
    .catch(err => console.log(err))

})


// app.post('/uploadAssignment',(req,res)=>{
//     const 
// })


// app.post('/addNote',(req,res)=>{
//     const title = req.body.title
//     const description = req.body.desc

//     const newNote = {
//         Title : title,
//         Description : description
//     }

//     con.collection('Notes').insertOne(newNote)
//     .then(async ()=>{
//         res.render('RoomViewPage')
//     })  
//     .catch(err => console.log(err))

// })

app.listen(3000)