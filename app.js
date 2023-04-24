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
const { log } = require('console')
const { redirect } = require('express/lib/response')

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
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

// sessions 
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/', (req, res) => {
    if (req.session && req.session.user){
        return res.redirect('/dashboard')
    }
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('Login')
})
app.get('/signup', (req, res) => {
    res.render('SignUp');
})

app.get('/contactus', (req, res) => {
    res.render('contact_us')
})
app.get('/mentorApplication', (req, res) => {
    res.render('mentorApplication')
})

app.get('/createroom', (req, res) => {
    res.render('CreateRoom', { user: req.session.user });
})

app.get('/about', (req, res) => {
    res.render('AboutUs')
})

app.get('/login/forgot', (req, res) => {
    res.render('Forgot_Password');

})

app.get('/login/forgot/change', (req, res) => {
    res.render('Change_Password');
})

app.get('/login/index', (req, res) => {
    res.redirect('/')
})

app.get('/dashboard/premium', (req, res) => {
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

con.on('open', () => {
    console.log("MongoDB Connected")
    console.log("Table Created")
})

con.on('error', (err) => {
    console.log(err);
})

app.get('/dashboard/joined',requireLogin, async (req, res) => {


    const user = req.session.user;
     const rooms = await Room.find({ participants: user });
    // res.render('dashboard_joined', { user: userName, mentor, admin })
    res.render('dashboard_joined', {
        user,
        rooms,
        myrooms: user.Joined_Room
    });
    


})

// app.get('/dashboard/admin',requireLogin, (req, res) => {
    // con.collection('users').find({}).toArray().then((result) => {
//         res.render('admin_console', { user: result, mentor, admin })
//     }).catch((err) => {
//         throw err;
//     });
// })

app.get('/dashboard/admin',requireLogin, async (req, res) => {

    const user = req.session.user;
    if (user.Position==='admin'){
        const rooms = await Room.find();
    con.collection('users').find({}).toArray().then((result) => {
        res.render('admin_console', { user: result, mentor, admin,rooms })
    }).catch((err) => {
        throw err;
    });
    }
    else{
        res.redirect('/dashboard');
        return
    }
    
})

app.post('/edit/:id', (req, res) => {

    var un = req.params.id;
    var un1 = req.body.signupname;
    var ta = req.body.tags;
    var po = req.body.position;
    var myquery = { userId: un };
    var newvalues = { $set: { userId: un1, Tags: ta, Position: po } };
    con.collection('users').updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
    });
    con.collection('users').find({}).toArray().then((result) => {
        res.render('admin_console', { user: result, mentor, admin })
    }).catch((err) => {
        throw err;
    });
})

// app.post('/delete-room/:id', requireLogin, async (req, res) => {
//     const user = req.session.user;
//     const room = await Room.findById(req.params.id);

//     if (!room || user._id.toString() !== room.mentor._id.toString()) {
//         res.redirect('/dashboard');
//     } else {
//         // Remove room from all participants' joined_rooms array
//         for (const participant of room.participants) {
//             participant.joined_rooms = participant.joined_rooms.filter(
//                 joined_room => joined_room._id.toString() !== room._id.toString()
//             );
//             await participant.save();
//         }
//         user.created_rooms = user.created_rooms.filter(
//             created_room => created_room._id.toString() !== room._id.toString()
//         );
//         await user.save();

//         // Delete the room
//         await Room.findByIdAndDelete(room._id);

//         res.redirect('/dashboard');
//     }
// });

