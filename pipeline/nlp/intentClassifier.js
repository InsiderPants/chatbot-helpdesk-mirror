/*
	*Module for Intent Classification
*/

const tf = require('@tensorflow/tfjs-node');

class LogisticRegression{
	constructor(){
		this.isTrained = false
		this.model = tf.sequential();
		this.optimizer = null
	}
	async train(features,labels){
		// this.validateTrainInput(features,labels)
		if(this.isTrained)
			console.log("SERVER : Warning: The model is already fitted on a data. Overwriting previous data")
		this.model.add(tf.layers.dense({
  							units: 10, 
  							activation: 'sigmoid', 
  							inputShape: [features.length]
  						}));
  		this.model.add(tf.layers.dense({
  							units: labels.length, 
  							activation: 'softmax'
  						}));
  		this.optimizer = tf.train.adam();
		this.isTrained = true
		this.model.compile({
		    optimizer: this.optimizer,
		    loss: 'categoricalCrossentropy',
		    metrics: ['accuracy']
	  	});
	  	await this.model.fit(features, labels, {epochs: 10});
	}
	predict(X){
		this.validateTestInput(X)
		if(!this.isTrained)
			throw new Error('SERVER : You must fit the model first before you can predict on new data!');

		// return {"intent":null,"confidence":1.0};
	}
	load_weights(weights_load_path){
		if(this.isTrained)
			console.log("SERVER : Warning: The model is already trained. Overwriting previous weights")
	}
	save_weights(weights_save_path){
		if(!this.isTrained)
			throw new Error('SERVER : You must fit the model first before you save weights!');
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
	// console.log(clf)
	// Save Model
	// clf.save_weights(weights_save_path);
}

module.exports = intentClassifier;