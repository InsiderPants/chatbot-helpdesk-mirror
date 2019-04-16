/*
    *Module for Sentiment Engine
*/
const tf = require('@tensorflow/tfjs-node'),
      fs = require('fs'),
      natural = require('natural');

function getTokenizer() {
    // To cleaned text from  punctuations, stop words etc and normalize(lowercase) it
    var tokenizer = new natural.WordTokenizer();
    return tokenizer
}

class SentimentAnalysis {
    constructor(datasetPath=null) {
        this.model = tf.sequential();   // model is sequential
        this.dataset = [];              // dataset object
        this.max_len = -1;              // maxlength of input string
        this.datasetPath = datasetPath; // dataset path
        this.Y_label = [];              // actual value of sentiment (0 or 1)
        this.raw_corpus = [];           // raw sentences in dataset
        this.corpus = [];               // corpus to cleaned sentences
        this.vocab = {};                // vocabulary
        this.vocabLength = 0;           // length of vocabulary
        this.threshold = 20;            // threshold for not taking those words which occurs in dataset less than 20 times
        this.embedding_matrix = [];     // weights for embedding layer
        this.history = null;            // model training history
        this.tokenizer = getTokenizer();    // to tokenize sentences
    }
    // function to read dataset
    async readDataset() {
        return new Promise(resolve => {
            fs.readFile(this.datasetPath, (err, dataset) => {
                if (err){
                    throw new Error('SERVER: Error while loading Sentiment Analysis Dataset');
                }
                this.dataset = JSON.parse(dataset);
                console.log('SERVER: Sentiment Analysis Dataset loaded successfully')
                resolve();
            })
        })
    }
    
    // for building corpus and return corpus(an array of raw strings)
    buildCorpus() {
        // raw_corpus = ['s1', 's2', ...]
        // Y_label = [0, 1, 0, 0, ...]
        for(let i of this.dataset) {
            this.raw_corpus.push(i.SentimentText);
            this.Y_label.push(i.Sentiment);
        }
    }

    // for building vocabulary
    buildVocab() {
        // wordcount object have string as key and its count
        let word_count = {}, tokens;
        for(let i of this.raw_corpus){
            tokens = this.tokenizer.tokenize(i);
            this.corpus.push(tokens);
            for(let j of tokens){
                if(j in word_count) 
                    word_count[j] = word_count[j]+1;
                else
                    word_count[j] = 1;
            }
        }

        for(let e in word_count) {
            //checking if word count is less than threshold
            if(word_count[e] < this.threshold)
                continue;
            else {
                //checking if key is in vocab or not
                if(e in this.vocab)
                    continue;
                this.vocabLength++;
                this.vocab[e] = this.vocabLength;
            }
        }
    }

    // load vocab
    async loadVocab(path) {
        return new Promise(resolve => {
            fs.readFile(path + 'sentimentAnalysisVocab.json', (err, data) => {
                if(err)
                    throw new Error('SERVER: Error while loading Sentiment Vocabulary');
                this.vocab = JSON.parse(data);
                resolve();
            })
        })
    }

    // save vocab
    async saveVocab(path) {
        await new Promise(resolve => {
            fs.writeFile(path + 'sentimentAnalysisVocab.json', JSON.stringify(this.vocab), err => {
                if(err)
                    throw new Error('SERVER: Error while Saving sentiment vocab');
                console.log('SERVER: Sentiment Vocabulary Saved Successfully');
                resolve();
            })
        })
    }

    // for tokenizing the corpus
    tokenize() {
        let new_corpus = [], max_len_input = -1;
        for(let i of this.corpus) {
            let temp = [];
            for(let j of i){
                if(j in this.vocab)
                    temp.push(this.vocab[j]);
                else
                    temp.push(this.vocabLength);
            }
            if(max_len_input<i.length)
                max_len_input = i.length;
            new_corpus.push(temp);
        }
        this.corpus = new_corpus;
        this.max_len = max_len_input;
    }

    // for padding the sequences
    // If using lstm, do pre padding instead of post padding
    padding(testing=false,testX=null){
        let _len;
        if(!testing){
            for(let i of this.corpus){
                // If corpus conatins X and Y
                _len = i.length;
                if(this.max_len-_len >= 0){
                    // stretching array to length of max_len
                    for(let j=0;j<this.max_len-_len;j++)
                        i.push(0)
                }else{
                    // trimming array to length of max_len
                    i = i.slice(0,this.max_len)
                }
            }
        }else{
            // If corpus conatins X only
            _len = testX.length;
            if(this.max_len-_len >= 0){
                // stretching array to length of max_len
                for(let i=0;i<this.max_len-_len;i++)
                    testX.push(0)   
            }else{
                // trimming array to length of max_len
                testX = testX.slice(0,this.max_len)
            }
        }
    }

