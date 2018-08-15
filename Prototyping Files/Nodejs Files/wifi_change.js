var wifi = require('node-wifi');
var events = require('events');
var eventEmitter = new events.EventEmitter();


// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
    iface : 'wlan0' // network interface, choose a random wifi interface if set to null
});

wifiDisconnect();

var networkArray = [
    {
      'ssid': "fluid",
      'password': "fluidinterfaces"
    },
    {
      'ssid': "Avengers",
      'password': "1AAddMV*"
    },
    {
      'ssid': "MIT",
      'password': ""
    },
    {
      'ssid': "joy",
      'password': "billoSana"
    }
    ];

var networkLength = networkArray.length;
var connected = 'false';


setTimeout(function () {
    console.log('timeout completed'); 
    // wifiScan();
    try{
      for (var i = 0; i < networkLength; i++){
        console.log(networkArray[i]['ssid']);
        connected = wifiConnect(networkArray[i]);
        console.log(connected);
      };
    }
    catch(err){
      console.log(err);
    }
}, 10000); 

function wifiDisconnect(){
  wifi.disconnect(function(err) {
    if (err) {
        console.log(err);
    }
    console.log('Disconnected');
  });
};

function wifiConnect(ap){
  // Connect to a network
  if(connected=='false'){
      wifi.connect(ap, function(err) {
      if (err) {
          console.log(err);
      }
      console.log('Connected');
    });
  }
};

function wifiScan(){
  wifi.scan(function(err, networks) {
      if (err) {
          console.log(err);
      } else {
          console.log(networks);
          /*
          networks = [
              {
                ssid: '...',
                bssid: '...',
                mac: '...', // equals to bssid (for retrocompatibility)
                channel: <number>,
                frequency: <number>, // in MHz
                signal_level: <number>, // in dB
                security: 'WPA WPA2' // format depending on locale for open networks in Windows
                security_flags: '...' // encryption protocols (format currently depending of the OS)
                mode: '...' // network mode like Infra (format currently depending of the OS)
              },
              ...
          ];
          */
      }
  });
}