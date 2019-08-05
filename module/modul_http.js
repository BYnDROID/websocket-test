

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
