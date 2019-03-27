/*
    *Module for finding actions from database using intents
*/
const mongoose = require("mongoose"),
	  intentToActionDB = require("../models/intentToActionDB.js");

async function searchDatabase(resultObject){
	// Info about Database
	var info = await intentToActionDB.collection.stats().catch(err=>console.log('intentToAction Database not found'));
	// Number of documents in Database
	var databaseSize = info["count"];
	console.log('here')
	for(i=0;i<databaseSize;i++){
		pairs = await intentToActionDB.find().skip(i).limit(1);
		pair = await pairs[0];
		if(resultObject['intent']===pair['intent']){
			resultObject['reply']=[];
			resultObject['actions']=[];
		}
	}
	return resultObject;
}

module.exports = searchDatabase;