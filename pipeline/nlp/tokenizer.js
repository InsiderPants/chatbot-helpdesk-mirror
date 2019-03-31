/*
	*Module for tokenizing sentence
*/
const natural = require('natural');

function tokenizer(){
	var tokenizer = new natural.WordTokenizer();
	return tokenizer
}

module.exports = tokenizer;