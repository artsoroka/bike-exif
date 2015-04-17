var $ = require('cheerio'); 
var request = require('request'); 
var fs = require('fs'); 
//var domain = 'http://www.bikeexif.com/yamaha-virago-920'; 

var saveImageSet = function(conf){
    var dir = conf.dir || './';
    var images = conf.images || [];
    fs.mkdirSync(dir);
    images.map(function(url){
        var name = url.split('/');
        name = name[name.length - 1];
        request(url).pipe(fs.createWriteStream(dir + name));
    });
    
}
 
module.exports = function(url){
    
  request(url, function (err, resp, html) {
    if (err) return console.error(err)
    
    var doc = $.load(html)
    var title = doc('title').text().split('/').join('');
    console.log(title);
    var imageURLs = []
    doc('img').map(function(i, img) {
      if(img.attribs.width && img.attribs.width == 625 && ! img.attribs.src.match('exif_logo')) imageURLs.push(img.attribs.src);
    });
    
    var dirname = './downloads/' + title + '/';
    
    saveImageSet({
      dir: dirname,
      images: imageURLs
    });
        
    console.log(imageURLs.length);
  
  });
}
