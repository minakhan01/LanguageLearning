# This is a demo of running face recognition on a Raspberry Pi.
# This program will print out the names of anyone it recognizes to the console.

# To run this, you need a Raspberry Pi 2 (or greater) with face_recognition and
# the picamera[array] module installed.
# You can follow this installation instructions to get your RPi set up:
# https://gist.github.com/ageitgey/1ac8dbe8572f3f533df6269dab35df65

import face_recognition
import picamera
import numpy as np
import os
import shutil
from datetime import datetime


# Get a reference to the Raspberry Pi camera.
# If this fails, make sure you have a camera connected to the RPi and that you
# enabled your camera in raspi-config and rebooted first.
camera = picamera.PiCamera()
camera.resolution = (320, 240)
output = np.empty((240, 320, 3), dtype=np.uint8)

# Load a sample picture and learn how to recognize it.
print("Loading known face image(s)")

# Initialize some variables
face_locations = []
face_encodings = []
encoding_array = []
name_array = []

# Directory of training images
directory = "./training_images"

source = './training_images'
destination = './recognized_faces'

files = os.listdir(source)


def main():
	def open_files(directory):
		if len(os.listdir(directory)) == 0:
			print("Directory is empty")
			encoding_array = open("face_embeddings.txt", "r").read()
			name_array = open("./person_names.txt", "a").read()

		else:    
			print("Directory is not empty")
			faces = open("./face_embeddings.txt", "a")
			saved_names = open("./person_names.txt", "a")
			for filename in os.listdir(directory):
				print(filename)
				if filename.endswith(".jpg"): 
					image_data = face_recognition.load_image_file(directory + '/' + filename)
					temp_face_encoding = face_recognition.face_encodings(image_data)[0]
					encoding_array.append(temp_face_encoding)
					name_array.append(filename)
					faces.write(encoding_array)
					saved_names.write(name_array)
			for f in files:
				shutil.move(source+f, destination)
				# print(os.path.join(directory, filename))


	def add_person():
		now = datetime.now()
		local_time = now.strftime("%I-%M-%S_%Y-%d-%B")
		camera.capture(directory+'/'+local_time+'.jpg', format="rgb")
		print('New person added')

	open_files(directory)

	while True:
		print("Capturing image.")
		# Grab a single frame of video from the RPi camera as a numpy array
		camera.capture(output, format="rgb")

		# Find all the faces and face encodings in the current frame of video
		face_locations = face_recognition.face_locations(output)
		print("Found {} faces in image.".format(len(face_locations)))
		face_encodings = face_recognition.face_encodings(output, face_locations)

		match = []
		person_name = ''
		# Loop over each face found in the frame to see if it's someone we know.
		for face_encoding in face_encodings:
			# See if the face is a match for the known face(s)
			match = face_recognition.compare_faces(encoding_array, face_encoding)
			name = "<Unknown Person>"
			print(match)

		for validation in range(len(match)):
			if match[validation]:
				name = name_array[validation]
				person_name = name.split('.')[0]
				print("I see someone named {}!".format(person_name))

if __name__ == '__main__':
	main()