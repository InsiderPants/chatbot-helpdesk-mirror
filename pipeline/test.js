const setupPipeline = require("./setupPipeline"),
	  mongoose = require("mongoose"),
	  findResponse =  require('./findResponse');

setupPipeline()
	.then(pipeline=>{
		// console.log(pipeline)
		// Connecting to database
		const db = require('../config/keys.js').mongoURI;
		mongoose.connect(db,{useNewUrlParser:true})
				.then(()=> console.log("Connected to database"))
				.catch((err)=>console.log("Error connecting with mongodb"));
		findResponse('deep learning, ian!',pipeline)
			.then(res=>console.log('response : ',res))
			.catch(err=>{
				// console.log(err)
				console.log("SERVER: Error finding response")
			});
	})
	.catch(err=>{
		// console.log(err)
		console.log("SERVER: Error setting up pipeline")
	})

// const feat = require('./nlp/featurizer.js');

// feat(train=true)
// 	.then(res=>{
// 		console.log('resolved');
// 	})
// 	.catch(err=>console.log(err))