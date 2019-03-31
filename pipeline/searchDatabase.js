/*
    *Module for finding actions from database using intents
*/
const mongoose = require("mongoose"),
	  intentsDB = require("../models/intentsDB.js");

async function searchDatabase(resultObject){
	// Info about Database
	var info = await intentsDB.collection.stats().catch(err=>console.log('intents database not found'));
	// Number of documents in Database
	var databaseSize = info["count"];
	for(i=0;i<databaseSize;i++){
		pairs = await intentsDB.find().skip(i).limit(1);
		pair = await pairs[0];
		if(resultObject['intent']===pair['intent']){
			resultObject['reply']=pair['reply'];
			resultObject['actions']=pair['actions'];
			break;
		}
	}
	return resultObject;
}

module.exports = searchDatabase;