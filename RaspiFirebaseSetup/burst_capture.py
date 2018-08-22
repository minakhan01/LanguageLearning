from picamera import PiCamera
import time
from datetime import date 
from datetime import datetime
import RPi.GPIO as GPIO
import sys


def main():
	"""
	Takes a burst of images on button press
	"""
	def firebase_upload(time):
		camera.capture('/home/pi/NotPushedToWifi/%s.jpg' % time)
		# f = open('pictureName.txt','w')
		# f.write('/home/pi/training_images/'+time+'.jpg')
		# f.close()
		#print('Image captured:%s.jpg' % time)
	

	with PiCamera() as camera:
		pin = 24
		#button = Button(23)
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

		# Start the camera stream.
		camera.framerate = 30
		
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
		state = GPIO.input(pin)

		# state = GPIO.input(pin)
		# classes = image_classification.get_classes(result)
		#camera.start_preview()
		print('camera Started')
		sys.stdout.flush()
		while True:
			state = GPIO.input(pin)
			if state == 1:
				for i in range(10):
					now = datetime.now()
					local_time = now.strftime("%I-%M-%S_%Y-%d-%B")
					firebase_upload(local_time)
					print('image captured at:', local_time)
					sys.stdout.flush()
					time.sleep(1.5)
				print('finished burst')
				sys.stdout.flush()
		#camera.stop_preview()
			

if __name__ == '__main__':
	main()