const express = require("express"),
	  app = express(),
	  mongoose = require("mongoose"),
	  bodyParser = require('body-parser');

const chatbotAPI = require("./routes/api/chatbot.js");
const executiveAPI = require("./routes/api/executive.js");

// Body Parser middleware to parse request
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()) // if there's a json object in request, it'll populate it

// Connecting to database
// const db = require('./config/keys.js').mongoURI;
// mongoose.connect(db,{useNewUrlParser:true})
// 		.then(()=> console.log("Connected to database"))
// 		.catch((err)=>console.log(err));

// Home
app.get('/',(req,res)=>{
	res.send("You reached Home!");
})

// Use Routes, instead of using app.get()
app.use('/api',chatbotAPI);
app.use('/api',executiveAPI);

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

app.listen(port,ip,()=>{
	console.log(`Server running on port ${port} and ip ${ip}`);
})