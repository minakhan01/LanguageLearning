// Set the configuration for your app

var firebase = require("firebase");


fs = require('fs')
// TODO: Replace with your project's config object
var config = {
  apiKey: 'AIzaSyCC5ddm8XmfWFpv7ZImVQQLK29wKk-IukI',
  authDomain: 'languagelearning-17d88.firebaseapp.com',
  databaseURL: 'https://languagelearning-17d88.firebaseio.com/',
  storageBucket: 'gs://languagelearning-17d88.appspot.com'
};
firebase.initializeApp(config);

// Get a reference to the storage service, which is used to create references in your storage bucket

// Create a root reference
var storageRef = firebase.storage().ref();

// Create a reference to 'mountains.jpg'
var objRef = storageRef.child('firebase_image1.jpg');

// Create a reference to 'images/mountains.jpg'
var imageRef = storageRef.child('firebase_image1.jpg');

var file = fs.readFile('firebase_image1.jpg', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});
//... // use the Blob or File API
ref.put(file).then(function(snapshot) {
  console.log('Uploaded a blob or file!');
});


