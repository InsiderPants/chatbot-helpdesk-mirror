const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

// Create Schema
const executiveSchema = new Schema({
	name:{
		type: String,
		required: 'Name is required'
	},
	email:{
		type: String,
		required: 'Email is required'
	},
	password:{
		type: String,
		required: 'Password is required'
	},
	contact:{
		type: String,
		required: 'Contact is required'
	},
	customerHandledCounter:{
		type: Number,
		default: 0
	},
	conversation: {
		type:[{mtag:{type: String}, message: {type:String}}]
	}
})

var executiveDB = mongoose.model("executives",  executiveSchema)
module.exports = executiveDB