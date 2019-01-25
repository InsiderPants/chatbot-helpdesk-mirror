const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

// Create Schema
const faqSchema = new Schema({
	query:{
		type: Array,
		required: true
	},
	resolution:{
		type: Array,
		required: true
	}
})

var faqDB = mongoose.model("faq",faqSchema)

module.exports = faqDB