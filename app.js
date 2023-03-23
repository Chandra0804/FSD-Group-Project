const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const app = express()
const bodyparser = require("body-parser")

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

app.get('/signin-signup', (req, res) => {
    res.render('Login_SignUp')
})

app.get('/contactus', (req, res) => {
    res.render('contact_us')
})

app.get('/signin-signup/mentorApplication', (req, res) => {
    res.render('mentorApplication')
})

app.get('/signin-signup/createroom', (req, res) => {
    res.render('createroom')
})

app.get('/about', (req, res) => {
    res.render('AboutUs')
})

app.get('/signin-signup/index', (req, res) => {
    res.redirect('/')
})

app.get('/signin-signup/premium', (req, res) => {
    res.render('premium')
})

app.get('/logout', (req, res) => {
    userName = null;
    res.redirect('/'); 
  });


const db_name = path.join(__dirname, "data", "LearnenApp.db");
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.log(err.message);
    }
    console.log("Database connected")
});

const ctusertable = `CREATE TABLE IF NOT EXISTS users(
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);`

db.run(ctusertable, err => {
    if (err) {
        return console.log(err.message);
    }
    console.log("Table Created")
});


app.post('/signin-signup/login', (req, res) => {
    const email = req.body.logemail;
    const password = req.body.logpass;

    // if (email === '') {
    //     res.status(401).json({ error: 'Please enter your email address' });
    // } else if (password === '') {
    //     res.status(401).json({ error: 'Please enter your password' });
    // } else {

    db.get(`
        SELECT * FROM users
        WHERE email = ? AND password = ?
    `, [email, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(401).send('Internal server error');
        } else if (!row) {
            res.status(401).send('Invalid email or password');
        } else {
            userName = row.name;
            res.render('dashboard_page', { user: row.name });
        }
    });
    // }
});

app.get('/signin-signup/room', (req, res) => {
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
        res.redirect('/signin-signup');
    }
})

app.get('/signin-signup/payment',(req,res)=>{
    res.render('payment');
})

app.get('/paymentstatus',(req,res)=>{
    res.render('paymentstatus');
})

app.post('/signin-signup/signup', (req, res) => {
    const username = req.body.signupname;
    const email = req.body.signupemail;
    const password = req.body.signuppass;
    // const confirmPassword = req.body.signuppass2;

    // const passwordRegex = /^(?=.*[!@#$%^&*])/;

    // check if input fields are filled out
    // if (username === '') {
    //     res.status(401).send('Please enter your name');
    // }
    // else if (email === '') {
    //     res.status(401).send('Please enter your email address');
    // }
    // else if (!validateEmail(email)) {
    //     res.status(401).send('Please enter a valid email address');
    // }
    // else if (password === '') {
    //     res.status(401).send('Please enter your password');
    // }
    // else if (password.length < 8) {
    //     res.status(401).send('Password should be atleast 8 characters long');
    // }
    // else if (!passwordRegex.test(password)) {
    //     res.status(401).send('Password should contain atleast one special character');
    // }
    // else if (confirmPassword === '') {
    //     res.status(401).send('Please confirm your password');
    // }
    // else if (password !== confirmPassword) {
    //     res.status(401).send('Passwords do not match');
    // }
    // else {
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [username, email, password], function (err) {
        if (err) {
        }
        res.redirect('/signin-signup')
    });
    // }
});

// function validateEmail(email) {
//     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }

app.listen(3000)