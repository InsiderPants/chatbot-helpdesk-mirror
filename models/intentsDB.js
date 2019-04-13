const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;
/*
	{
	intent: "bar_search",
	examples: [{
		"text":"bar near delhi",
		"entities":[{
				"start": 9,
				"end": 14,
				"value": "delhi",
				"entity": "place"
			},{},...etc]
		},{},...etc],
	reply: ["Sure! One moment please...","Here are some results I found:",...etc],
	actions: ["search",...etc]

	}
*/
// Create Schema
const intentsDBSchema = new Schema({
	intent:{
		type: String,
		required: true
	},
	examples:{
		type: Array,
		required: true
	},
	reply:{
		type: Array,
		required: true
	},
	actions:{
		type: Array,
		required: true
	},
	isTrained:{
		type: Boolean,
		default: false
	}
})

var intentsDB = mongoose.model("intents",intentsDBSchema)

module.exports = intentsDB