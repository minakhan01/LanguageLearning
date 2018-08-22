// Require gcloud
var gcloud = require('@google-cloud/storage');
var fs = require('fs');
var path = require( 'path' );
var process = require( "process" );

// const pyScriptPath = './burst_capture.py'; 
const pyScriptPath = './print.py'
const pictureName = 'pictureName.txt';

var PythonShell = require('python-shell');
var pyshell = new PythonShell(pyScriptPath);

var moveFrom = "/home/pi/NotPushedToWifi";
var moveTo = "/home/pi/PushedToWifi"

// Enable Storage
var gcs = gcloud({
  projectId: 'languagelearning-17d88',
  keyFilename: '/home/pi/languagelearning-key.json'
});

// Reference an existing bucket.
var bucket = gcs.bucket('languagelearning-17d88.appspot.com');

console.log('script started');

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
  if (message == 'py started'){
  	console.log('true');
  	checkInternet(function(isConnected) {
    if (isConnected) {
        console.log('connected');
        moveFiles();
        // connected to the internet
    } else {
        console.log('not connected');
        // not connected to the internet
      }
    });
  }else{
  	console.log('false');
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

// // end the input stream and allow the process to exit
// pyshell.end(function (err,code,signal) {
//   if (err) throw err;
//   console.log('The exit code was: ' + code);
//   console.log('The exit signal was: ' + signal);
//   console.log('finished');
//   console.log('finished');
// });

/*Here we are saying that every time our node application receives 
data from the python process output stream(on 'data'), we want to 
convert that received data into a string and append it to the overall dataString.*/
// py.stdout.on('data', function(data){
//     dataString += data.toString();    
//     console.log('Uploading File:',dataString);
// 	//var data = "firebase_image1.jpg";


// });

/*Once the stream is done (on 'end') we want to simply log the received data to the console.*/


// py.stdin.end();

// // Download a file from your bucket.
// bucket.file('giraffe.jpg').download({
//   destination: '/photos/zoo/giraffe.jpg'
// }, function(err) {});