var fs = require('fs');
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");

var express = require('express')
var app = express()

app.use(express.static('images'))

app.get('/icon.png', function(req,res){
  res.sendFile("imageIcon.png", {root:__dirname})
})

app.get('/', function(req,res){
  res.sendFile('index.html', { root: __dirname })
});

app.get('/getTags/', function(req,res){
    var sql = 'SELECT name FROM Tags WHERE pid = 0';
    db.all(sql, function(err,data){
      res.send(data)
    });
});

app.get('/getImages/', function (req, res) {
  var tags = req.query
  tagArray = []
  for (tag in tags) {
    tagArray.push(tags[tag]);
  }
  var sql = ''
  console.log(tagArray);
  if(tagArray.length == 0){
    sql = "SELECT Images.id,Images.name,ImageComments.comment as displayName FROM Images JOIN ImageComments ON Images.id = ImageComments.imageid"
  } else {
    var section = "SELECT Images.id,Images.name,ImageComments.comment as displayName FROM Images,Tags,ImageTags JOIN ImageComments ON Images.id = ImageComments.imageid WHERE ImageTags.imageid=Images.id AND ImageTags.tagid=Tags.id AND Tags.name";
    for(var i = 0; i< tagArray.length; i++){
      if(i > 0){
        sql = sql+' INTERSECT ';
      }
      var sql = sql+section+" IN ('"+tagArray[i]+"') ";
    }
  }
//  var sql = "SELECT Images.id,Images.name FROM Images,Tags,ImageTags WHERE ImageTags.imageid=Images.id AND ImageTags.tagid=Tags.id AND Tags.name ('1ph') INTERSECT SELECT Images.id,Images.name FROM Images,Tags,ImageTags WHERE ImageTags.imageid=Images.id AND ImageTags.tagid=Tags.id AND Tags.name IN ('ecoga') INTERSECT SELECT Images.id,Images.name FROM Images,Tags,ImageTags WHERE ImageTags.imageid=Images.id AND ImageTags.tagid=Tags.id AND Tags.name IN ('2011')";
  db.all(sql, function(err, data){
    if(err){
      console.log(err)
    }
    res.send(data)
  })
});

app.listen(8080, function () {
  console.log('8080')
});
