#!/usr/bin/env python3
# Copyright 2017 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Camera image classification demo code.

Runs continuous image detection on the VisionBonnet and prints the object and
probability for top three objects.

Example:
image_classification_camera.py --num_frames 10
"""
import argparse
import time

import RPi.GPIO as GPIO
from aiy.vision.inference import CameraInference
from aiy.vision.models import image_classification
from picamera import PiCamera
from gpiozero import Button


def main():
	"""Image classification camera inference example."""
	parser = argparse.ArgumentParser()
	button = Button(23)
	parser.add_argument(
		'--num_frames',
		'-n',
		type=int,
		dest='num_frames',
		default=-1,
		help='Sets the number of frames to run for, otherwise runs forever.')

	parser.add_argument(
		'--num_objects',
		'-c',
		type=int,
		dest='num_objects',
		default=1,
		help='Sets the number of object interences to print.')

	args = parser.parse_args()

	def print_classes(classes, object_count):
		s = ''
		for index, (obj, prob) in enumerate(classes):
			if index > object_count - 1:
				break
			s += '%s=%1.2f\t|\t' % (obj, prob)
		f = open('object_recognition.txt','w')
		f.write(s)
		f.close()
		print('%s\r' % s)

	with PiCamera() as camera:
		# Forced sensor mode, 1640x1232, full FoV. See:
		# https://picamera.readthedocs.io/en/release-1.13/fov.html#sensor-modes
		# This is the resolution inference run on.
		camera.sensor_mode = 4

		# Scaled and cropped resolution. If different from sensor mode implied
		# resolution, inference results must be adjusted accordingly. This is
		# true in particular when camera.start_recording is used to record an
		# encoded h264 video stream as the Pi encoder can't encode all native
		# sensor resolutions, or a standard one like 1080p may be desired.
		camera.resolution = (1640, 1232)


		pin = 24
		# Start the camera stream.
		camera.framerate = 30
#		camera.start_preview()

		model_type = image_classification.MOBILENET
		counter = 0
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(pin, GPIO.IN)
		state = GPIO.input(pin)
		print(state)


		with CameraInference(image_classification.model(model_type)) as inference:
			for i, result in enumerate(inference.run()):
				state = GPIO.input(pin)
				print(state)
				if i == args.num_frames:
					break
				classes = image_classification.get_classes(result)

				if state == 1:
					camera.capture('/home/pi/training_images/test_image%s.jpg' % counter)
					counter+=1
					print("Image captured, named test_ image%s.jpg"%counter)
				if button.is_pressed:
					#print_classes(classes, args.num_objects)
					camera.capture('/home/pi/training_images/test_image%s.jpg' % counter)
					counter+=1
					print("Image captured, named image%s.jpg"%counter)
				#time.sleep(.5)

#		camera.stop_preview()


if __name__ == '__main__':
	main()
