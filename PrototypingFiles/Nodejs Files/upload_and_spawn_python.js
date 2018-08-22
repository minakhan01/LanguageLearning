// Require gcloud
var gcloud = require('@google-cloud/storage');
var fs = require('fs');

const pyScriptPath = './burst_capture.py'; 
const pictureName = 'pictureName.txt';


var spawn = require('child_process').spawn,
py    = spawn('python3', [pyScriptPath]),
dataString = '';

// Enable Storage
var gcs = gcloud({
  projectId: 'languagelearning-17d88',
  keyFilename: '/home/pi/languagelearning-key.json'
});

// Reference an existing bucket.
var bucket = gcs.bucket('languagelearning-17d88.appspot.com');

console.log('script started');
// Upload a local file to a new file to be created in your bucket.
// var data = process.argv.slice(2);

var interval = setInterval(function() {
	  fs.watch(pictureName, (event, filename) => {
		  if (filename) {
			setTimeout(function () {
		    	console.log('timeout completed'); 
			    console.log("${filename} file Changed");
			    fs.readFile(pictureName, 'utf8', function (err,data) {
		  		if (err) {
		  			py.kill('SIGINT');
		  			py.stdin.end();
		    		return console.log(err);
		  		}
		    	console.log('upload started');
		    	bucket.upload(data, function(err, file) {
				if (err) {
					py.kill('SIGINT');
					py.stdin.end();
				    return console.log(err);
				  }
				});
				dataString = '';
				console.log('upload finish');
				});
			}, 2000); 
		  }
	});
}, 10000);



/*Here we are saying that every time our node application receives 
data from the python process output stream(on 'data'), we want to 
convert that received data into a string and append it to the overall dataString.*/
// py.stdout.on('data', function(data){
//     dataString += data.toString();    
//     console.log('Uploading File:',dataString);
// 	//var data = "firebase_image1.jpg";


// });

/*Once the stream is done (on 'end') we want to simply log the received data to the console.*/
py.stdout.on('end', function(){
	console.log('script finish');
});

// py.stdin.end();

// // Download a file from your bucket.
// bucket.file('giraffe.jpg').download({
//   destination: '/photos/zoo/giraffe.jpg'
// }, function(err) {});