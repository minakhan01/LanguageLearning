var gcloud = require('@google-cloud/storage');

var fs = require( 'fs' );
var path = require( 'path' );
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );

var moveFrom = "/home/pi/NotPushedToWifi";
var moveTo = "/home/pi/PushedToWifi"

// Enable Storage
var gcs = gcloud({
  projectId: 'languagelearning-17d88',
  keyFilename: '/home/pi/languagelearning-key.json'
});

// Reference an existing bucket.
var bucket = gcs.bucket('languagelearning-17d88.appspot.com');

function firebase_upload(fileName){
   bucket.upload(fileName, function(err, file) {
   if (err) {
        return console.log(err);
        }
   });
   console.log('upload finished');
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
            if( err ) {
                console.error( "Could not list the directory.", err );
                process.exit( 1 );
            } 

            files.forEach( function( file, index ) {
                    // Make one pass and make the file complete
                    var fromPath = path.join( moveFrom, file );
                    var toPath = path.join( moveTo, file );

                    fs.stat( fromPath, function( error, stat ) {
                        if( error ) {
                            console.error( "Error stating file.", error );
                            return;
                        }

                        if( stat.isFile() )
                            console.log( "'%s' is a file.", fromPath );
                        else if( stat.isDirectory() )
                            console.log( "'%s' is a directory.", fromPath );

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

function checkInternet(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}


var interval = setInterval(function() {
    // example usage:
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
}, 12000);

// clearInterval(interval);