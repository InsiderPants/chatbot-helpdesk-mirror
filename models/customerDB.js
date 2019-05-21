const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

// Create Schema
const customerSchema = new Schema({
	name:{
		type: String,
		required: 'Name is required'
	},
	email:{
		type: String,
		required: 'Email is required'
	},
	contact:{
		type: String,
		required: 'Contact is required'
	},
	visitCounter:{
		type: Number,
		default: 0
	},
	chatbotResolvedCounter:{
		type: Number,
		default: 0
	},
	executiveResolvedCounter:{
		type: Number,
		default: 0
	},
	conversation: {
		type:[{mtag:{type: String}, message: {type:String}}]
	}
})

var customerDB = mongoose.model("customers",  customerSchema)
module.exports = customerDB