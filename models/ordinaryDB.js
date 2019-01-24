const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

// Create Schema
const OrdinarySchema = new Schema({
	query:{
		type: Array,
		required: true
	},
	resolution:{
		type: Array,
		required: true
	}
})

var ordinaryDB = mongoose.model("ordinary",OrdinarySchema)

module.exports = ordinaryDB