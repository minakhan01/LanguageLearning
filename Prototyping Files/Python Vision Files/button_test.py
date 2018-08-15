import RPi.GPIO as GPIO
import time

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import BaseScheduler

pin = 24
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
state = GPIO.input(pin)

def button():
    print('Button pressed')
    return ("Name here")
    

GPIO.add_event_detect(pin, GPIO.RISING)

sched = BackgroundScheduler()
print('script started')


def my_listener(event):
    if False:
        print('The job crashed :(')
    else:
        print(event)
        if str(event)=="<JobExecutionEvent (code=4096)>":
            print(event.retval)        

job = sched.add_job(button, 'interval', seconds=5, id='job_id')
listener = sched.add_listener(my_listener)

def main_func():
    counter = 0
    while True:
        state = GPIO.input(pin)
        if state==1 and counter==0:
            print('detected')
            sched.start()
            print('job started')
            print(listener)
            counter+=1
            time.sleep(.3)
        elif state==1 and counter%2!=0:
            print('stopped')
            job.pause()
            print('job stopped')
            counter+=1
            time.sleep(.3)
        elif state==1 and counter%2==0 and counter!=0:
            print('resume')
            job.resume()
            print('job resumed')
            counter+=1
            time.sleep(.3)

main_func()


