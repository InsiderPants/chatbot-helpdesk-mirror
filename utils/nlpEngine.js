var natural = require('natural');

function nlpEngine(customerQuery){
	var tokenizer = new natural.WordTokenizer();
	customerQuery = tokenizer.tokenize(customerQuery)
	return customerQuery
}

module.exports = nlpEngine;