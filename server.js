var express = require('express');
var app = express();
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var path=require('path');
app.use(express.static('public'));
app.listen(2311);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/main.htm'));
});
app.get('/:n1/:n2', function(req, res) {
    res.sendFile(path.join(__dirname + '/'+req.params.n1 +'/'+req.params.n2));
});
app.get('/:n1/:n2/:n3', function(req, res) {
    res.sendFile(path.join(__dirname + '/'+req.params.n1 +'/'+req.params.n2+'/'+req.params.n3));
});
//signup
app.get('/signup/:id/:name/:mail/:pass' , function(req,res){
  var x={};
  console.log("sdsad");
  x.id=req.params.id;
  x.name=req.params.name;
  x.mail=req.params.mail;
  x.pass=req.params.pass;
  x.active=0;
  var retObj={};
  MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }
   var query={};
   query.id=req.params.id;
    db.collection('Users').find(query).toArray(function(err, sd) {
        if(!sd[0]){
            db.collection('Users').insertOne(x);
            retObj.ans=true;
        }
        else
        {
            retObj.ans=false;
        }
        res.jsonp(retObj);
        console.log(retObj);
    });
});
});


//login
app.get('/login/:id/:pass' , function(req,res){


  var retObj={};
   var query={};
   query.id=req.params.id;
   MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }

    db.collection('Users').find(query).toArray(function(err, sdd) {
        if(!sdd[0]){
            console.log('obj not found');
            retObj.ans=-1;
        }
        else
        {
            if(sdd[0].pass==req.params.pass){
            retObj.ans=1;
            sdd[0].active=1;
            db.collection('Users').remove(query);
            db.collection('Users').insertOne(sdd[0]);
            }
            else
            retObj.ans=0;

        }
        res.jsonp(retObj);
        console.log(retObj);
    });
});
});

//post_login
app.get('/getuser' , function(req,res){
   console.log('error0');
  var retObj={};
  MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { console.log('error');return false; }
   var query={};
   query.active=1;
   console.log(query);
    db.collection('Users').find(query).toArray(function(err, sd) {
        if(sd[0]){
            retObj.name=sd[0].name;
            retObj.mail=sd[0].mail;
        }
        else
        {
            retObj.ans=false;
        }
        res.jsonp(retObj);
        console.log(retObj);
    });
});
});

//logout
    app.get('/logout' , function(req,res){
        MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }

     var query1={};query1.active=1;
    db.collection('Users').find(query1).toArray(function(err, sd) {
    if(sd[0]){
    query1.id=sd[0].id;
    sd[0].active=0;
    console.log(sd[0]);
    console.log(query1);
    db.collection('Users').update(query1,sd[0]);}
   });
  });
      });

//posting event
   app.get('/storeevent/:nm/:dt/:tm/:ven/:des/:img' , function(req,res){
        MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }
  query={};
  query.name=req.params.nm;
  query.date=req.params.dt;
  query.time=req.params.tm;
  query.desc=req.params.des;
  query.venue=req.params.ven;
  query.img=req.params.img;
    db.collection('Events').insertOne(query);
    res.jsonp({ans:true})
  });
   });


//sending array of all events
app.get('/getevent' , function(req,res){

var collection ;
var strJson='{"array":[';
var jsom;


  MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }

  collection = db.collection('Events');
  collection.find().toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
              if (intCount > 0) {
                for (var i = 0; i < intCount;) {
                  strJson +=  JSON.stringify(docs[i]);
                  i = i + 1;
                  if (i < intCount) {
                    strJson += ',';
                  }
                }
              }
            } else {
              onErr(err, callback);
            }
            strJson+=']}';
            jsom=JSON.parse(strJson);
            console.log(jsom);
            res.jsonp(jsom);
        });
  });
   });




//sending info about one event
app.get('/eventdetail/:n' , function(req,res){
  var retObj={};
  MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { console.log('error');return false; }
   var query={};
   query.name=req.params.n;
   console.log(query.name);
    db.collection('Events').find(query).toArray(function(err, sd) {
        if(sd[0]){
          res.jsonp(sd[0]);
          console.log(sd[0].name);
        }
        else
        {
            retObj.ans=false;
            res.jsonp(retObj);
        }
    });
});
});

//attending
app.get('/eventgoing/:n' , function(req,res){
  var retObj={};
  MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { console.log('error');return false; }
   var query={};
   query.active=1;
    db.collection('Users').find(query).toArray(function(err, sd) {
        if(sd[0]){
          if(!sd[0].events) sd[0].events=[];
          if(sd[0].events.indexOf(req.params.n)!=-1){retObj.ans=false;res.jsonp(retObj);return;}
          sd[0].events.push(req.params.n);
          db.collection('Users').update(query,sd[0]);
          res.jsonp(true);
        }
        else
        {
            retObj.ans=false;
            res.jsonp(retObj);
        }
    });
});
});


