const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
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

app.get('/signin-signup',(req,res)=>{
    res.render('Login_SignUp')
})

app.get('/room',(req,res)=>{
    res.render('RoomViewPage' , {participantNames : participantNames , assignmentName : assignmentName , assignmentPosted : assignmentPosted , taskslists : taskslists , userName : userName})
})

app.get('/mentorApplication',(req,res)=>{
    res.render('mentorApplication')
})

const db_name = path.join(__dirname, "data", "LearnenApp.db");
const db = new sqlite3.Database(db_name, err =>{
   if(err){
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

db.run(ctusertable, err =>{
    if(err){
        return console.log(err.message);
    }
    console.log("Table Created")
 });

 app.post('/signin-signup/login', (req, res) => {
    const email = req.body.logemail;
    const password = req.body.logpass;

    db.get(`
        SELECT * FROM users
        WHERE email = ? AND password = ?
    `, [email, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal server error');
        } else if (!row) {
            res.status(401).send('Invalid email or password');
        } else {
            res.send(`Welcome ${row.name}`);
        }
    });
});

app.post('/signin-signup/signup', (req, res) => {
    const username = req.body.signupname;
    const email = req.body.signupemail;
    const password = req.body.signuppass;  
        db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [username, email, password], function(err) {
          if (err) {
            return res.status(500).send(err.message);
          }
          res.redirect('/signin-signup')
        });
});


app.listen(3000)