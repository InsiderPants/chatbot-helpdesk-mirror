const mongoose = require("mongoose"),
	  faqDB = require("../models/faqDB.js"),
	  ordinaryDB = require("../models/ordinaryDB.js");

function findBestMatch(queryDB,queryCust){
	var matched = 0;
	for(j=0;j<queryCust.length;j++){
		for(k=0;k<queryDB.length;k++){
			if(queryCust[j]===queryDB[k]){
				matched = matched+1;
				break;
			}
		}
	}
	return matched/queryCust.length
}

async function findResponse(customerQuery){
	// Search in FAQ database for faster resolution of query
	var info = await faqDB.collection.stats()
	var databaseSize = info["count"]
	var response = customerQuery
	var score = 0
	var maxScore = 0
	for(i=0;i<databaseSize;i++){
		pairs = await faqDB.find().skip(i).limit(1);
		pair = await pairs[0];
		score = await findBestMatch(pair.query,customerQuery)
		if(score>maxScore){
			maxScore = score
			response = pair.resolution;
		}
	}
	var threshold = 0.2
	if(maxScore>=threshold){
		return await response;
	}

	// Search in ordinary database if not found in FAQ DB
	info = await ordinaryDB.collection.stats()
	databaseSize = info["count"]
	response = customerQuery
	score = 0
	maxScore = 0
	for(i=0;i<databaseSize;i++){
		pairs = await ordinaryDB.find().skip(i).limit(1);
		pair = await pairs[0];
		score = await findBestMatch(pair.query,customerQuery)
		if(score>maxScore){
			maxScore = score
			response = pair.resolution;
		}
	}
	if(maxScore<threshold){
		response = ["Sorry no match found for your query. Would you like to talk to a human or start a new query?"]
	}

	return await response;
}

module.exports = findResponse;