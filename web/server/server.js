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
var vid = "off";

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
var width = 702;
var height = 288;
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
      if(vid == "on"){
        stream.kill('SIGTERM');
        vid = "off";
        setTimeout(function() {
        console.log('Taking Photo');
        childProcess.exec('../../bin/add_photo.sh', {env: {file: pic.num + pic.type, lat: control.lat, lon: control.lon}}, function(err, stdout, stderr) {
          if (err) { throw err; }
            console.log('stdout:\n', stdout);
            console.log('stderr:\n', stderr);
          });
        }, 500);
      }
      else if(vid == "off"){
        childProcess.exec('../../bin/add_photo.sh', {env: {file: pic.num + pic.type, lat: control.lat, lon: control.lon}}, function(err, stdout, stderr) {
          if (err) { throw err; }
            console.log('stdout:\n', stdout);
            console.log('stderr:\n', stderr);
          });
      }   
      pic.num++;
    }
    else if(control.type == "VID"){
      console.log('Control Type --> ' + control.type);
      if(vid == "off"){ 
        vid = "on"; 
        //160x120
        stream = childProcess.exec('/home/root/bin/ffmpeg/ffmpeg -s 352x288 -f video4linux2 -input_format mjpeg -i /dev/video0 -s 352x288 -f video4linux2 -input_format mjpeg -i /dev/video1 -filter_complex "nullsrc=size=702x288 [base]; [0:v] setpts=PTS-STARTPTS, scale=352x288 [left]; [1:v] setpts=PTS-STARTPTS, scale=352x288 [right]; [base][left] overlay=shortest=1 [tmp1]; [tmp1][right] overlay=shortest=1:x=352" -f mpeg1video http://127.0.0.1:8082');
      }
      else if(vid == "on"){
        stream.kill('SIGTERM');
        vid = "off";
      }
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
  //stream = childProcess.exec('../../bin/do_ffmpeg.sh');
});
 
//stream.on("exit", function (code, signal) {
//  if (code === null && signal === "SIGTERM") {
//    console.log("child has been terminated");
//  }
//});
module.exports.app = app;
