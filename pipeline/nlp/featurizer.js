/*
	*Module for generating features
*/

const fs = require('fs'),
	  mongoose = require("mongoose"),
	  intentsDB = require("../../models/intentsDB.js"),
	  natural = require('natural');

function getTokenizer(){
	// To cleaned text from  punctuations, stop words etc and normalize(lowercase) it
	var tokenizer = new natural.WordTokenizer();
	return tokenizer
}

class Vectorizer{
	constructor(num_words=null,oov_token='<unknown>'){
		this.isTrained = false;
		// A dictionary of words and their uniquely assigned integers.
		this.vocab = {};
		// the maximum number of words to keep, based on word frequency. 
		// Only the most common `num_words-1` words will be kept.
        this.num_words = num_words
        // if given, it will be added to vocab and used to 
        // replace out-of-vocabulary(oov) words during "transform" calls
        this.oov_token = oov_token
        this.tokenizer = getTokenizer()
        this.vocab[this.oov_token] = 1
		this.vocabLength = 1;
	}
	fit(corpus){
		// corpus = [text,text,...]
		if(corpus===undefined | corpus === null | corpus.length==0)
			throw new Error('Invalid corpus')
		if(this.isTrained)
			console.log("Warning: The featurizer model is already fitted on a data. Overwriting previous data");
		this.buildVocab(corpus);
		this.isTrained = true;
		console.log('Featurizer Model trained successfully')
		return this
	}
	buildVocab(corpus){
		// corpus = [text,text,...]
		// A dictionary of words and their counts.
		let word_counts = {}, arr = [], tokens;
		for(let text of corpus){
			tokens = this.tokenizer.tokenize(text)
			for(let token of tokens){
				if(token in word_counts)
					word_counts[token] = word_counts[token]+1
				else
					word_counts[token] = 1
			}
		}
		for(let key in word_counts)
			arr.push({'key':key,'value':word_counts[key]})
		arr.sort(function(a, b) { return b.value-a.value; });
		for(let e of arr){
			if(e.key in this.vocab)
				continue
			this.vocabLength = this.vocabLength+1;
			this.vocab[e.key] = this.vocabLength;
		}
	}
	transform(corpus){
		// corpus = [text,text,...]
		// Transforms each text in corpus to a sequence of integers.
		// Returns - An array of sequences.
		// Only top `num_words-1` most frequent words will be taken into account.
        // Only words known by the tokenizer will be taken into account.
		if(!this.isTrained)
			throw new Error('You must fit a document first before you can transform the document!');
		let sequence = [],tokens,temp;
		for(let text of corpus){
			temp = [];
			tokens = this.tokenizer.tokenize(text)
			for(let token of tokens){
				if(token in this.vocab){
					if(this.num_words & this.vocab[token]>=this.num_words)
						temp.push(this.vocab[this.oov_token])
					else
						temp.push(this.vocab[token])
				}
				else
					temp.push(this.vocab[this.oov_token])
			}
			sequence.push(temp)
		}
		// sequence = [[sequence],[sequence],...]
		return sequence
	}
	getFeatureNames(){
		if(!this.isTrained)
			throw new Error('You must fit a document first before you can retrieve the feature names!');
		return Object.keys(this.vocab);
	}
	getVocab(){
		if(!this.isTrained)
			throw new Error('You must fit a document first before you can retrieve the vocab!');
		return this.vocab;
	}
	async loadVocab(path){
		// If model is trained, throw warining
		if(this.isTrained)
			throw new Error('Warning: The featurizer model is already fitted on a data. Overwriting previous data');
  		await new Promise(resolve => {
  			fs.readFile(path,(err, data)=>{
				if(err)
					throw new Error('Error while loading vocab');
				this.vocab = JSON.parse(data)
				this.isTrained = true;
				this.vocabLength = Object.keys(this.vocab).length;
				console.log("Vocab loaded successfully")
				resolve();
	  		});
  		})
	}
	async saveVocab(path){
		if(!this.isTrained)
			throw new Error('You must fit a document first before you can save the vocab!');
		await new Promise(resolve => {
  			fs.writeFile(path,JSON.stringify(this.vocab),(err)=>{
				if(err)
					throw new Error('Error while saving vocab');
				console.log('Vocab saved successfully')
				resolve();
			})
  		})
	}
}

async function featurizer(train=true,vocab_save_path=null,vocab_load_path=null){
	/*
		*It takes input as array of texts(1D array) and converts them to sequence of integers from vocab
	*/
	cv = new Vectorizer()
	// for inference, load and return model
	if(!train){
		if(vocab_load_path !== null)
			await cv.loadVocab(vocab_load_path)
		return cv
	}
	await new Promise(resolve=>{
		// load corpus
		let corpus = [];
		// Connecting to database
		const db = require('../../config/keys.js').mongoURI;
		mongoose.connect(db,{useNewUrlParser:true})
				.then(()=> console.log("Connected to database"))
				.catch((err)=>console.log("Error connecting with mongodb"));
		intentsDB.find((err,data)=>{
				if(err){
		            throw new Error('Error while retrieving data from database');
	        	}
	        	else{
	        		if(data.length!=0){
	        			for(let d of data)
	        				for(let i of d.examples)
	        					corpus.push(i);
	        			// train model and save it
						cv = cv.fit(corpus)
						if(vocab_save_path !== null){
							cv.saveVocab(vocab_save_path).then(res=>{
								mongoose.disconnect()
								resolve();
							})
						}
						else{
							mongoose.disconnect()
							resolve();
						}

	        		}
	        	}
			})
	});
}

module.exports = featurizer;