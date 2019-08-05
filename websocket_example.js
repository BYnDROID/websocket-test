/**************************websocket_example.js*************************************************/
const bodyParser = require("body-parser");
const express = require('express'); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
const mysql = require('mysql');

var http = require('http');
var path = require("path");
var io = require('socket.io');
const server = http.createServer(app);//create a server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

 

function User_kontrol (API_KEY, KID, NID, client) {
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
        var res = '{"nokta_adi":"'+result[0].nokta_adi+'"'+
                  ',"nokta_mode":"'+result[0].nokta_mode+'"'+
                  ',"urun":"'+result[0].urun+'"'+
                  ',"model":"'+result[0].model+'"'+
                  ',"durum":"'+result[0].durum+'"}';
          client.send( "{\"SERVER\":\""+ res +"\"}\"" );
      });
      
    con.end((err) => {
      // The connection is terminated gracefully
      // Ensures all previously enqueued queries are still
      // before sending a COM_QUIT packet to the MySQL server.
    });
}


//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})
/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const s = new WebSocket.Server({ server });
//when browser sends get request, send html file to browser
// viewed at http://localhost:30000
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});
//*************************************************************************************************************************
//***************************ws chat server********************************************************************************
//app.ws('/echo', function(ws, req) {
s.on('connection',function(ws,req){
	/******* when server receives messsage from client trigger function with argument message *****/
	ws.on('message',function(data){
		if ( data.substring(0, 1) == "{" ) {
			console.log("Received JSON: " + data);
			var obj = JSON.parse(data);
			var API_KEY = obj["API_KEY"];
			var KID = obj["KID"];
			var NID = obj["NID"];

			console.log('API_KEY:', API_KEY);
			console.log('KID:', KID);
			console.log('NID:', NID);

			User_kontrol (API_KEY, KID, NID, ws ) ;
		} else {
			console.log("Received: " + data);
		}
	// ws.send("From Server only to sender: "+ message); //send to client where message is from
	});
	/******* when server receives messsage from client trigger function with argument message *****/
	// ws.on('message',function(message){
		// console.log("Received: "+message);
		// s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
			// if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
				// client.send("broadcast: " +message);
			// }
		// });
	////ws.send("From Server only to sender: "+ message); //send to client where message is from
	// });
	ws.on('close', function(){
		console.log("lost one client");
	});
	//ws.send("new client connected");
	console.log("new client connected");
});
server.listen(3000);
