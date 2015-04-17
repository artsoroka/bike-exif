var parser = require('./parser/'); 
var images = []; 
var config = {
	url: 'http://www.bikeexif.com/category/custom-motorcycles/page/',
	start: 1, 
	limit: 3,
	saveToFile: 'custom-motorcycles.txt'
}; 

parser.findPostUrls(config, function(err, pages){
	if( err ) return console.log(err); 
	console.log(pages); 
}); 