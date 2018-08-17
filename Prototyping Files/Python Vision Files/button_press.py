from picamera import PiCamera
from time import sleep
import RPi.GPIO as GPIO

camera = PiCamera()
pin = 24

camera.sensor_mode = 4

camera.resolution = (320, 240)

camera.framerate = 30

GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
state = GPIO.input(pin)

def take_photo(name):
    camera.capture('/home/pi/%s1.jpg' % name)
    camera.capture('/home/pi/%s2.jpg' % name)
    camera.capture('/home/pi/%s3.jpg' % name)
    print('finished capture')

print('camera started')

camera.start_preview(alpha=200)

while True:
	state = GPIO.input(pin)
	if state == 1:
		name = input("Person's name: ")
		take_photo(name)
		print('photo taken')
	sleep(.5)




camera.stop_preview()

