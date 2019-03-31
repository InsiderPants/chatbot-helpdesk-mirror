/*
	*Module for generating features
*/

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
}

function featurizer(train=true){
	corpus = [['deep','learning','ian','good','fellow','learning','jason','shin','shin'],['yoshua','bengio']];
	cv = new CountVectorizer()
	cv = cv.fit(corpus)
	// for inference, load and return model
	if(!train){
		return cv
	}
	// train model and save it
}

module.exports = featurizer;