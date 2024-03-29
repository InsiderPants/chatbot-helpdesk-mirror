/*
	*API for customer to get resolution using chatbot
*/
const findResponse = require("../../pipeline/findResponse.js"),
	  Customer = require('../../models/customerDB.js'),
	  validateApiRequest = require('../../utils/validateApiRequest.js');

const {
	SERVER_ERROR, UNKNOWN_ERROR
} = require('../../utils/messages').error;

const {
	ACCESS_VALIDATED
} = require('../../utils/messages').success;

module.exports = (app,pipeline) => {
	/*
	*route  : POST /api/chatbotGetResolution
	*desc   : receive query from *customer* and send reply using chatbot engine
	*access : private route
	*/
	app.post("/api/chatbotGetResolution", validateApiRequest, (req,res)=>{
		// Take data from request
		let email = req.body.email,
			query = req.body.message;
		// Find & Return response
		findResponse(query,pipeline)
			.then(response=>{
				// Save chat in conversation array
				Customer.findOne({'email': email}, function(error, customer){
			        if(error){
			            res.json({
			                success: false,
			                message: SERVER_ERROR
			            });
			        }
			        else{
			        	if(customer==null){
			        		console.log("SERVER: Customer not found with email : ",email)
			        		res.json({
			        			success: false,
			        			message: SERVER_ERROR
			                });
			        	}
			        	else{
				        	prevConversation = customer.conversation
				        	newConvoClient = {mtag:'CLIENT', message:query}
				        	newConvoServer = {mtag:'SERVER', message:response['reply']}
				            customer.set({conversation:[...prevConversation,newConvoClient,newConvoServer]})
			                customer.save(function(err,_){
			                    if(error){
			                        res.json({
			                            success: false,
			                            message: SERVER_ERROR
			                        });
			                    }else{
			                    	// Log response(testing)
			                    	console.log("SERVER: Resonse object : ",response)
			                        // Send response to client
			                        res.status(200).json({
										success: true,
										message: ACCESS_VALIDATED,
										response: response
									})
			                    }
			                })
			            }
			        }
			    });
			})
			.catch(err=>{
				console.log(err)
				console.log('SERVER: Error in findResponse')
				res.send({reply:UNKNOWN_ERROR})
			})
	})
}