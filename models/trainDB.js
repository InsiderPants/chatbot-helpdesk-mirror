const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

// Create Schema
const trainDBSchema = new Schema({
	isTrainedOn:{
		type: Boolean,
		required: true,
		default: false,
	},
	examples:{
		type: Array,
		required: true
	},
	entity_synonyms:{
		type: Array,
		required: true
	}
})

var trainDB = mongoose.model("intenttoactions",trainDBSchema)

module.exports = trainDB