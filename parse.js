var Promise = require('bluebird');  
var parser  = require('./parser'); 

parser
	.findPostUrls({
		url: 'http://www.bikeexif.com/category/custom-motorcycles/page/',
		start: 1, 
		limit: 2,
		saveToFile: 'custom-motorcycles.txt', 
		dir: 'downloads'
	})
	.then(parser.findImages)
	.then(parser.download({
		saveFilesTo: 'downloads'
	}))
	.then(function(numberOfImages){
		console.log('images saved: ', numberOfImages); 
	})
	.catch(function(err){
		console.log('ERROR: ', err); 
	}); 