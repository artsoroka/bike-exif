var request = require('request'); 
var fs 		= require('fs'); 
var Promise = require('bluebird'); 
Array.prototype.last = function(){
	return this[this.length - 1]; 
}

var downloader = function(config, callback){
	
	var images  = config.images; 
	var dir     = config.saveFilesTo; 
	var counter = config.counter || 0; 

	if( ! images.length ) return callback(null, counter);  
	
	counter += 1; 
	var image = images.pop(); 
	
	filename = image.split('/').last();  
	path     = [dir, filename].join('/'); 

	console.log('writeing a file: ' + path); 
	request(image)
		.pipe(fs.createWriteStream(path))
		.on('close', function(){
			downloader({
				counter: counter, 
				images: images, 
				saveFilesTo: dir 
			}, callback); 
	}); 

}

module.exports = function(config){
    if ( ! fs.existsSync(config.saveFilesTo)) {
      fs.mkdirSync(config.saveFilesTo);
    }   
			
    return function(images){
    	return new Promise(function(resolve, reject){
    		downloader({
    			counter: 0, 
    			images: images, 
    			saveFilesTo: config.saveFilesTo
    		}, function(err, numberOfImages){
    			if(err) reject(err); 
    			resolve(numberOfImages);  
    		}); 
    	}); 
    }
}