    // for loading weights for embedding layer
    async glove_embedding(path) {
        return new Promise(resolve => {
            fs.readFile(path, (err, data) => {
                if(err){
                    throw new Error('SERVER: Error while loading glove word vectors');
                }
                const weight = JSON.parse(data);
                this.embedding_matrix = tf.tensor2d(weight, [this.vocabLength+1, 100]);
                console.log('SERVER: Successfully loaded glove word vectors')
                resolve();
            })
        })
    }

    // training the model
    async train(X, y) {
        // console.log(this.embedding_matrix)
        this.model.add(tf.layers.embedding({
            inputDim: this.vocabLength+1,
            outputDim: 100,
            weights: [this.embedding_matrix],
            inputLength: this.max_len,
            trainable: false,
        }));
        this.model.add(tf.layers.flatten())
        // this.model.add(tf.layers.dense({
        //     // inputShape: [this.max_len],
        //     units: 64,
        //     activation: 'relu',
        // }))
        this.model.add(tf.layers.dense({
            units: 1,
            activation: 'sigmoid',
        }));
        this.model.compile({
            optimizer: tf.train.adam(),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });
        // console.log(this.model.summary())
        this.history = await this.model.fit(X, y, {
            epochs: 5,
            batchSize: 32,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    console.log(epoch);
                }
            },
        });
    }
    predict(testX){
        // testX - string from user query
        // Use a `tf.tidy` scope to make sure that WebGL memory allocated for the
        // `predict` call is released at the end.
        let result
        tf.tidy(() => {
            // Pass through tokenizer
            let tokens = this.tokenizer.tokenize(testX);
            // Map tokens from vocab
            let temp = []
            for(let i of tokens){
                if(i in this.vocab)
                    temp.push(this.vocab[i]);
                else
                    temp.push(this.vocabLength+1);
            }
            tokens = temp;
            // Pad sequence
            this.padding(true,tokens);
            // Prepare input data as a 2D `tf.Tensor`.
            const input = tf.tensor2d([tokens], [1, this.max_len]);
            // Call `model.predict` to get the prediction output as probabilities
            const predictOut = this.model.predict(input);
            // probabilities
            const logits = Array.from(predictOut.dataSync());
            result = logits[0];
        });
        return result;
    }
    //convert matrics to tensors
    convert2Tensor() {
        if (this.corpus.length !== this.Y_label.length)
            throw new Error('SERVER: Training Data of Sentiment Analysis is not equal')
        let index = []
        for (let i = 0; i < this.corpus.length; i++)
            index.push(i);
        tf.util.shuffle(index);
        let X = [], y = [];
        for (let i = 0; i < this.corpus.length; i++) {
            X.push(this.corpus[index[i]]);
            y.push(this.Y_label[index[i]]);
        }
        let X_train = tf.tensor2d(X, [this.corpus.length, X[0].length])
        let y_train = tf.tensor1d(y);
        return [X_train, y_train];
    } 

    // model save
    async saveModel(save_weights_path) {
        // saving model
        await this.model.save('file://' + save_weights_path);
        console.log("SERVER: Sentiment Model Weights saved successfully");
        //saving vocab
        await this.saveVocab(save_weights_path);
        const others = {
            history: this.history,
            max_len: this.max_len,
        };
        await new Promise(resolve => {
            fs.writeFile(save_weights_path + 'sentimentModelData.json', JSON.stringify(others), err=> {
                if(err){
                    throw new Error('SERVER: Error while saving Sentiment Model Data');
                }
                console.log('SERVER: Sentiment Model Data saved successfully');
                resolve();
            })
        })

    }

    // load model
    async loadModel(loadModelPath) {
        this.model = await tf.loadLayersModel('file://' + loadModelPath + 'model.json');
        console.log('SERVER: Successfully loaded Sentiment Model')
        await this.loadVocab(loadModelPath);
        await new Promise(resolve => {
            fs.readFile(loadModelPath + 'sentimentModelData.json', (err, doc) => {
                if(err){
                    throw new Error('SERVER: Error while loading Sentiment Model Data');
                }
                const data = JSON.parse(doc);
                this.max_len = data.max_len;
                this.history = data.history;
                console.log('SERVER: Successfully loaded Sentiment Model Data')
                resolve();
            })
        })
    }

}

async function sentimentEngine(train,dataset_path,embeddings_path,weights_save_path,weights_load_path) {
    if(!train){
        let clf = new SentimentAnalysis(dataset_path);
        await clf.loadModel(weights_load_path);
        return clf
    }
    let clf = new SentimentAnalysis(dataset_path);
    await clf.readDataset();
    clf.buildCorpus();
    clf.buildVocab(); 
    clf.tokenize();
    clf.padding();
    await clf.glove_embedding(embeddings_path);
    console.log("SERVER: Training started");
    const [X, y] = clf.convert2Tensor();
    await clf.train(X, y);
    console.log('SERVER: Saving model');
    await clf.saveModel(weights_save_path);
}

module.exports = sentimentEngine;