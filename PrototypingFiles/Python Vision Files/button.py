import threading
from gpiozero import Button
from time import sleep
import RPi.GPIO as GPIO

pin = 24

GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

state = GPIO.input(pin)

while(True):
	state = GPIO.input(pin)
	print(state)
#	if state == GPIO.HIGH:
#		print('pressed')
#	else:
#		print('not pressed')
	sleep(1)


