const mongoose = require("mongoose"),
	  ordinaryDB = require("../models/ordinaryDB.js"),
	  faqDB = require("../models/faqDB.js");

var Data = [
		{query:['hi','hello','hey','hola'],resolution:['Hi there! What can I do for you']},
		{query:['how','are','you'],resolution:['Chilling... you?']},
		{query:['talk','human','executive','staff'],resolution:['Sure! Connecting you to executive...']},
		{query:['yes','sure','okay','please'],resolution:['Okay, right away!']}	
	]

async function createDatabase(){
	for(i=0;i<Data.length;i++){
		dataObj = Data[i];
		await ordinaryDB.create(dataObj)
			.then(obj=>console.log('--query-response pair added--\n',obj))
			.catch(err=>console.log("--err--\n",err));
		await faqDB.create(dataObj)
			.then(obj=>console.log('--query-response pair added--\n',obj))
			.catch(err=>console.log("--err--\n",err));
	}
}

// Connecting to database
const db = require('../config/keys.js').mongoURI;
mongoose.connect(db,{useNewUrlParser:true})
		.then(()=> {
			console.log("Connected to database");
			createDatabase();
		})
		.catch((err)=>console.log(err));