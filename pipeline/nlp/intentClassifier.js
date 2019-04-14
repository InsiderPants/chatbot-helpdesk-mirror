/*
	*Module for Intent Classification
*/

const tf = require('@tensorflow/tfjs-node'),
	  mongoose = require("mongoose"),
	  intentsDB = require("../../models/intentsDB.js"),
	  featurizer = require('./featurizer'),
	  fs = require('fs');

class NeuralNetwork{
	constructor(featurizer=null,intentDict=null){
		this.isTrained = false;
		this.model = tf.sequential();
		this.history = null;
		this.max_len = -1;
		this.featurizer = featurizer;
		this.intentDict = intentDict;
		this.num_classes = null;
		try{
			this.num_classes = Object.keys(intentDict).length
		}catch(err){
			this.num_classes = null
		}
	}
	async train(features,labels){
		if(this.isTrained)
			console.log("SERVER: Warning: The model is already fitted on a data. Overwriting previous data")
		this.model.add(tf.layers.dense({
  							units: 10, 
  							activation: 'sigmoid', 
  							inputShape: [features.shape[1]]
  						}));
  		this.model.add(tf.layers.dense({
  							units: labels.shape[1], 
  							activation: 'softmax'
  						}));
		this.model.compile({
		    optimizer: tf.train.adam(),
		    loss: 'categoricalCrossentropy',
		    metrics: ['accuracy']
	  	});
	  	this.history = await this.model.fit(features, labels, {
	  		epochs: 5,
	  		callbacks: {
		      	onEpochEnd: async (epoch, logs) => {
					  console.log(epoch)
					  // set socket io here
		      	},
	  		}
	  	});
	  	this.isTrained = true
	  	return this
	}
	predict(query){
		/*
			*query is a string. Ex: "Hello there bot!"
		*/
		if(!this.isTrained)
			throw new Error('SERVER: You must fit the model first before you can predict on new data!');
		// Use a `tf.tidy` scope to make sure that WebGL memory allocated for the
	  	// `predict` call is released at the end.
	  	let result;
	  	tf.tidy(() => {
	  		// Pass through featurizer
	  		let seq = this.featurizer.transform([query]);
	  		// Pad sequence
	  		this.padding(seq,true);
	    	// Prepare input data as a 2D `tf.Tensor`.
	    	const input = tf.tensor2d(seq, [1, this.max_len]);
	    	// Call `model.predict` to get the prediction output as probabilities
	    	const predictOut = this.model.predict(input);
	    	// probabilities
	    	const logits = Array.from(predictOut.dataSync());
	    	// class label
	    	const index = predictOut.argMax(-1).dataSync()[0];
	    	result = {
	    		'intent':this.findIntentHelper(index),
	    		'confidence':logits[index]
	    	}
	  	});
	  	return result;
	}
	findIntentHelper(ind){
		for(let temp in this.intentDict)
	    	if(this.intentDict[temp]==ind)
	    		return temp
	    return "default_fallback";
	}
	prepareXY(data){
		let seq,corpus=[];
		for(let d of data){
			for(let i of d.examples){
				seq = this.featurizer.transform([i]);
				if(seq[0].length>this.max_len)
					this.max_len = seq[0].length;
				corpus.push([seq[0],this.intentDict[d.intent]]);
			}
		}
		return corpus;
	}
	padding(corpus,testing=false){
		let _len;
		if(!testing){
			for(let example of corpus){
				// If corpus conatins X and Y
				_len = example[0].length;
				if(this.max_len-_len >= 0){
					// stretching array to length of max_len
					for(let i=0;i<this.max_len-_len;i++)
						example[0].push(0)	
				}else{
					// trimming array to length of max_len
					example[0] = example[0].slice(0,this.max_len)
				}
			}
		}else{
			// If corpus conatins X only
			_len = corpus[0].length;
			if(this.max_len-_len >= 0){
				// stretching array to length of max_len
				for(let i=0;i<this.max_len-_len;i++)
					corpus[0].push(0)	
			}else{
				// trimming array to length of max_len
				corpus[0] = corpus[0].slice(0,this.max_len)
			}
		}	
	}
	async load_weights(weights_load_path){
		if(this.isTrained)
			console.log("SERVER: Warning: The model is already trained. Overwriting previous weights")
		this.model =  await tf.loadLayersModel('file://'+weights_load_path+"/model.json");
		console.log("SERVER: Model weights loaded successfully");
		let p1 = new Promise(resolve=>{
			fs.readFile(weights_load_path+'/intentDict.txt',(err, data)=>{
				if(err)
					throw new Error('SERVER: Error while loading intentDict');
				this.intentDict = JSON.parse(data);
				console.log("SERVER: intentDict loaded successfully");
				resolve();
	  		});
		})
		let p2 = new Promise(resolve=>{
			fs.readFile(weights_load_path+'/thingsToSave.txt',(err, data)=>{
				if(err)
					throw new Error('SERVER: Error while loading thingsToSave');
				let thingsToLoad = JSON.parse(data);
				this.history = thingsToLoad.history;
				this.max_len = thingsToLoad.max_len;
				this.num_classes = thingsToLoad.num_classes;
				console.log("SERVER: thingsToSave loaded successfully");
				this.isTrained = true;
				resolve();
	  		});
		})
		return Promise.all([p1,p2])
					.then(_=>{
						return this;
					})
					.catch(err=>{
						console.log('SERVER: Error while loading weights');
					})
	}
	async save_weights(weights_save_path){
		if(!this.isTrained)
			throw new Error('SERVER: You must fit the model first before you save weights!');
		const saveResult = await this.model.save('file://'+weights_save_path);
		console.log("SERVER: Model weights saved successfully");
		await new Promise(resolve => {
  			fs.writeFile(weights_save_path+'/intentDict.txt',JSON.stringify(this.intentDict),(err)=>{
				if(err)
					throw new Error('SERVER: Error while saving intentDict');
				console.log('SERVER: intentDict saved successfully')
			})
			let thingsToSave = {
				history:this.history,
				max_len:this.max_len,
				num_classes:this.num_classes
			}
			fs.writeFile(weights_save_path+'/thingsToSave.txt',JSON.stringify(thingsToSave),(err)=>{
				if(err)
					throw new Error('SERVER: Error while saving thingsToSave');
				console.log('SERVER: thingsToSave saved successfully')
				resolve();
			})
  		})
	}
	convertToTensors(data, targets) {
	  	const numExamples = data.length;
	  	if (numExamples !== targets.length)
	    	throw new Error('SERVER: Data and targets have different numbers of examples');
	  	// Randomly shuffle `data` and `targets`.
	  	const indices = [];
	  	for(let i = 0; i < numExamples; ++i)
	    	indices.push(i);
	  	tf.util.shuffle(indices);
	  	const shuffledData = [];
	  	const shuffledTargets = [];
	  	for(let i = 0; i < numExamples; ++i){
	    	shuffledData.push(data[indices[i]]);
	    	shuffledTargets.push(targets[indices[i]]);
	  	}
	  	const xDims = shuffledData[0].length;
	  	// Create a 2D `tf.Tensor` to hold the feature data.
	  	const xs = tf.tensor2d(shuffledData, [numExamples, xDims]);
	  	// Create a 1D `tf.Tensor` to hold the labels, and convert the number label into one-hot encoding
	  	const ys = tf.oneHot(tf.tensor1d(shuffledTargets).toInt(), this.num_classes);
	  	// Split the data into training and test sets, using `slice`.
	  	const xTrain = xs.slice([0, 0], [numExamples, xDims]);
	  	const yTrain = ys.slice([0, 0], [numExamples, this.num_classes]);
	  	return [xTrain, yTrain];
	}
	getData(corpus){
		/*
			* Return: An array of 2 elements:
			*   1. training data as an `Array`(tensor)
			*   2. training labels(one hot encoded) as an `Array`(tensor) of numbers,
					with the same length as the return training data above
		*/
	  	return tf.tidy(() => {
		    const dataByClass = [];
		    const targetsByClass = [];
		    for(let i = 0; i < this.num_classes; ++i){
		      	dataByClass.push([]);
		      	targetsByClass.push([]);
		    }
		    for(const example of corpus){
		    	const data = example[0]
		      	const target = example[1]
		      	dataByClass[target].push(data);
		      	targetsByClass[target].push(target);
		    }
		    const xTrains = [];
		    const yTrains = [];
		    for(let i = 0; i < this.num_classes; ++i){
		      	const [xTrain, yTrain] = this.convertToTensors(dataByClass[i], targetsByClass[i]);
		      	xTrains.push(xTrain);
		      	yTrains.push(yTrain);
		    }
		    const concatAxis = 0;
		    return [tf.concat(xTrains, concatAxis), tf.concat(yTrains, concatAxis)];
	  	});
	}
}

