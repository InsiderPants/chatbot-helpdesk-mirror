const natural = require('natural');

function tokenizer(query){
	var tokenizer = new natural.WordTokenizer();
	tokens = tokenizer.tokenize(query)
	return tokens
}

module.exports = tokenizer;