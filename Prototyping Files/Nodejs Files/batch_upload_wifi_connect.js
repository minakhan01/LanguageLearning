// Require gcloud
var gcloud = require('@google-cloud/storage');
var fs = require('fs');
var path = require( 'path' );
var process = require( "process" );

const pyScriptPath = './burst_capture.py'; 
const pictureName = 'pictureName.txt';

var PythonShell = require('python-shell');
var pyshell = new PythonShell(pyScriptPath);

var moveFrom = "/home/pi/NotPushedToWifi";
var moveTo = "/home/pi/PushedToWifi"

var wifi = require('node-wifi');
 
// Enable Storage
var gcs = gcloud({
  projectId: 'languagelearning-17d88',
  keyFilename: '/home/pi/languagelearning-key.json'
});

// Reference an existing bucket.
var bucket = gcs.bucket('languagelearning-17d88.appspot.com');

// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
    iface : 'wlan0' // network interface, choose a random wifi interface if set to null
});

wifiDisconnect();

console.log('script started')
// setTimeout(function () {
//     console.log('timeout completed'); 
//     wifiDisconnect();
// }, 10000); 


var networkArray = [
    {
      'ssid': "fluid",
      'password': "fluidinterfaces"
    },
    {
      'ssid': "Avengers",
      'password': "1AAddMV*"
    },
    {
      'ssid': "MIT",
      'password': ""
    },
    {
      'ssid': "joy",
      'password': "billoSana"
    }
    ];

var networkLength = networkArray.length;
var connected = 'false';

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
  if (message == 'finished burst'){
    console.log('finished taking pictures');
      if (connected == 'true') {
          console.log('connected, uploading files');
          moveFiles();
          // connected to the internet
      } else {
          console.log('not connected, attempting to connect');
          // not connected to the internet
          try{
            for (var i = 0; i < networkLength; i++){
              if (connected == 'false'){
                console.log(networkArray[i]['ssid']);
                connected = wifiConnect(networkArray[i]);
                console.log('reconnected');
              }
            };
            moveFiles()
          }
          catch(err){
            console.log(err);
          }
        }
  }else{
    console.log('not finished taking pics');
  }
});

function firebase_upload(fileName){
   bucket.upload(fileName, function(err, file) {
   if (err) {
      return console.log(err);
    }
   });
   console.log('upload finished');
}


function checkInternet(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}


// Loop through all the files in the temp directory
function moveFiles(){
  fs.readdir(moveFrom, function( err, files ) {
            if( err ) {
                console.error( "Could not list the directory.", err );
                process.exit( 1 );
            } 
            files.forEach(function(file, index){
                var toPath = path.join( moveTo, file );
                var fromPath = path.join( moveFrom, file );
                firebase_upload(fromPath);
            });
  });
    fs.readdir( moveFrom, function( err, files ) {
            files.forEach( function( file, index ) {
                    // Make one pass and make the file complete
                    var fromPath = path.join( moveFrom, file );
                    var toPath = path.join( moveTo, file );
          
                    fs.stat( fromPath, function( error, stat ) {
                        if( error ) {
                            console.error( "Error stating file.", error );
                            return;
                        }

                        if( stat.isFile() ){
                          console.log('filename is:', file);
                          
                            console.log( "'%s' is a file.", fromPath );                         
                        }
                        else if( stat.isDirectory() ){
                            console.log( "'%s' is a directory.", fromPath );
                        }
                        fs.rename( fromPath, toPath, function( error ) {
                            if( error ) {
                                console.error( "File moving error.", error );
                            }
                            else {
                                console.log( "Moved file '%s' to '%s'.", fromPath, toPath );
                            }
                        } );
                    } );
            } );

    } );
}

function wifiDisconnect(){
  wifi.disconnect(function(err) {
    if (err) {
        console.log(err);
    }
    console.log('Disconnected');
  });
};

function wifiConnect(ap){
  // Connect to a network
  if(connected=='false'){
      wifi.connect(ap, function(err) {
      if (err) {
          console.log(err);
      }
      console.log('Connected');
      connected = 'true';
      return 'true';
    });
  }
};