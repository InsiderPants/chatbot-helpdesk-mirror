/*
	*Module for Intent Classification
*/

class LogisticRegression{
	constructor(){
		this.isTrained = false
	}
	train(X,y){
		this.validateTrainInput(X,y)
		if(this.isTrained)
			console.log("Warning: The model is already fitted on a data. Overwriting previous data")
		this.isTrained = true
	}
	predict(X){
		this.validateTestInput(X)
		if(!this.isTrained)
			throw new Error('You must fit the model first before you can predict on new data!');
	}
	load_weights(weights_load_path){
		if(this.isTrained)
			console.log("Warning: The model is already trained. Overwriting previous weights")
	}
	save_weights(weights_save_path){
		if(!this.isTrained)
			throw new Error('You must fit the model first before you save weights!');
	}
	validateTrainInput(X,y){

	}
	validateTestInput(X){

	}
}

function intentClassifier(train=true,features=null,labels=null,weights_load_path=null,weights_save_path=null){
	clf = new LogisticRegression();
	if(!train){
		// Load Model
		clf.load_weights(weights_load_path);
		// return Model
		return clf;
	}
	// Train Model
	clf.train(features,labels);
	// Save Model
	clf.save_weights(weights_save_path);
	// return {"intent":null,"confidence":1.0};
}

module.exports = intentClassifier;