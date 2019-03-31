const setupPipeline = require("./setupPipeline"),
	  findResponse =  require('./findResponse');

var pipeline = setupPipeline()

console.log(pipeline)

findResponse('deep learning, ian!',pipeline)
	.then(res=>console.log(res))
	.catch(err=>console.log(err));