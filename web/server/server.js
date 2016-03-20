// modules
var childProcess = require('child_process')
  , express = require('express')
  , http = require('http')
  , morgan = require('morgan')
  , ws = require('ws');

// configuration files
var configServer = require('./lib/config/server');

// File name variables
var pic = {num:1, type:".jpg"};
var vid = {num:1, type:".mp4"};

// app parameters
var app = express();
app.set('port', configServer.httpPort);
app.use(express.static(configServer.staticFolder));
app.use(morgan('dev'));

// serve index
require('./lib/routes').serveIndex(app, configServer.staticFolder);

// HTTP server
http.createServer(app).listen(app.get('port'), function () {
  console.log('HTTP server listening on port ' + app.get('port'));
});

/// Video streaming section
// Reference: https://github.com/phoboslab/jsmpeg/blob/master/stream-server.js

var STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes
var width = 320;
var height = 120;
var stream;

// Video WebSocket server
var wsServer = new (ws.Server)({ port: configServer.wsPort });
console.log('WebSocket server listening on port ' + configServer.wsPort);

wsServer.on('connection', function(socket) {
  // Send magic bytes and video size to the newly connected socket
  // struct { char magic[4]; unsigned short width, height;}
  var streamHeader = new Buffer(8);

  streamHeader.write(STREAM_MAGIC_BYTES);
  streamHeader.writeUInt16BE(width, 4);
  streamHeader.writeUInt16BE(height, 6);
  socket.send(streamHeader, { binary: true });

  console.log('New WebSocket Connection (' + wsServer.clients.length + ' total)');

  // Receive control message from client
  socket.on('message', function(data) {
    var control = JSON.parse(data);
    console.log('------------------------------Incoming Command------------------------------');
    if(control.type == "LED"){
      console.log('Control Type --> ' + control.type);
      console.log('LED Dim Level --> ' + control.level);
    }
    else if(control.type == "PIC"){
      console.log('Control Type --> ' + control.type);
      console.log('Latitude --> ' + control.lat);
      console.log('Longitude --> ' + control.lon);
      stream.kill();//'SIGQUIT');
      //childProcess.exec('../../bin/add_photo.sh', {env: {file: pic.num + pic.type, lat: control.lat, lon: control.lon}}, function(err, stdout, stderr) {
        //if (err) { throw err; }
        //console.log('stdout:\n', stdout);
        //console.log('stderr:\n', stderr);
      //});
      pic.num++;
    }
    else if(control.type == "VID"){
      console.log('Control Type --> ' + control.type);
      console.log('Video State --> ' + control.state);
      console.log('Latitude --> ' + control.lat);
      console.log('Longitude --> ' + control.lon);
      childProcess.exec('../../bin/add_video.sh', {env: {file: vid.num + vid.type, lat: control.lat, lon: control.lon}}, function(err, stdout, stderr) {
        if (err) { throw err; }
        //console.log('stdout:\n', stdout);
        //console.log('stderr:\n', stderr);
      });
      vid.num++;
    }
    console.log('----------------------------------------------------------------------------');
  });

  socket.on('close', function(code, message){
    console.log('Disconnected WebSocket (' + wsServer.clients.length + ' total)');
  });
});

wsServer.broadcast = function(data, opts) {
  for(var i in this.clients) {
    if(this.clients[i].readyState == 1) {
      this.clients[i].send(data, opts);
    }
    else {
      console.log('Error: Client (' + i + ') not connected.');
    }
  }
};

// HTTP server to accept incoming MPEG1 stream
http.createServer(function (req, res) {
  console.log(
    'Stream Connected: ' + req.socket.remoteAddress +
    ':' + req.socket.remotePort + ' size: ' + width + 'x' + height
  );

  req.on('data', function (data) {
    wsServer.broadcast(data, { binary: true });
  });
}).listen(configServer.streamPort, function () {
  console.log('Listening for video stream on port ' + configServer.streamPort);

  // Run do_ffmpeg.sh from node                                                   
  stream = childProcess.exec('../../bin/do_ffmpeg.sh');
});

module.exports.app = app;
