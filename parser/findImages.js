var $ = require('cheerio'); 
var request = require('request'); 
var images = []; 

var parseImages = function(pages, callback){
  if( ! pages.length ) return callback(null,images); 

  var url = pages.pop(); 

  request(url, function (err, resp, html) {
    if (err) return callback('could not process post page: ' + url); 
    
    var imageURLs = []; 
    var doc = $.load(html)
    var title = doc('title').text().split('/').join('');
    
    console.log('Current page: ' + title);
    
    doc('img').map(function(i, img) {
      if(img.attribs.width && img.attribs.width == 625 && ! img.attribs.src.match('exif_logo')) imageURLs.push(img.attribs.src);
    });
        
    console.log('found images: ', imageURLs.length);
    imageURLs.map(function(e){
      images.push(e); 
    })
    parseImages(pages, callback); 
  
  });

}

module.exports = function(pages, callback){
  parseImages(pages, callback); 
}