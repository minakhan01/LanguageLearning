from picamera import PiCamera
from time import sleep

camera = PiCamera()

camera.start_preview()
sleep(5000)
camera.stop_preview()