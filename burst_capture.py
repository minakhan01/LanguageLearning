from picamera import PiCamera
import time
from datetime import date 
from datetime import datetime
import RPi.GPIO as GPIO
import sys


def main():
	def print_classes(classes, object_count):
		s = ''
		for index, (obj, prob) in enumerate(classes):
			if index > object_count - 1:
				break
			s += '%s=%1.2f\t|\t' % (obj, prob)
		f = open('./object_recognition.txt','w')
		f.write(s)
		f.close()
		print('%s\r' % s)

	def firebase_upload(time):
		camera.capture('/home/pi/NotPushedToWifi/%s.jpg' % time)
		# f = open('pictureName.txt','w')
		# f.write('/home/pi/training_images/'+time+'.jpg')
		# f.close()
		#print('Image captured:%s.jpg' % time)
	

	with PiCamera() as camera:
		#print('Script Started')
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

		#local_time = time.asctime( time.localtime(time.time()) )
		#today = date.today()
		
		
		#local_time = hms + "_" + today

		# model_type = image_classification.MOBILENET
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

				
			#print_classes(classes, args.num_objects)
		#camera.stop_preview()

			

if __name__ == '__main__':
	main()