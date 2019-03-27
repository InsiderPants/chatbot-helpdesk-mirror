const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

// Create Schema
const intentToActionDBSchema = new Schema({
	intent:{
		type: String,
		required: true
	},
	reply:{
		type: Array,
		required: true
	},
	actions:{
		type: Array,
		required: true
	}
})

var intentToActionDB = mongoose.model("intenttoactions",intentToActionDBSchema)

module.exports = intentToActionDB