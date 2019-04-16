/*
    *Module for training the sentiment engine
*/

const sentimentEngine = require('../sentiment/sentimentEngine');

// Config
config = {
	dataset_path:__dirname+'/data/sentiment/sentimentAnalysisDataset.json',
	embeddings_path:__dirname+'/data/sentiment/embedding_matrix.json',
	weights_save_path:__dirname+'/data/sentiment/',
	weights_load_path:__dirname+'/data/sentiment/'
}

// Train sentiment engine and save
feat = sentimentEngine(train=true,
		dataset_path=config.dataset_path,
		embeddings_path=config.embeddings_path,
		weights_save_path=config.weights_save_path,
		weights_load_path=config.weights_load_path);