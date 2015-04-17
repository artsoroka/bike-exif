var $ = require('cheerio');
var request = require('request'); 
var util = require('util'); 
var fs = require('fs'); 
var postParser = require('./postParser'); 
var pages = []; 
var url = 'http://www.bikeexif.com/category/custom-motorcycles/page/';

var onPostListReady = function(data){
    console.log("found blog posts: " + data.length);

    var fileName = 'custom-motorcycles.txt';

    fs.writeFile(fileName, data.join(','), function (err) {
      if (err) throw err;
      console.log('pages list is saved to ' + fileName);
    });
    
    data.map(function(url){
        postParser(url);
    });
}
var readPage = function(url, pageNumber){
    if(pageNumber == 10) return onPostListReady(pages); 
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

readPage(url, 1); 
