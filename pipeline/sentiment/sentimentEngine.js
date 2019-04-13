/*
    *Module for Sentiment Engine
*/
const tf = require('@tensorflow/tfjs-node');
const mongoose = require('mongoose');
const fs = require('fs');
const natural = require('natural');


function getTokenizer() {
    // To cleaned text from  punctuations, stop words etc and normalize(lowercase) it
    var tokenizer = new natural.WordTokenizer();
    return tokenizer
}

class SentimentAnalysis {
    // change default dataset path
    constructor(datasetPath='/Users/manis/Desktop/customer-query-resolution-chatbot/pipeline/train/data/sentimentAnalysisDataset.json') {
        this.model = tf.sequential();   //model is sequential
        this.dataset = [];              //dataset object
        this.max_len = -1;              // maxlength of input string
        this.datasetPath = datasetPath; //dataset path
        this.Y_label = [];              // actual value of sentiment (0 or 1)
        this.raw_corpus = [];           // raw sentences in dataset
        this.corpus = [];               // corpus to cleaned sentences
        this.vocab = {};                // vocabulary
        this.vocabLength = 1;           // length of vocabulary
        this.threshold = 20;            // threshold for not taking those words which occurs in dataset less than 20 times
        this.embedding_matrix = [];     // weights for embedding layer
        this.history = null;
    }

    // function to read dataset
    async readDataset() {
        return new Promise(resolve => {
            fs.readFile(this.datasetPath, (err, dataset) => {
                if (err)
                    throw new Error('SERVER: Error while loading Sentiment Analysis Dataset');
                else {
                    this.dataset = JSON.parse(dataset);
                    resolve();
                }
            })
        })
    }
    
    // for building corpus and return corpus(an array of raw strings)
    buildCorpus() {
        // corpus = ['s1', 's2', ...]
        // Y_label = [0, 1, 0, 0, ...]        
        let corpus = [], Y_label = [];
        for(let i of this.dataset) {
            corpus.push(i.SentimentText);
            Y_label.push(i.Sentiment);
        }
        this.raw_corpus = corpus;
        this.Y_label = Y_label;
    }

    // for building vocabulary
    buildVocab() {
        // wordcount object have string as key and its count
        let word_count = {}, tokens, final_corpus = [];
        for(let i of this.raw_corpus) {
            tokens = getTokenizer().tokenize(i);
            final_corpus.push(tokens);
            for(let j of tokens) {
                if(j in word_count) 
                    word_count[j] = word_count[j]+1;
                else
                    word_count[j] = 1;
            }
        }
        this.corpus = final_corpus;
        // temporary array for sorting number of words by their number of occurance
        let temp = [];
        for(let k in word_count)
            temp.push({'key': k, 'value': word_count[k]})
        temp.sort(function(a, b) { return b.value - a.value; });

        for(let e of temp) {
            //checking if word count is less than threshold
            if(e.value < this.threshold)
                continue;
            else {
                //checking if key is in vocab or not
                if(e.key in this.vocab)
                    continue;
                this.vocabLength++;
                this.vocab[e.key] = this.vocabLength;
            }
        }
    }

    // load vocab
    async loadVocab(path) {
        return new Promise(resolve => {
            fs.readFile(path, (err, data) => {
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
            fs.writeFile(path, JSON.stringify(this.vocab), err => {
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
            let temp = [], count = 0;
            for(let j of i) {
                count++;
                if(j in this.vocab)
                    temp.push(this.vocab[j]);
                else
                    temp.push(this.vocabLength+1);
            }
            if(max_len_input<count)
                max_len_input = count;
            new_corpus.push(temp);
        }
        this.corpus = new_corpus;
        this.max_len = max_len_input;
    }

    // for padding the sequences (pre padding)
    padding() {
        let new_padded_corpus = [];
        for(let i of this.corpus) {
            let array = [], count=0;    //count is for maintaining the position till which 0 i to be filled
            for(let j=1;j<=this.max_len;j++) {
                count++;
                //filling staring with 0
                if(count <= (this.max_len - i.length))
                    array.push(0);
                // ending with original
                else
                    array.push(i[i.length + j - this.max_len - 1])                
            }
            new_padded_corpus.push(array);
        }
        this.corpus = new_padded_corpus;
    }

    // for loading weights for embedding layer
    async glove_embedding(path) {
        return new Promise(resolve => {
            fs.readFile(path, (err, data) => {
                if(err)
                    throw new Error('SERVER: Error while loading glove word vector');
                this.embedding_matrix = JSON.parse(data);
                resolve();
            })
        })
    }

    // training the model
    async train(X, y) {
        // console.log(this.embedding_matrix)
        // this.model.add(tf.layers.embedding({
        //     inputDim: this.vocabLength,
        //     outputDim: 100,
        //     weights: [this.embedding_matrix],
        //     inputLength: this.max_len,
        //     trainable: false,
        // }));
        this.model.add(tf.layers.dense({
            inputShape: [this.max_len],
            units: 64,
            activation: 'sigmoid',
        }))
        this.model.add(tf.layers.dense({
            units: 1,
            activation: 'softmax',
        }));
        this.model.compile({
            optimizer: tf.train.adam(),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });
        this.history = await this.model.fit(X, y, {
            epochs: 2,
            batchSize: 32,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    console.log(tf.memory().numTensors + " tensors");
                    console.log(epoch + logs);

                }
            },
        });
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
}

async function senti() {
    let a = new SentimentAnalysis();
    console.log('1');
    await a.readDataset();
    a.buildCorpus();
    a.buildVocab();    
    a.tokenize();
    a.padding();
    // a.saveVocab('/Users/manis/Desktop/customer-query-resolution-chatbot/pipeline/train/data/sentimentAnalysisVocab.json');
    await a.glove_embedding('/Users/manis/Desktop/customer-query-resolution-chatbot/pipeline/train/data/embedding_matrix.json');
    console.log(a.embedding_matrix.length);
    console.log(a.embedding_matrix[0].length);
    console.log("training start");
    const [X, y] = a.convert2Tensor();
    await a.train(X, y);
}

a = senti();

// function sentimentEngine(customerQuery){
// 	return 1
// }

// module.exports = sentimentEngine;