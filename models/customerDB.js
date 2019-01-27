const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

// Create Schema
const customerSchema = new Schema({
	name:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	contact:{
		type: String,
		required: true
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
		type:[{mtag:{type: String}, message: {typpe:String}}]
	}
})

var customerDB = mongoose.model("customers",  customerSchema)
module.exports = customerDB