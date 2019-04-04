/*
	*Module for generating features
*/

const fs = require('fs');

class CountVectorizer{
	constructor(){
		this.isTrained = false;
		this.vocab = {};
		this.vocabLength = 0;
	}
	fit(corpus){
		// corpus = [[tokens],[tokens],...]
		if(corpus===undefined | corpus === null)
			throw new Error('Invalid corpus')
		if(this.isTrained)
			console.log("Warning: The model is already fitted on a data. Overwriting previous data");
		this.buildVocab(corpus);
		this.isTrained = true;
		return this
	}
	transform(tokens){
		// tokens is 1-D array
		if(!this.isTrained)
			throw new Error('You must fit a document first before you can transform the documnet!');
		var counts = []
		for(let temp=0;temp<this.vocabLength;temp=temp+1)
			counts.push(0)
		for(let token of tokens){
			for(let word in this.vocab){
				if(word===token)
					counts[this.vocab[word]] += 1
			}
		}
		return counts
	}
	getFeatureNames(){
		if(!this.isTrained)
			throw new Error('You must fit a document first before you can retrieve the feature names!');
		return Object.keys(this.vocab);
	}
	buildVocab(corpus){
		for(let tokens of corpus){
			for(let token of tokens){
				if(token in this.vocab)
					continue;
				this.vocab[token] = this.vocabLength;
				this.vocabLength = this.vocabLength+1;
			}
		}
	}
	async loadVocab(path){
		// If model is trained, throw warining
		if(this.isTrained)
			throw new Error('Warning: The model is already fitted on a data. Overwriting previous data');
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
	corpus = [['deep','learning','ian','good','fellow','learning','jason','shin','shin'],['yoshua','bengio']];
	cv = new CountVectorizer()
	// for inference, load and return model
	if(!train){
		await cv.loadVocab(vocab_load_path)
		return cv
	}
	// train model and save it
	cv = cv.fit(corpus)
	await cv.saveVocab(vocab_save_path)
}

module.exports = featurizer;