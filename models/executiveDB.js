const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

// Create Schema
const executiveSchema = new Schema({
	name:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	contact:{
		type: String,
		required: true
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