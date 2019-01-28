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
	if(maxScore===0)
		response = ["Sorry no match found for your query. Would you like to talk to a human or start a new query?"]

	return await response;
}

// ---TESTING---
// Connecting to database
// const db = require('../config/keys.js').mongoURI;
// mongoose.connect(db,{useNewUrlParser:true})
// 		.then(async function(){
// 			console.log("Connected to database");
// 			response = await findResponse(['hey','hello']);
// 			console.log(response);
// 		})
// 		.catch((err)=>console.log(err));

module.exports = findResponse;