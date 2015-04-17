var request = require('request'); 
var fs 		= require('fs'); 

Array.prototype.last = function(){
	return this[this.length - 1]; 
}

var downloader = function(config, callback){
	
	var images = config.images; 
	
	if( ! images.length ) return console.log('no images'); 

	var image = images.pop(); 
	
	filename = image.split('/').last();  
	path     = [config.dir, filename].join('/'); 

	console.log('writeing a file: ' + path); 
	request(image)
		.pipe(fs.createWriteStream(path))
		.on('close', function(){
			downloader({
				images: images, 
				dir: config.dir 
			}, callback); 
	}); 

}

module.exports = function(config, callback){
    if ( ! fs.existsSync(config.dir)) {
      fs.mkdirSync(config.dir);
    }  

	downloader(config, callback); 
}