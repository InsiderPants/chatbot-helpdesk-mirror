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
	visitCounter:{
		type: Number,
		required: true
	}
	chatbotResolvedCounter:{
		type: Number,
		required: true
	}
	executiveResolvedCounter:{
		type: Number,
		required: true
	}
})

var customerDB = mongoose.model("customers",customerSchema)

module.exports = customerDB