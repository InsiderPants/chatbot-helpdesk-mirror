/*
    *Main Server
*/
const express = require("express"),
	  app = express(),
	  server = require('http').Server(app),
	  mongoose = require("mongoose"),
	  io = require('socket.io')(server);
	  bodyParser = require('body-parser');

// Body Parser middleware to parse request
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()) // if there's a json object in request, it'll populate it

// Connecting to database
const db = require('./config/keys.js').mongoURI;
mongoose.connect(db,{useNewUrlParser:true})
		.then(()=> console.log("Connected to database"))
		.catch((err)=>console.log("Error connecting with mongodb"));

// Required APIs
const chatbotAPI = require("./routes/api/chatbot.js")(app);
const executiveAPI = require("./routes/api/executive.js")(app, io);

const login = require("./routes/userAuth/login.js");
const signup = require("./routes/userAuth/signup.js");

// Home
app.get('/',(req,res)=>{
	res.send("You've reached Server Home!");
})

// Chatbot API
chatbotAPI
// Executive API
executiveAPI;

// auth routes
app.use('/auth', login);
app.use('/auth', signup);

// For any unexpected get route
app.get('*',(req,res)=>{
	res.status(404).send("Page Not Found");
})
// For any unexpected post rout
app.post('*',(req,res)=>{
	res.status(404).send("Page Not Found");
})

const port = process.env.PORT || "8000";
const ip = process.env.IP;

server.listen(port,ip,()=>{
	console.log(`Server running on port ${port} and ip ${ip}`);
})