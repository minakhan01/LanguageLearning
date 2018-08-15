from picamera import PiCamera
from time import sleep
import RPi.GPIO as GPIO

camera = PiCamera()
pin = 24

camera.sensor_mode = 4

camera.resolution = (1640, 1232)

camera.framerate = 30

GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
state = GPIO.input(pin)

def take_photo():
    camera.capture('/home/pi/NotPushedToWifi/image2.jpg')
    print('finished burst')

print('camera started')

camera.start_preview(alpha=200)

while True:
	state = GPIO.input(pin)
	if state == 1:
		take_photo()
		print('photo taken')
		break
	sleep(1)




camera.stop_preview()

