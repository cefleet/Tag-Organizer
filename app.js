var fs = require('fs');
var iptc = require('node-iptc');

var tags = []
var images = []


function getData() {
  fs.readdir("./images",function(err, files){
    files.forEach(function(file){
      fs.readFile('./images/'+file, function(err, data){
        if (err) throw err;
        console.log("*****IPTC*****")
        console.log(iptc(data));

      });

    });
  });
}
getData()
