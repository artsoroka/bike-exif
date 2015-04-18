var $ = require('cheerio');
var request = require('request'); 
var fs = require('fs'); 
var pages = [];
var Promise = require('bluebird'); 

configureParser = function(config, errCallback, onPostListReady){

	var readPage = function(url, pageNumber){
	    
	    if(config.limit && config.limit == pageNumber) return onPostListReady(pages); 

	    console.log(url + pageNumber);

	    console.log('Parsing page ' + pageNumber);
	    
	    request(url + pageNumber, function (err, resp, html) {
	      if (err) return console.error(err);
	      
	      if(resp.statusCode == 404) {
	          return console.log('finished reading catalogue on page ' + pageNumber );
	      }    
	      var doc = $.load(html);
	      
	      var pageTitle = doc('.page-title').text();
	              
	      if(pageTitle.match('Not Found')){
	        onPostListReady(pages);
	        return console.log('finished reading catalogue on page ' + pageNumber );
	      }
	      
	      var images = doc('.excerptImage');
	      images = (images.length) ? images : doc('.wp-post-image');
	      
	      images.map(function(i, image){
	        if(image.parent.attribs.href)
	            pages.push(image.parent.attribs.href);
	      });
	      
	      console.log('found ' + images.length + ' on this page');
	      readPage(url, ++pageNumber);
	    });
	        
	}

	return readPage; 

}

module.exports = function(config){
	return new Promise(function(resolve, reject){
		var errCallback = function(error){
			reject(error);  
		}

		var onPostListReady = function(data){
		    console.log("found blog posts: " + data.length);

		    if(config.saveToFile){
		    	fs.writeFile(config.saveToFile, data.join(','), function (err) {
			      if (err) throw err;
			      console.log('pages list is saved to ' + config.saveToFile);
			    });
		    }

		    resolve(pages);  
		}


		var readPage = configureParser(config, errCallback, onPostListReady);
		
		readPage(config.url, config.start); 	 	 

	}); 	
}