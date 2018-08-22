// Require gcloud
var gcloud = require('@google-cloud/storage');

// Enable Storage
var gcs = gcloud({
  projectId: 'languagelearning-17d88',
  keyFilename: '/home/pi/languagelearning-key.json'
});

// Reference an existing bucket.
var bucket = gcs.bucket('languagelearning-17d88.appspot.com');

// Upload a local file to a new file to be created in your bucket.
var data = process.argv.slice(2);

//var data = "firebase_image1.jpg";
bucket.upload(data[0], function(err, file) {
  if (err) {
    return console.log(err);
  }
});
console.log('upload finish');

// // Download a file from your bucket.
// bucket.file('giraffe.jpg').download({
//   destination: '/photos/zoo/giraffe.jpg'
// }, function(err) {});