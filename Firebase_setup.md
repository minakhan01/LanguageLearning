## Setup Firebase for Raspberry Pi Zero W

**If your Raspberry Pi Zero did not come with node installed, first follow the instructions below to get node and node package manager:**  

#### Download Nodejs

https://www.cmgresearch.com/2014/05/18/raspberry-pi-btle-device.html  
http://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/  

##### Step 1: Detect What Version of Node.js You Need

The processor on Raspberry Pi is ARM, but depends on the model there can be ARMv6, ARMv7 or ARMv8. These 3 versions of ARM are supported by Node.js.
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



#### Download the necessary Wifi/additional packages 

In your node folder, use npm to install the following packages for the script to work:

`npm install node-wifi @google-cloud/storage python-shell`

These are additional packages that allow you to use Network Manager to have greater control over Wifi management. 

1. Install the needed packages with the following command: 

   `sudo apt install network-manager network-manager-gnome openvpn \`
   `openvpn-systemd-resolved network-manager-openvpn \`
   `network-manager-openvpn-gnome`

2. Remove unneeded packages:

   `sudo apt purge openresolv dhcpcd5`

3. Replace /etc/resolv.conf with a symlink to /lib/systemd/resolv.conf :

   `sudo ln -sf /lib/systemd/resolv.conf /etc/resolv.conf`