const express = require('express')
const path = require('path')
const app = express()
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const { create } = require('domain')
const nodemailer = require('nodemailer');
const multer = require('multer');
const session = require('express-session');
// Set up middleware to handle form data
app.use(multer().any());


url = 'mongodb+srv://Cluster56859:Hari123@cluster56859.rute9cj.mongodb.net/Learnen'
mongoose.connect(url)


const User = require('./models/user');
const Room = require('./models/room');
const Note = require('./models/note');
const Assignment = require('./models/assignment');
const Resource = require('./models/resource');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge:60*60*1000},
    store: new session.MemoryStore()
}));


let security_question = ""
let userName = ""
let participantNames = ["Bhanu Prakash Bhaskarla", "Chappati Teja Sanjeev", "Tarun Patibandla", "HariPrasad Anuganti"];
let assignmentName = ["Lab-01", "Lab-02", "Lab-03", "Lab-04"];
let assignmentPosted = ["Posted Wednesday, Jan22, 2022", "Posted Tuesday, Jan21, 2022", "Posted Monday, Jan20, 2022", "Posted Sunday, Jan19, 2022"];
let taskslists = ["Completing Assignment-1"];
let title = "Room";
let emailCheck = ""
let mentor = true;
let admin = true;



app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }));


function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

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
app.get('/mentorApplication', (req, res) => {
    res.render('mentorApplication')
})

app.get('/createroom', (req, res) => {
    res.render('CreateRoom',{user:req.session.user});
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
    // userName = null;
    // res.redirect('/'); 

    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });


  });
const con = mongoose.connection;

con.on('open',()=>{
    console.log("MongoDB Connected")
    console.log("Table Created")
})

con.on('error', (err)=> {
    console.log(err);
})

app.get('/dashboard/joined',(req,res)=>{
    res.render('dashboard_joined',{user : userName,mentor,admin})
})

app.get('/dashboard/admin',(req,res)=>{
    res.render('admin_console',{user : userName,mentor,admin})
})



app.post('/delete-room/:id', requireLogin, async (req, res) => {
  const user = req.session.user;
  const room = await Room.findById(req.params.id);
  
  if (!room || user._id.toString() !== room.mentor._id.toString()) {
  res.redirect('/dashboard');
  } else {
  // Remove room from all participants' joined_rooms array
  for (const participant of room.participants) {
  participant.joined_rooms = participant.joined_rooms.filter(
  joined_room => joined_room._id.toString() !== room._id.toString()
  );
  await participant.save();
  }
  user.created_rooms = user.created_rooms.filter(
      created_room => created_room._id.toString() !== room._id.toString()
    );
    await user.save();
    
    // Delete the room
    await Room.findByIdAndDelete(room._id);
    
    res.redirect('/dashboard');}
  });

