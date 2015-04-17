var parser = require('./parser/'); 
var images = []; 
var config = {
	url: 'http://www.bikeexif.com/category/custom-motorcycles/page/',
	start: 1, 
	limit: 2,
	saveToFile: 'custom-motorcycles.txt', 
	dir: 'downloads'
}; 

parser.findPostUrls(config, function(err, pages){
	if( err ) return console.log(err); 

	parser.findImages(pages, function(err, images){
		if(err) return console.log(err); 
		
		console.log('total images found: ' + images.length);

		parser.download({
			images: images, 
			dir: config.dir 
		}, function(err){
			console.log(err); 
		});  

	});

}); 