async function intentClassifier(train=true,weights_load_path=null,vocab_load_path=null,weights_save_path=null){
	if(!train){
		 return featurizer(train=false,vocab_save_path=null,vocab_load_path=vocab_load_path)
			.then(featurizer=>{
				var clf = new NeuralNetwork(featurizer);
				// Load Model
				if(weights_load_path!==null){
					return clf.load_weights(weights_load_path)
						.then(classifier=>{
							console.log("SERVER: Classifier loaded successfully");
							// return Model
							return classifier
						})
						.catch(err=>{
							console.log(err)
							console.log("SERVER: Error loading classifier")
						});
				}
				else
					throw new Error("SERVER: weights_load_path not valid");
			})
			.catch(err=>{
				console.log('SERVER: Error while loading featurizer');
			})
	}else{
		await new Promise(resolve=>{
			// load corpus
			let corpus, intentDict = {};
			// Connecting to database
			const db = require('../../config/keys.js').mongoURI;
			mongoose.connect(db,{useNewUrlParser:true})
					.then(()=> console.log("SERVER: Connected to intent database for training intent classifier"))
					.catch((err)=>console.log("SERVER: Error connecting with intent database for training intent classifier"));
			intentsDB.find((err,data)=>{
					if(err){
			            throw new Error('SERVER: Error while retrieving data from database');
		        	}
		        	else{
		        		if(data.length!=0){
		        			if(vocab_load_path!==null){
								featurizer(train=false,vocab_save_path=null,vocab_load_path=vocab_load_path)
									.then(featurizer=>{
										// Create dictionary of intents
										for(let d of data){
											if(d.intent in intentDict)
												continue;
											else {
												intentDict[d.intent] = Object.keys(intentDict).length;
											}
										}

										// Inititate Model
					        			var clf = new NeuralNetwork(featurizer,intentDict);

					        			// get corpus containing X and y and set max_len of X for padding
										corpus = clf.prepareXY(data)
										
										// Pad the sequences to max_len
										clf.padding(corpus,false);

										// Convert to tensors and get X and y
					        			const [X, y] = clf.getData(corpus);

					     				// Train Model
										clf.train(X,y)
											.then(classifier=>{
												console.log('SERVER: Classifier trained successfully')
												// marking intents trained
												for (let d of data) {
													d.set({
														isTrained: true
													})
													d.save((err, _) => {
														if (err) {
															throw new Error('SERVER: Error while saving isTrained property after training');															
														}
													})
												}
												// Save Model
												if (weights_save_path !== null) {
													clf.save_weights(weights_save_path).then(res => {
														console.log('SERVER: All done, disconnecting database now')
														resolve();

													})
												}
												else {
													console.log('SERVER: weights_save_path not given/invalid, disconnecting database now')
													resolve();
												}
											})
											.then(() => {
												mongoose.disconnect()
											})
											.catch(err=>{
												console.log(err)
												console.log('SERVER: Error while training classifier');
												mongoose.disconnect();
												resolve();
											})
									})
									.catch(err=>{
										console.log('SERVER: Error while loading featurizer');
										mongoose.disconnect();
										resolve();
									})
							}
		        		}
		        	}
				})
		});
	}
}

module.exports = intentClassifier;