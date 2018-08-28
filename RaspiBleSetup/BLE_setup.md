## Setup Bluetooth LE for Raspberry Pi Zero W

**If your Raspberry Pi Zero did not come with the Bluez stack installed and updated, follow the instructions below:**  

#### Download BlueZ

------

##### Check Current BlueZ Version

Before starting, let’s check the current BlueZ version.  
  `bluetoothctl -v`  
   If  you are using Raspbian Stretch (November 2017 version), the BlueZ version should be 5.43.  
  `bluetoothctl -v`  
  `5.43  `

##### Install Dependencies

Update the package list.  
  `sudo apt-get update  `

 Install the dependencies.  
```sudo apt-get install libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev -y  ```

  

##### Install Latest BlueZ

 Download the latest version of BlueZ source code.  
  `wget www.kernel.org/pub/linux/bluetooth/bluez-5.50.tar.xz  `  

Uncompress the downloaded file  
  `tar xvf bluez-5.50.tar.xz && cd bluez-5.50`  
Configure.  
  `./configure --prefix=/usr --mandir=/usr/share/man --sysconfdir=/etc --localstatedir=/var --enable-experimental`    

Compile the source code.  
  `make -j4  `  
Install.  
  `sudo make install`  
Reboot Raspberry Pi 3.  
  `sudo reboot  `



##### Verify Update

Verify the BlueZ version by issuing the command below.  
  ``bluetoothctl -v``    

 The result should be like this:  
  `$ bluetoothctl -v`  
  `bluetoothctl: 5.50`  

  

##### Run BLE

Make sure that the sample code works.   
  `./bluez-5.50/test/example-advertisement`  

Output should be like this:  
  `$ ./bluez-5.50/test/example-advertisement`  
  `GetAll`  
  `returning props`  
  `Advertisement registered`  



#### Using Bleno to advertise

https://www.cmgresearch.com/2014/05/18/raspberry-pi-btle-device.html  
http://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/  

##### Install bleno 

The bluetooth system service needs to be disabled for bleno to work, otherwise some operations will just fail silently. This is quite easy to miss.  
`sudo service bluetooth stop`  
`sudo hciconfig hci0 up # reactivate hci0 or another hciX you want to use` 
`wget https://nodejs.org/dist/v8.9.0/node-v8.9.0-linux-armv6l.tar.gz`
`tar -xzf node-v8.9.0-linux-armv6l.tar.gz`
`cd node-v8.9.0-linux-armv6l/`
`sudo cp -R * /usr/local/`
`node -v`
`npm -v`
`npm install bleno --save`