app.post('/login', async (req, res) => {

    const Email = req.body.logemail;
    const Password = req.body.logpass;

  // Find user by username
     const user = await User.findOne({ Email });

  // If user not found or password doesn't match, redirect back to login page
    if (!user || user.Password !== Password) {
        return res.redirect('/login');
    }

  // Set session variable for currently logged in user
  req.session.user = user;

  // Redirect to home page
  res.redirect('/dashboard');
    
    // const email = req.body.logemail;
    // const user = await User.findOne({Email: email});
    // if (user){
    //     const result = req.body.logpass === user.Password;
    //     if(result){
    //         // userName = user.userId;
    //         req.session.user = user;
    //         res.render("dashboard",{user : userName,mentor,admin});
    //     }
    //     else{
    //         res.status(400).json({ error: "password doesn't match" });
    //     }

    // }
    // else{
    //     res.status(400).json({ error: "User doesn't exist" });
    // }
    // const email = req.body.logemail;
    // const password = req.body.logpass
    // const user = await User.findOne({email});
    // if (user){
    //     const result = password === user.Password;
    //     if(result){
    //         req.session.user = user;
    //         // userName = user.userId;
    //         // res.render("dashboard",{user : userName,mentor,admin});
    //         res.redirect('/dashboard');
    //     }
    //     else{
    //         res.status(400).json({ error: "password doesn't match" });
    //     }

    // }
    // else{
    //     res.status(400).json({ error: "User doesn't exist" });
    // }

    // const { email, password } = req.body;
    // const email = req.body.logemail;
    // const password = req.body.logpass;
    // const user = await User.findOne({ email });
  
    // if (!user || user.password !== password) {
    //   res.render('Login');
    // } else {
    //   req.session.user = user;
    //   res.redirect('/dashboard');
    // }

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
  
// app.get('/room', (req, res) => {
//     res.render('Room', { participantNames: participantNames, assignmentName: assignmentName, assignmentPosted: assignmentPosted, taskslists: taskslists, userName: userName, title: title })
// })

app.get('/room/:id', requireLogin, async (req, res) => {
  const user = req.session.user;
  const room = await Room.findById(req.params.id)
  .populate('mentor', 'username')
  .populate('participants', 'username')
  .populate('assignments')
  .populate('resources')
  .populate('notes');
      
if (!room) {
  res.redirect('/dashboard');
} else {
  const isParticipant = room.participants.some(
  participant => participant._id.toString() === user._id.toString()
  );
  const isMentor = user._id.toString() === room.mentor._id.toString();
  res.render('room', { user, room, isParticipant, isMentor });
}
});

app.post('/createroom', requireLogin, async (req, res) => {
  const user = req.session.user;
  const { title, description, tags, syllabus } = req.body;
  
  const newRoom = new Room({
  title,
  description,
  tags,
  syllabus,
  mentor: user,
  });
  try {
      await newRoom.save();
      user.created_rooms.push(newRoom);
      await user.save();
      res.redirect(`/room/${newRoom._id}`);} 
  catch (err) {
          console.error(err);
          res.redirect('/dashboard');
      }
});


app.get('/termsconditions',(req,res)=>{
    res.render('terms_conditions');
})

app.get('/dashboard', requireLogin,async (req,res)=>{
    // if(userName!=null){
    // res.render('dashboard',{user : userName,mentor,admin});
    // }
    // else{
    //     res.redirect('/login');
    // }

    const user = req.session.user;
    const rooms = await Room.find();
  //   const rooms = await Room.find({ participants: user }).populate('mentor').populate('participants');
    res.render('dashboard', { 
      user, 
      rooms,
      myrooms:user.Joined_Room 
  });
})

app.get('/login/payment',(req,res)=>{
    res.render('payment');
})

app.get('/paymentstatus',(req,res)=>{
    res.render('paymentstatus');
})

app.post('/join/:id', requireLogin, async (req, res) => {
  const user = req.session.user;
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.redirect('/dashboard');
  } else {
    room.participants.push(user);
    await room.save();
    user.joined_rooms.push(room);
    await user.save();
    res.redirect(`/room/${room._id}`);
}});


app.post('/signup', async (req, res) => {
    // const username = req.body.signupname;
    // const email = req.body.signupemail;
    // const password = req.body.signuppass;
    // const security_question = req.body.security_question;
    // const security_answer = req.body.security_answer;
    // const JoinedRoom = []
    // const createdRooms = []
    // const role = "Student"
    // const tags = []
    // const isPremium = "False"

    // const newUser = {
    //     userId : username,
    //     Email : email,
    //     Password: password,
    //     Security_Question: security_question,
    //     Security_Answer: security_answer,
    //     Joined_Room : JoinedRoom,
    //     Created_Room : createdRooms,
    //     Position: role,
    //     Tags : tags,
    //     Premium : isPremium
    // }

    // con.collection('users').insertOne(newUser)
    // .then(async ()=>{
    //     userName = newUser.userId;
    //     res.redirect("/login");
    // })  
    // .catch(err => console.log(err))

    const { username, email, password, securityQuestion, securityAnswer} = req.body;

  try {
    const user = new User({
      username,
      email,
      password,
      securityQuestion,
      securityAnswer,
      joinedRooms: [],
      createdRooms: [],
      position:"student",
      tags: [],
      premium:"false" ,
    });
    await user.save();
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('SignUp');
  }


});




// app.post('/createRoom', (req,res)=>{
//     const title = req.body.title
//     const tags = req.body.tags
//     const description = req.body.desc
//     const publicAccess = req.body.access 
//     const assignments =  []
//     const resources = []
//     const participants = []
//     const syllabus = req.body.syllabus
//     const mentor = userName

//     const newRoom = {
//         Title  : title,
//         Description : description,
//         Tags : tags,
//         Access : publicAccess,
//         Assignments :assignments,
//         Syllabus: syllabus,
//         Resources : resources,
//         Participants : participants,
//         Mentor : mentor
//     }

//     con.collection('Study-rooms').insertOne(newRoom)
//     .then(async ()=>{
//         res.redirect('/dashboard')
//     })  
//     .catch(err => console.log(err))

// })
app.post('/leave/:id', requireLogin, async (req, res) => {
  const user = req.session.user;
  const room = await Room.findById(req.params.id);
  
  if (!room) {
  res.redirect('/dashboard');
  } else {
  // Remove user from participants array
  room.participants = room.participants.filter(
  participant => participant._id.toString() !== user._id.toString()
  );
  await room.save();
  user.joined_rooms = user.joined_rooms.filter(
      joined_room => joined_room._id.toString() !== room._id.toString()
    );
    await user.save();
    
    res.redirect('/dashboard');
  }
});


app.post('/submit-form', requireLogin, (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "user.learnen@gmail.com",
            pass: "ypzqhkpbtowzmedn"
        }
    });

    const mailOptions = {
        from: "user.learnen@gmail.com",
        to: "console.learnen@gmail.com",
        subject: "New Mentor Application Recieved",
        html: `
          <p>First Name: ${req.body.fname}</p>
          <p>Last Name: ${req.body.lname}</p>
          <p>Email: ${req.body.email}</p>
          <p>Phone Number: ${req.body.phno}</p>
          <p>Address Line1: ${req.body.addressLine1}</p>
          <p>Address Line2: ${req.body.addressLine2}</p>
          <p>City: ${req.body.city}</p>
          <p>State: ${req.body.state}</p>
          <p>Pincode: ${req.body.pincode}</p>
          <p>Country: ${req.body.country}</p>
          <p>Highest Level of Education: ${req.body.level}</p>
          <p>Year of Graduation: ${req.body.year}</p>
          <p>University Name: ${req.body.uname}</p>
          <p>Marks in CGPA/%: ${req.body.marks}</p>
          <p>Additional: ${req.body.additional}</p>
          <p>How were you referred to us?: ${req.body.check}</p>
          <p>What is your motivation for applying as a mentor: ${req.body.motivation}</p>
        ` 
    };

    // If an attachment was uploaded, add it to the email data
    if (req.files && req.files.length > 0) {
        mailOptions.attachments = req.files.map(file => ({
        filename: file.originalname,
        content: file.buffer
        }));
    }
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent');
          }
    });
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
app.listen(3000,()=>{
  console.log('server running at port 3000');
})