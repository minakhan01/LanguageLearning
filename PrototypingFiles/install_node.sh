#!/bin/bash  


wget https://nodejs.org/dist/v8.11.3/node-v8.11.3-linux-armv6l.tar.gz
tar -xzf node-v8.11.3-linux-armv6l.tar.gz
cd node-v8.11.3-linux-armv6l/


sudo cp -R * /usr/local/
sudo service bluetooth stop
sudo hciconfig hci0 up
npm install bleno --save

#mark this executable using  'chmod +x file'