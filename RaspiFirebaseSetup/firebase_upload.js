    // Require gcloud
    var gcloud = require('@google-cloud/storage');

    // Enable Storage
    var gcs = gcloud({
      projectId: 'languagelearning-17d88',
      keyFilename: '/home/pi/languagelearning-key.json'
    });

    // Reference an existing bucket.
    var bucket = gcs.bucket('gs://languagelearning-17d88.appspot.com');

    // Upload a local file to a new file to be created in your bucket.
    bucket.upload('/home/pi/training_images/image2.jpg', function(err, file) {
      if (!err) {
        // "zebra.jpg" is now in your bucket.
      }
    });

    // // Download a file from your bucket.
    // bucket.file('giraffe.jpg').download({
    //   destination: '/photos/zoo/giraffe.jpg'
    // }, function(err) {});