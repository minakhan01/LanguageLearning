## Setup Bluetooth LE for Raspberry Pi Zero W

**If your Raspberry Pi Zero did not come with the Bluez stack installed, follow the instructions below:**  

#### Download BlueZ

1. ##### Check Current BlueZ Version

  1-1. Before starting, let’s check the current BlueZ version.  
  `bluetoothctl -v`  
  In case you are using Raspbian Stretch (November 2017 version), the BlueZ version should be 5.43.  
  `bluetoothctl -v`  
  `5.43  `

  

2. ##### Install Dependencies

  2-1. Update the package list.  
  `sudo apt-get update  `
  2-1. Install the dependencies.  
  `sudo apt-get install libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev -y  `

  

3. ##### Install Latest BlueZ

  3-1. Download the latest version of BlueZ source code.  
  `wget www.kernel.org/pub/linux/bluetooth/bluez-5.50.tar.xz  `  
  3-2. Uncompress the downloaded file  
  `tar xvf bluez-5.50.tar.xz && cd bluez-5.50`  
  3-3. Configure.  
  `./configure --prefix=/usr --mandir=/usr/share/man --sysconfdir=/etc --localstatedir=/var --enable-experimental`    

  3-4. Compile the source code.  
  `make -j4  `  
  3-5. Install.  
  `sudo make install`  
  3-6. Reboot Raspberry Pi 3.  
  `sudo reboot  `

  

4. ##### Verify Update

  4-1. Verify the BlueZ version by issuing the command below.  
  ``bluetoothctl -v``    

  The result should be like this:  
  `$ bluetoothctl -v`  
  `bluetoothctl: 5.50`  

  

5. ##### Run BLE

  2-3. Make sure that the sample code works.   
  `./bluez-5.50/test/example-advertisement`  

  Output should be like this:  
  `$ ./bluez-5.50/test/example-advertisement`  
  `GetAll`  
  `returning props`  
  `Advertisement registered`  



#### Using Node.js and Bleno to advertise

https://www.cmgresearch.com/2014/05/18/raspberry-pi-btle-device.html  
http://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/  

##### Step 1: Detect What Version of Node.js You Need

The processor on Raspberry Pi is ARM, but depends on the model there can be ARMv6, ARMv7 or ARMv8. This 3 versions of ARM is supported by Node.js.
So first of all type this in your terminal on raspberry pi to detect the version that you need:  
`uname -m`

If the response starts with armv6 than that's the version that you will need. For example for raspberry pi zero W you will need ARMv6

##### Step 2: Download Node.JS Linux Binaries for ARM

Go to node.js download page and check on the version of ARM that you need and choose Copy Link address.
After that in the terminal using wget download the tar.gz file for that version. Just type wget, paste the link copied before and make sure the extension is .tar.gz. If it's something else change it to this and it should be ok. For example I will need ARMv6 and I will type the current newest package in my terminal:  
`wget https://nodejs.org/dist/v8.11.3/node-v8.11.3-linux-armv6l.tar.gz`  

##### Step 3: Extract the Archive

Using tar that is already installed with the system on your raspberry pi just type this (make sure you change the filename with the file that you have)  
`tar -xzf node-v8.11.3-linux-armv6l.tar.gz`

##### Step 4: Copy Node to /usr/local

`cd node-v8.11.3-linux-armv6l/`  


`sudo cp -R * /usr/local/`  

##### Step 5: Check If Everything Is Installed Ok

Check if node and npm are installed correctly. These lines should print the version of node and npm installed.  
`node -v`  
`npm -v`



##### Step 6: Install bleno 

The bluetooth system service needs to be disabled for bleno to work, otherwise some operations will just fail silently. This is quite easy to miss.  
`sudo service bluetooth stop`  
`sudo hciconfig hci0 up # reactivate hci0 or another hciX you want to use`  
`npm install bleno --save`