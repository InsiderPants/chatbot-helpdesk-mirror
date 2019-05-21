/*
    *Main Server
*/
const express = require("express"),
	  app = express(),
	  server = require('http').Server(app),
	  mongoose = require("mongoose"),
	  passport = require('passport'),
	  io = require('socket.io')(server),
	  bodyParser = require('body-parser'),
	  path = require('path'),
	  setupPipeline = require("./pipeline/setupPipeline");

// Body Parser middleware to parse request
app.use(bodyParser.urlencoded({extended:false}));
// If there's a json object in request, it'll populate it
app.use(bodyParser.json())
/*
	*Executive authentication
*/
// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./utils/validateApiRequestExe')(passport);
/*
	*Static serving with express
*/
// Serve this directory for `domain.xx/executive`
app.use('/executive', express.static(path.join(__dirname, 'client/executive/build')));
// Serve this directory for rest
app.use(express.static(path.join(__dirname, 'client/customer/build')));
/*
	*Database
*/
const db = require('./config/keys.js').mongoURI;
// In case of debugging
// mongoose.set('debug',true)
mongoose.connect(db,{useNewUrlParser:true})
		.then(()=> console.log("SERVER: Connected to database in server.js"))
		.catch((err)=>console.log("SERVER: Error connecting with mongodb in server.js"));
/*
	*Setup NLP and Sentiment engine pipeline only once when server starts
	and use pipeline for inference only
*/
setupPipeline()
	.then(pipeline=>{
		console.log('SERVER: Pipeline loaded');

		// Required APIs
		const chatbotAPI = require("./routes/api/chatbot.js")(app,pipeline);
		const executiveAPI = require("./routes/api/executive.js")(app, io);
		// Auth APIs
		const login = require("./routes/userAuth/login.js");
		const signup = require("./routes/userAuth/signup.js");

		// Load executive react app for any `/executive/*` get route
		app.get('/executive/*', (req, res) => {
			res.sendFile(path.join(__dirname, 'client/executive/build', 'index.html'))
		})
		// The "catchall" handler: for any request that doesn't
		// match one above, send back Customer React's index.html file.
		app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, 'client/customer/build', 'index.html'))
		})

		// Chatbot API
		chatbotAPI
		// Executive API
		executiveAPI;

		// Auth routes
		app.use('/auth', login);
		app.use('/auth', signup);

		// For any unexpected post route
		app.post('*',(req,res)=>{
			res.status(404).send("Page Not Found");
		})

		const port = process.env.PORT || "8000";
		const ip = process.env.IP;
		// Start server
		server.listen(port,ip,()=>{
			console.log(`SERVER: Server running on port ${port} and ip ${ip}`);
		})
	})
	.catch(err=>{
		throw new Error("SERVER: Error loading pipeline. Cannot start server in server.js");
	})