app.get('/delete-room/:id', requireLogin, async (req, res) => {
    const user = req.session.user;
    const room = await Room.findById(req.params.id).populate('mentor');
    
    if (!room) {
      res.redirect('/dashboard');
    } else {
      // Check if user is the mentor of the room
      if (room.mentor._id.toString() !== user._id.toString()) {
        res.redirect(`/room/${room._id}`);
        return;
      }
      
      // Remove the room from the Joined_Room array of all participants
      await User.updateMany({ Joined_Room: room._id }, { $pull: { Joined_Room: room._id } });
      
      // Delete the room and its associated assignments and resources
      await Assignment.deleteMany({ _id: { $in: room.assignments } });
      await Resource.deleteMany({ _id: { $in: room.resources } });
      await room.remove();
      
      res.redirect('/dashboard');
    }
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

app.post('/forgotpassword', async (req, res) => {
    const email = req.body.email;
    emailCheck = email;
    const user = await con.collection('users').findOne({ Email: email });
    res.render('Security_Question', { sec_ques: user.Security_Question });
})


app.post('/changePW', async (req, res) => {
    const email = emailCheck;
    const user = await con.collection('users').findOne({ Email: email });
    const answer = req.body.sec_ans;
    if (user) {
        const answerCheck = answer === user.Security_Answer;
        if (answerCheck) {
            res.render('Change_Password');
        }
        else {
            res.status(404).send("Wrong Answer");
        }
    }
    else {
        res.status(401).send("User Not Found");
    }

});

app.post('/changepassword', (req, res) => {
    const { newPassword, confirmPW } = req.body;
    const users = con.collection('users');
    const email = emailCheck;
    // Find the user with the given email
    return users.findOne({ Email: email })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            if (newPassword != confirmPW) {
                return res.send('Please match the Confirm Password');
            }

            // Update the user's password in the database
            return users.updateOne({ Email: email }, { $set: { Password: newPassword } })
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

// app.get('/room/:id', requireLogin, async (req, res) => {
//     const user = req.session.user;
//     const room = await Room.findById(req.params.id);
//     const usertable = await User.find({});

//     if (!room) {
//         res.redirect('/dashboard');
//     } else {
//         const isParticipant = room.participants.some(
//             participant => participant._id.toString() === user._id.toString()
//         );
//         const isMentor = user._id.toString() === room.mentor._id.toString();
        
        
        
//         // let list = [];
//         // room.participants.forEach(participant => {
//         //     const value = await User.findById(participant.user);
//         //     console.log(value);
//         //     // console.log(await usertable.findById(participant.user));
//         // });
//         res.render('Room', { user, room, isParticipant, isMentor ,participantList: participantNames});
//     }
// });

app.get('/room/:id', requireLogin, async (req, res) => {
    const user = req.session.user;
    const room = await Room.findById(req.params.id);
    const usertable = await User.find({});

    if (!room) {
        res.redirect('/dashboard');
    } else {
        const isParticipant = room.participants.some(
            participant => participant._id.toString() === user._id.toString()
        );
        const isMentor = user._id.toString() === room.mentor._id.toString();
        
        let list = []
        let assignmentlist = []
        let resourcelist = []
        var populateList = new Promise((resolve, reject) => {
            room.participants.forEach(async (participant, index, array) => {
                const value = await User.findById(participant.user);
                list.push(value.userId);
                if(index === array.length-1) resolve()
            });
        });
        
        var populateassignmentlist = new Promise((resolve, reject) => {
            console.log("assignmentin");
            room.assignments.forEach(async (assignment,index,array)=>{
                const value = await Assignment.findById(assignment);
                assignmentlist.push(value);
                if(index === array.length-1) resolve()
            })
        });

        
        var populateresourcelist = new Promise((resolve, reject) => {
            console.log("resourcein");
            room.resources.forEach(async (resource,index,array)=>{
                const value = await Resource.findById(resource);
                resourcelist.push(value);
                if(index === array.length-1) resolve()
            })
        });

        populateList.then(() => {
            populateassignmentlist.then(()=>{
                populateresourcelist.then(()=>{
                    res.render('Room', { user, room, isParticipant, isMentor ,participantList: list , assignments:assignmentlist,resources:resourcelist});
                })
            })
        })
    }
});

app.post('/submit-assignment/:id', async (req, res) => { 

    const roomID = req.params.id;
    const room = await Room.findOne({_id:roomID});
    let date = new Date();

    const newAssignment = new Assignment({
        Title : req.body.assignment_title,
        Date: date.toLocaleDateString(),
        link : req.body.assignment_link,
    });

    try{
        room.assignments.push(newAssignment);
        console.log('pushed assignment to room');
        await room.save();
    }catch(err){
        console.log(err)
    }

    mongoose.connection.collection('assignments').insertOne(newAssignment,(err, result) => {
        if (err){
          throw err;  
        } 
        console.log("Assignment inserted");
    });
});


// app.post('/submit-resource/:id', async (req, res) => {

//     const roomID = req.params.id;
//     const room = await Room.findOne({_id:roomID});
//     let date = new Date();

//     const newResource = new Resource ({
//         Title: req.body.resource_title,
//         Links: req.body.resource_link,
//         Date: req.body.resource_date,
//     });

//     try{
//         room.resources.push(newResource);
//         console.log('pushed resource to room');

//     }catch(err){
//         console.log(err)
//     }

//     con.collection('resources').insertOne(newResource, (err, result) => {
//         if(err) {
//             throw err;
//         }
//         console.log("Resource uploaded");
//     });
// });

 
app.post('/submit-resource/:id', async (req, res) => {
    const roomID = req.params.id;
    const room = await Room.findOne({_id: roomID});
    let date = new Date();

    console.log('resourcesubmit')

    const newResource = new Resource({
        Title: req.body.resource_title,
        Links: req.body.resource_link,
        Date: date.toLocaleDateString()
    });

    try {
        room.resources.push(newResource);
        console.log('Pushed resource to room');
        await room.save(); // Save the updated room

        con.collection('resources').insertOne(newResource, (err, result) => {
            if(err) {
                throw err;
            }
                console.log("Resource uploaded");
        });



    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding resource');
    }

    res.redirect(`/room/${roomID}`);
});



app.post('/createroom', requireLogin, async (req, res) => {
    const user = req.session.user;
    const { title, description, tags, syllabus } = req.body;

    const newRoom = new Room({

        title: title,
        description: description,
        participants: [{
          user: user,
          notes: []
        }],
        syllabus: "",
        tags: [tags],
        assignments: [], // Add the assignments field
        resources: [], // Add the resources field
        mentor: user
    });

    try {
        user.Created_Room.push(newRoom);

        if (newRoom.participants) {  // check if Participants array exists
            newRoom.participants.push({ user: user, notes: [] });
        } else {
            newRoom.participants = [{ user: user, notes: [] }];
        }

        con.collection('rooms-studies').insertOne(newRoom, err=>{
            if(err) throw err;
            console.log("Room Created");
        })

        // await newRoom.save();
        

        // Log the newly created room to the console
        console.log('New room:', newRoom);

        res.redirect(`/room/${newRoom._id}`);
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

app.post('/search', async (req, res) => {
    try {
      const searchQuery = req.body.search;
      console.log("search"+searchQuery);
      const user = req.session.user;
  
      // Find rooms that match the search query using a case-insensitive regular expression
      const rooms = await Room.find({ title: { $regex: searchQuery, $options: 'i' } });
  
      res.render('dashboard', {
          user,
          rooms,
          myrooms: user.Joined_Room
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });


app.get('/termsconditions', (req, res) => {
    res.render('terms_conditions');
})

app.get('/dashboard',requireLogin, async (req, res) => {

    // if(userName!=null){
    // res.render('dashboard',{user : userName,mentor,admin});
    // }
    // else{
    //     res.redirect('/login');
    // }
        try {
            const user = req.session.user;
            // console.log(user);
            const rooms = await Room.find();
            console.log(rooms);
                //   const rooms = await Room.find({ participants: user }).populate('mentor').populate('participants');
                res.render('dashboard', {
                    user,
                    rooms,
                    myrooms: user.Joined_Room
                });
        } catch (error) {
            console.log(error);
        }
})

app.get('/login/payment', (req, res) => {
    res.render('payment');
})

app.get('/paymentstatus', (req, res) => {
    res.render('paymentstatus');
})

// app.get('/join/:id', requireLogin, async (req, res) => {
//     console.log("join room"+req.params.id)
//     try {
//         const userId = req.session.user._id;
//         const room = await Room.findById(req.params.id);
//         const user = await User.findById(userId);

//         if (!room) {
//             res.redirect('/dashboard');
//             return;
//         }

//         // check if user is already a participant in the room

//         const isParticipant = room.participants.find(participant => new mongoose.Types.ObjectId(String(participant.user)).equals(userId));
//         if (isParticipant) {
//             res.redirect(`/room/${room._id}`);
//             return;
//         }

//         // add user to the Participants list of the room
//         room.Participants.push({ user: userId, notes: [] });
//         await room.save();

//         // add room to the Joined_Room list of the user
//         user.Joined_Room.push(room);
//         await user.save();

//         res.redirect(`/room/${room._id}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });


// app.get('/join/:id', requireLogin, async (req, res) => {
//     console.log('Joining room with ID:', req.params.id);
//     try {
//       const user = req.session.user;
//       const roomId = req.params.id;
  
//       // Find the room and user by their IDs
//       const room = await Room.findById(roomId);
//     //   const user = await User.findById(userId);
//       if (!room) {
//         res.redirect('/dashboard');
//         return;
//       }
  
//       // Check if user is already a participant in the room
//     //   const isParticipant = room.participants.find(participant => participant.user && participant.user.equals(userId));
//     //   if (isParticipant) {
//     //     res.redirect(`/room/${room._id}`);
//     //     return;
//     //   }/

  
//       // Add user to the participants list of the room

//       room.participants = room.participants || [];

//       room.participants.push({ user:user, notes: [] });
//       await room.save();
  
//       // Add room to the joined_rooms list of the user
//       user.Joined_Room.push(room);
//       console.log('hehe');
//       console.log(user);
//       await user.save();
  
//       res.redirect(`/room/${room._id}`);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//     }
//   });
 
// app.get('/join/:id', requireLogin, async (req, res) => {
//     console.log('Joining room with ID:', req.params.id);
//     try {
//       const user = req.session.user;
//       const roomId = req.params.id;
  
//       // Find the room and user by their IDs
//       const room = await Room.findById(roomId);
//     //   const user = await User.findById(userId);
//       if (!room) {
//         res.redirect('/dashboard');
//         return;
//       }
  
//       // Check if user is already a participant in the room
//     //   const isParticipant = room.participants.find(participant => participant.user && participant.user.equals(userId));
//     //   if (isParticipant) {
//     //     res.redirect(`/room/${room._id}`);
//     //     return;
//     //   }/
  
//       // Add user to the participants list of the room
//       room.participants = room.participants || [];
//       room.participants.push({ user: user, notes: [] });
//       await room.save();
  
//       // Add room to the joined_rooms list of the user
//       user.Joined_Room.push(room);
//       console.log('hehe');
//       console.log(user);
  
//       res.redirect(`/room/${room._id}`);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//     }
// });

app.get('/join/:id', requireLogin, async (req, res) => {
    console.log('Joining room with ID:', req.params.id);
    try {
        const userId = req.session.user._id;
        const roomId = req.params.id;

        // Find the room and user by their IDs
        const room = await Room.findById(roomId);
        const user = await User.findById(userId);
        if (!room) {
            res.redirect('/dashboard');
            return;
        }

        // Check if user is already a participant in the room
        const isParticipant = room.participants.find(participant => participant.user && participant.user.equals(userId));
        if (isParticipant) {
            console.log('participant')
            res.redirect(`/room/${room._id}`);
            return;
        }

        // Add user to the participants list of the room
        room.participants = room.participants || [];
        room.participants.push({ user: userId, notes: [] });
        await room.save();

        // Add room to the joined_rooms list of the user
        try{
            user.Joined_Room.push(room);
            await user.save();
        }
        catch(err){
            console.log('error!! join room invalid')
        }
        

        // Update the user's Joined_Room field in the database
        // const collection = con.collection('users');
        // await collection.updateOne({_id: user._id}, {$set: {Joined_Room: user.Joined_Room}});

        res.redirect(`/room/${room._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

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
    console.log("signup")
    //console.log(req.body);
    const username = req.body.signupname;
    const email = req.body.signupemail;
    const password = req.body.signuppass;
    const securityQuestion = req.body.security_question;
    const securityAnswer = req.body.aecurity_answer;

    try {
        const newuser = new User({
            userId: username,
            Email : email,
            Password : password,
            Security_Question : securityQuestion,
            Security_Answer : securityAnswer,
            Joined_Room: [],
            Created_Room: [],
            Position: "student",
            Tags: [],
            Premium: false,
        });
        console.log(newuser);
        await newuser.save();
        req.session.user = newuser;
        res.redirect('/login');
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

// app.get('/leave/:id', requireLogin, async (req, res) => {
//     const user = req.session.user;
//     const room = await Room.findById(req.params.id);

//     if (!room) {
//         res.redirect('/dashboard');
//     } else {
//         // Remove user from participants array
//         room.participants = room.participants.filter(
//             participant => participant._id.toString() !== user._id.toString()
//         );
//         await room.save();
//         // user.Joined_Room = user.Joined_Room.filter(
//         //     jroom => jroom._id.toString() !== room._id.toString()
//         // );
//         console.log('before')

//         try{
//             user.Joined_Room = user.Joined_Room.filter(
//             jroom => jroom._id.toString() != room._id.toString())
//             await user.save();
//             res.redirect('/dashboard');
            
//         }catch(err){
//             console.log('oops')
//         }
        
//     }
// });

app.get('/leave/:id', requireLogin, async (req, res) => {
    try {
      // Get the currently logged in user from the session
    const user = req.session.user;
  
      // Get the room to leave from
      const roomId = req.params.id;
      const room = await Room.findById(roomId);
  
      // if there isnt such a room, then the user will be redirected to the dashboard.
      // useful if room is deleted while the user is still in the room
      if (!room) {
        res.redirect('/dashboard');
      } else if (!room.participants.some(participant => participant.user.equals(user))) {
        res.redirect('/dashboard');
      } else {
        room.participants = room.participants.filter(participant => !participant.user.equals(user));
        await room.save();
  
        user.Joined_Room = user.Joined_Room.filter(joinedRoom => !joinedRoom.equals(roomId));
        await user.save();
  
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
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

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent');
        }
    });
})

app.post('/feedback', (req, res) => {
    const nodemailer = require('nodemailer');

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
        subject: "Feedback from a customer",
        html: `
        <p>Email: ${req.body.email}</p>
        <p>Feedback: ${req.body.message}</p>
    `
    };

    transporter.sendMail(mailOptions, function (error, info) {
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


app.listen(3000, () => {
    console.log('server running at port 3000');
})