//remove from attending
app.get('/eventNotgoing/:n' , function(req,res){
  console.log('recieved' + req.params.n);
  var retObj={};
  MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { console.log('error');return false; }
   var query={};
   query.active=1;
    db.collection('Users').find(query).toArray(function(err, sd) {
        if(sd[0]){
          var index = sd[0].events.indexOf(req.params.n);
          if (index > -1) {
             sd[0].events.splice(index, 1);
          }

          db.collection('Users').update(query,sd[0]);
          res.jsonp(true);
        }
        else
        {
            retObj.ans=false;
            res.jsonp(retObj);
        }
    });
});
});

//getting calender data
app.get('/getcaldata',function(req,res){
  var collection ;
var strJson='{"eventSources" : [{"events": [';
var jsom;
var sx=false;

  MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { console.log('error');return false; }
  collection = db.collection('Users');
   var query ={};query.active=1;
   var array=[];
  collection.find(query).toArray(function(err, sd) {
    array=sd[0].events;
    if(!array){res.jsonp({});return;}
    collection = db.collection('Events');
    var sx=[];
    for(var i =0;i<array.length;i++){
      sx.push(false);
      query={};
      query.name=array[i];
    collection.find(query).toArray(function(err, docs) {
      var j=0;
      while(sx[j])j++;
      sx[j]=true;
        var date = docs[0].date;
        var time = docs[0].time;
        var s1=date.split(" ");
        var st = new Date(s1[0]+' ' + s1[1] + " 2016 "+ time);
        var st2 = new Date();
        st.setTime(st.getTime()+19800000);
        st2.setTime(st.getTime()+(4*3600000) +19800000);
        strJson += '{"title":"'+docs[0].name+'","start":"';
        strJson += st.toISOString().substring(0,19);
        strJson +='","end":"'
        strJson += st2.toISOString().substring(0,19);
        strJson+='"}'
        if(!sx[array.length-1]) strJson+=',';
        else{strJson+='],"color": "black", "textColor": "yellow" }    ]}';
            jsom=JSON.parse(strJson);
            console.log(jsom);
            res.jsonp(jsom);}
      });
  }
});
     });
  });

//travel planner add
app.get("/tpa/:dt/:fr/:to/:des",function(req,res){console.log("gotcha");
 MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { console.log('error');return false; }
     var query={};var x;
   query.active=1;
   console.log(query);
    db.collection('Users').find(query).toArray(function(err, sd) {
        if(sd[0]){
          x={};
          x.name=sd[0].name;
          x.mail=sd[0].mail;
          x.dt=req.params.dt;
          x.fr=req.params.fr;
          x.to=req.params.to;
          x.des=req.params.des;
          console.log(x);
          db.collection('TP').insertOne(x);
          res.jsonp(true);
        }
        else
        {
            retObj.ans=false;
            res.jsonp(retObj);
        }
    });
});
});

//travel planner search
app.get("/tps/:dt/:fr/:to/",function(req,res){
 MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { console.log('error');return false; }
     var query={};
     var retObj={};
   query.fr=req.params.fr;
   query.to=req.params.to;
   query.dt=req.params.dt;
   var x={};
   x.people=[];
   var y;
    db.collection('TP').find(query).toArray(function(err, sd) {
        if(sd[0]){
          for(var i=0;i<sd.length;i++){
              y={};
              y.name=sd[i].name;
              y.mail=sd[i].mail;
              x.people.push(y);
        }
        res.jsonp(x);
      }
        else
        {
            retObj.ans=false;
            res.jsonp(retObj);
        }
    });
});
});

//posting question
 app.get('/postq/:ques/:cat' , function(req,res){
        MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { res.jsonp({ans:false});return false; }
  query={};
  query.ques=req.params.ques;
  query.cat=req.params.cat;
    db.collection('PRS').insertOne(query);
    res.jsonp({ans:true});
  });
   });


 //getting all ques
 app.get('/getq' , function(req,res){

var collection ;
var strJson='{"q":[';
var jsom;

  MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }

  collection = db.collection('PRS');
  collection.find().toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
              if (intCount > 0) {
                for (var i = 0; i < intCount;) {
                  strJson +=  JSON.stringify(docs[i]);
                  i = i + 1;
                  if (i < intCount) {
                    strJson += ',';
                  }
                }
              }
            } else {
              onErr(err, callback);
            }
            strJson+=']}';
            jsom=JSON.parse(strJson);
            console.log(jsom);
            res.jsonp(jsom);
        });
  });
   });


