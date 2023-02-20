
const express=require("express")
const mysql=require("mysql")
const path=require("path")
const dotenv=require("dotenv")
const multer = require("multer")
const storage= multer.diskStorage({
  destination: (req, file,cb) => {
    cb(null, 'Images')
  },
  filename: (req,file,cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({storage: storage })

const app=express();
const bodyParser=require("body-parser");
const connection=mysql.createConnection({
  host:"localhost",
  port:3306,
  database:"user_signin",
  password:"LOCALHOST@12",
  user:"Users"
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//on the signup page
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"signup.html"));
})

//getting user input from sign up page
app.post("/signup",(req,res)=>{
 
var email=req.body.email
var password=req.body.password
var username = req.body.username
var firstname = req.body.firstname
var lastname = req.body.lastname
var age = req.body.age
var gender = req.body.gender
var image= req.body.image
//storing them in the database and going to login page
connection.query('INSERT INTO user_db (email,password,username,firstname,lastname,age,gender,image) values(?,?,?,?,?,?,?,?)',[email,password,username,firstname,lastname,age,gender,image],(error)=>{
    if (error) {
        console.error(error)
        res.status(500).send('You arleady have an account')
        return
    }
    res.sendFile(path.join(__dirname,"login.html"));
})
 })


 //getting the loginpage
 app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname,"login.html"));
})
//get input from login page
 app.post("/login",(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;
 
    console.log(email,password)


    //compare them with the data in database
    connection.query('SELECT * FROM user_db where email= ? and password= ?',[email,password],(err,result)=>{
        if(err){
          console.error(err);
          res.status(500).send('An error occurred, please try again later.');
          return;
        }
       else if(result.length > 0){
        console.log(result);
          for(i=0; i<result.length; i++){
            
            if(result[i].email === email && result[i].password === password){
              res.redirect("/welcome");
              console.log(result[i].email)
            }
          }
        } else {
            res.write("not exist")
          res.sendFile(path.join(__dirname,"./login.html"));
        }
      });
          
       //after loging in page to update data
    })
    app.get('/welcome',(req,res) => {
      res.sendFile(path.join(__dirname,"./update.html"))
     })
app.post("/welcome",(req,res)=>{
   let usernewname=req.body.username
  let username=req.body.username
  let email=req.body.email;
  let password=req.body.password;
  console.log(email,password)
     
     connection.query(`UPDATE user_db SET email="${email}",password="${password}"  WHERE username="${username}"`)
     res.sendFile(path.join(__dirname,"login.html"));
         })
     
     
//delleting account
    app.get("/delete",(req,res)=>{
        res.sendFile(path.join(__dirname,"/dashboard.html"))
    })
app.post('/delete',(req,res)=>{
  let username=req.body.usernam
  connection.query( `DELETE FROM user_db WHERE username="${username}"`)
  res.redirect("/afterDeletion")
})
app.get('/afterDeletion',(req,res)=>{
  res.sendFile(path.join(__dirname,"/delete.html"))
})
//back to sign up page after deleting
app.post("/afterDeletion",(req,res)=>{
  res.sendFile(path.join(__dirname,"./signup.html"))
})



app.listen(9000,()=>{
    console.log("server is listening on 9000");
})



