var app = require('http').createServer(handler)
var io = require('socket.io')(app)
var url = require('url')
var fs = require('fs')
var JPa = require('json-parser')

// app.js
const mysql = require('mysql');
 
function User_kontrol (API_KEY, KID, NID, socket ) {
    var sql = 'SELECT * FROM st_nokta WHERE API_KEY = \''+API_KEY+'\' and KID = '+KID+' and id = '+NID+'; ';
    
    console.log('Data sql:' + sql);
    const con = mysql.createConnection({
      host: 'localhost',
      user: 'dbroot',
      password: 'bbnb1105',
      database: 'node_sera_db'
    });
    con.connect((err) => {
      if(err){
        console.log('Error connecting to Db');
        return;
      }
      console.log('Connection established');
    });

      con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log('result:', result);
        //console.log('fields:', fields);
        var res = '{"nokta_adi":"'+result[0].nokta_adi+'"'+
                  ',"nokta_mode":"'+result[0].nokta_mode+'"'+
                  ',"urun":"'+result[0].urun+'"'+
                  ',"model":"'+result[0].model+'"'+
                  ',"durum":"'+result[0].durum+'"}';
        // console.log("res "+res);
        //console.log("Sonuc "+Sonuc.nokta_adi);
        //console.log("Sonuc "+Sonuc.nokta_mode);
        //console.log("Sonuc "+Sonuc.urun);
        //console.log("Sonuc "+Sonuc.model);
        //console.log("Sonuc "+Sonuc.durum);
       // var res = '{nokta_adi:'+result[0].nokta_adi+',nokta_mode:'+result[0].nokta_mode+',urun:'+result[0].urun+',model:'+result[0].model+',durum:'+result[0].durum+'}';
              
          socket.emit("LOGIN",  { "res": res});
                  
      });
      
    con.end((err) => {
      // The connection is terminated gracefully
      // Ensures all previously enqueued queries are still
      // before sending a COM_QUIT packet to the MySQL server.
    });
}












//This will open a server at localhost:5000. Navigate to this in your browser.
app.listen(5000);

// Http handler function
function handler (req, res) { 

    // Using URL to parse the requested URL
    var path = url.parse(req.url).pathname;

    // Managing the root route
    if (path == '/') {
        index = fs.readFile(__dirname+'/public/index.html', 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load index.html");
                }

                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(data);
            });
    // Managing the route for the javascript files
    } else if( /\.(js)$/.test(path) ) {
        index = fs.readFile(__dirname+'/public'+path, 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load " + path);
                }

                res.writeHead(200,{'Content-Type': 'text/plain'});
                res.end(data);
            });
    } else {
        res.writeHead(404);
        res.end("Error: 404 - File not found.");
    }

}

// Web Socket Connection
io.sockets.on('connection', function (socket) {

  // If we recieved a command from a client to start watering lets do so
  socket.on('LOGIN', function(data) {
      var user = data["user"];
      var pass = data["pass"];
      var API_KEY = data["API_KEY"];
      var KID = data["KID"];
      var NID = data["NID"];
      
      console.log('data:', data);
      console.log('user:', user);
      console.log('pass:', pass);
      console.log('API_KEY:', API_KEY);
      console.log('KID:', KID);
      console.log('NID:', NID);
      
      User_kontrol (API_KEY, KID, NID, socket ) ;
      
      
  });


  // If we recieved a command from a client to start watering lets do so
  socket.on('example-pingss', function(data) {
      var delay = data["duration"];
      var delay2 = data["duration2"];
      
      console.log('data:', data);
      console.log('delay:', delay);
      console.log('delay2:', delay2);
      
    //var duration1 = JPa.parse(data.toString('duration'));
    //var duration2 = JPa.parse(data.toString('duration2'));
        //console.log('duration1:', duration1);
        //console.log('duration2:', duration2);
      
      
//      console.log("data " + duration1 + "   delay " + duration2 );
      // Set a timer for when we should stop watering
      setTimeout(function(){
          socket.emit("example-pong");
          console.log("example-pong " + delay);
          //console.log("example-pong 1 " + duration1);
          //console.log("example-pong 2 " + duration2);
      }, delay*1000);
  });
  
  
});