//making a question active
app.get('/makeactive/:q' , function(req,res){
  var retObj={};
   var query={};
   query.ques=req.params.q;
   MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }

    db.collection('PRS').find(query).toArray(function(err, sdd) {
        if(!sdd[0]){
            console.log('obj not found');
            retObj.ans=-1;
        }
        else
        {
           retObj.ans=1;
            sdd[0].active=1;
            db.collection('PRS').update(query,sdd[0]);
        }
        res.jsonp(retObj);
        console.log(retObj);
    });
});
});

//make all inactive
//logout
    app.get('/makeinactive' , function(req,res){
        MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }

     var query1={};query1.active=1;
    db.collection('PRS').find(query1).toArray(function(err, sd) {
    if(sd[0]){
    query1.id=sd[0].id;
    sd[0].active=0;
    db.collection('PRS').update(query1,sd[0]);}
   });
  });
      });




//load data  prsa
app.get('/loaddata' , function(req,res){
  var retObj={};
   var query={};
   query.active=1;
   MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }

    db.collection('PRS').find(query).toArray(function(err, sdd) {
        if(!sdd[0]){
            console.log('obj not found');

            retObj.ans=-1;
        }
        else
        {
          if(!sdd[0].ans)sdd[0].ans=[];
           res.jsonp(sdd[0]);
        }
    });
});
});

//posting answer
app.get('/postdata/:ans/:user' , function(req,res){
  var retObj={};
   var query={};
   query.active=1;
   MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return false; }
      console.log(req.params.ans)
    db.collection('PRS').find(query).toArray(function(err, sd) {
        if(!sd[0]){
            console.log('obj not found');
            retObj.ans=-1;
        }
        else
        {
          retObj.ans=1;
          if(!sd[0].ans)sd[0].ans=[];
          var y={};
          y.a=req.params.ans;
          y.user=req.params.user;
          sd[0].ans.push(y);
           db.collection('PRS').update(query,sd[0]);}
          res.jsonp(retObj);
    });
});
});


//Tradeoff

var fs = require("fs");

var multer = require("multer");
var upload = multer({dest: "./uploads"});

var mongoose = require("mongoose");

mongoose.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect/TradeOff");
var conn = mongoose.connection;

var gfs;

var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

conn.once("open", function(){
  gfs = Grid(conn.db);
  app.get("/", function(req,res){
    //renders a multipart/form-data form
    res.render("home");
  });

  //second parameter is multer middleware.
  app.post("/adpost", upload.single("avatar"), function(req, res, next){
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){fs.unlink("./uploads/"+ req.file.filename, function(err){res.send("success")})})
        .on("err", function(){res.send("Error uploading image")})
          .pipe(writestream);
  });

  // sends the image we saved by filename.
  app.get("/:filename", function(req, res){
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(res);
  });

  //delete the image
  app.get("/delete/:filename", function(req, res){
    gfs.exist({filename: req.params.filename}, function(err, found){
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({filename: req.params.filename}, function(err){
          if(err) return res.send("Error occured");
          res.send("Image deleted!");
        });
      } else{
        res.send("No image found with that title");
      }
    });
  });
});

app.set("views", "./views");

app.get('/Advertisement',function(req,res)
{
        var strJson='{"x":[';
        MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return console.dir(err); }
  console.log("We are connected");
  collection = db.collection('Advertisement');
  console.log("We are connected");
  collection.find().toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
              if (intCount > 0) {
                for (var i = 0; i < intCount;) {
                  strJson +=  JSON.stringify(docs[i]);

                  i = i + 1;
                  if (i < intCount) {
                    strJson += ',';
                  }
                }
              }
            } else {
              onErr(err, callback);
            }
            strJson+=']}';

            jsom=JSON.parse(strJson);
res.jsonp(jsom);
        console.log(jsom);
        });
  });
});
app.get('/postedAds/:pn',function(req,res)
{       console.log(req.params.pn)
        var pn=req.params.pn;
        var x={};


      x.pn=pn;
   MongoClient.connect("mongodb://abby295:1412@ds131729.mlab.com:31729/vitconnect", function(err, db) {
  if(err) { return console.dir(err); }

        db.collection('Advertisement').find(x).toArray(
        function (err, docs)
        {
          if(err) { return console.log("we are not connected") }

            if (!err) {

              db.collection('Advertisement').remove(docs[0]);
              docs[0].active=1;
              db.collection('Advertisement').insertOne(docs[0]);
              }
        });

});
});
app.get('/ClearTradeoff',function(req,res)
{

        var pn=req.params.pn;
        var x={};
        x.active=1;
        db.collection('Advertisement').find(x).toArray(
        function (err, docs) {
            if (!err) {

              db.close();
              for(var i=0;i<docs.length;i++)
              {
                db.collection('Advertisement').remove(docs[i]);
              	docs[i].active=0;
              	db.collection('Advertisement').insertOne(docs[i]);
              }
              }
});
});