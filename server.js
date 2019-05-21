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
	  cluster = require('cluster'),
	  setupPipeline = require("./pipeline/setupPipeline");

// Body Parser middleware to parse request
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()) // if there's a json object in request, it'll populate it

// Connecting to database
const db = require('./config/keys.js').mongoURI;
mongoose.connect(db,{useNewUrlParser:true})
		.then(()=> console.log("SERVER: Connected to database in server.js"))
		.catch((err)=>console.log("SERVER: Error connecting with mongodb in server.js"));

// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./utils/validateApiRequestExe')(passport);

app.use('/executive', express.static(path.join(__dirname, 'client/executive/build')));
app.use(express.static(path.join(__dirname, 'client/customer/build')));

// node clusters
cluster.schedulingPolicy = cluster.SCHED_RR;

if (cluster.isMaster) {
	var cpuCount = require('os').cpus().length;
	for (var i = 0; i < cpuCount; i += 1) {
		cluster.fork();
	}
}
else {
	// setup nlp and sentiment engine pipeline only once, when server starts
	// and use pipeline for inference only
	setupPipeline()
		.then(pipeline => {
			console.log('SERVER: Pipeline loaded');
			// console.log(pipeline)
			// Required APIs
			const chatbotAPI = require("./routes/api/chatbot.js")(app, pipeline);
			const executiveAPI = require("./routes/api/executive.js")(app, io);

			const login = require("./routes/userAuth/login.js");
			const signup = require("./routes/userAuth/signup.js");

			// Home
			// app.get('/',(req,res)=>{
			// 	res.send('HELLO')
			// })
			app.get('/executive/*', (req, res) => {
				res.sendFile(path.join(__dirname, 'client/executive/build', 'index.html'))
			})

			app.get('*', (req, res) => {
				res.sendFile(path.join(__dirname, 'client/customer/build', 'index.html'))
			})


			// Chatbot API
			chatbotAPI
			// Executive API
			executiveAPI;

			// auth routes
			app.use('/auth', login);
			app.use('/auth', signup);

			// For any unexpected get route
			// app.get('*',(req,res)=>{
			// 	res.status(404).send("Page Not Found");
			// })
			// For any unexpected post route
			app.post('*', (req, res) => {
				res.status(404).send("Page Not Found");
			})

			const port = process.env.PORT || "8000";
			const ip = process.env.IP;

			server.listen(port, ip, () => {
				console.log(`SERVER: Server running on port ${port} and ip ${ip}`);
			})
		})
		.catch(err => {
			throw new Error("SERVER: Error loading pipeline. Cannot start server in server.js");
		})
}

cluster.on('fork', function (worker) {
	console.log('forked -> Worker %d', worker.id);
});

