const setupPipeline = require("./setupPipeline");
	  findResponse =  require('./findResponse');

setupPipeline()
	.then(pipeline=>{
		console.log(pipeline)
		// findResponse('deep learning, ian!',pipeline)
		// 	.then(res=>console.log(res))
		// 	.catch(err=>{
		// 		// console.log(err)
		// 		console.log("Error finding response")
		// 	});
	})
	.catch(err=>{
		// console.log(err)
		console.log("Error setting up pipeline")
	})