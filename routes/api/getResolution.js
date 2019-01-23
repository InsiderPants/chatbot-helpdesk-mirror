const express = require("express"),
	  router = express.Router();

// @route  : POST /api/getResolution
// @desc   : receive query from user and send reply
// @access : public route
router.post("/getResolution",(req,res)=>{
	// take data from request
	console.log(req.body);
	// preprocess it
	
	// run algo and rest of the stuff
	
	// return results object
	results = {
		reply: "Hey you wanna go out tonight or what??"
	}
	console.log(results)
	res.send(results)
})

// router.get('/exampleChats', (req, res) => {
// 	res.json()
// });

module.exports = router