# Import gcloud
from google.cloud import storage

# Enable Storage
client = storage.Client()

# Reference an existing bucket.
bucket = client.get_bucket('gs://languagelearning-17d88.appspot.com')

# Upload a local file to a new file to be created in your bucket.
imageBlob = bucket.get_blob('firebase_image1.jpg')
imageBlob.upload_from_filename(filename='/home/pi/training_images/firebase_image1.jpg')