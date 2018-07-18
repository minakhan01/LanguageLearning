var bleno = require('bleno');
var exec = require('child_process').exec;
var watch = require('node-watch');
const fs = require('fs');
const delay = require('delay');
// Require gcloud
var gcloud = require('@google-cloud/storage');


var counter = 0;

var CHUNK_SIZE = 20;

var Descriptor = bleno.Descriptor;

var deviceName = 'calvin-visionkit';
var myId = '4afb720a-5214-4337-841b-d5f954214877';
var data = new Buffer('Send me some data to display');
var output = "";
var updateCallback;

var terminalCallback;
var terminalResponse;
var results;

var START_CHAR = String.fromCharCode(002); //START OF TEXT CHAR
var END_CHAR = String.fromCharCode(003);   //END OF TEXT CHAR

const recognitionText = './object_recognition.txt';
const pyScriptPath = './press_object_recognition.py';
const jsScriptPath = './firebase_upload2.js';


var cp = require('child_process'),
python_child = cp.spawn,
py    = python_child('python3', [pyScriptPath]),
dataString = '';

py.stdout.on('data', function(data){
  dataString += data.toString();
  console.log(dataString);
});

py.stdin.write(JSON.stringify(data));






function sliceUpResponse(callback, responseText) {
  if (!responseText || !responseText.trim()) return;
  callback(new Buffer(START_CHAR));
  while(responseText !== '') {
	  callback(new Buffer(responseText.substring(0, CHUNK_SIZE)));
	  responseText = responseText.substring(CHUNK_SIZE);
  }
  callback(new Buffer(END_CHAR));
}



var terminal = new bleno.Characteristic({
	uuid : '8bacc104-15eb-4b37-bea6-0df3ac364199',
	properties : ['notify'],
	onReadRequest : function(offset, callback) {
		console.log("Read request");
		callback(bleno.Characteristic.RESULT_SUCCESS, new Buffer(results).slice(offset));
	},
	onWriteRequest : function(newData, offset, withoutResponse, callback) {
		if(offset) {
			callback(bleno.Characteristic.RESULT_ATTR_NOT_LONG);
		} else {
			var data = newData.toString('utf8');
			console.log("Command received: [" + data + "]");
			dir = exec(data, function(err, stdout, stderr) {
				if (err) {
					var stringError = JSON.stringify(err);
					console.log(stringError);
					callback(bleno.Characteristic.RESULT_SUCCESS);
					terminalResponse = stringError;
				} else {
					console.log(stdout);
					callback(bleno.Characteristic.RESULT_SUCCESS);
					terminalResponse = stdout;
				}
				if (terminalCallback) sliceUpResponse(terminalCallback, terminalResponse);
			});
		}
	},
	onSubscribe: function(maxValueSize, updateValueCallback) {
	    console.log("onSubscribe called");
	   	fs.watch(recognitionText, (event, filename) => {
		  if (filename) {
		    console.log("${filename} file Changed");
		    fs.readFile(recognitionText, 'utf8', function (err,data) {
	  		if (err) {
	    			return console.log(err);
	  		}
	  		console.log("Sending: " + data);
        	updateValueCallback(new Buffer(data));
        	counter++;
        	var firebaseUpload = cp.fork("./firebase_upload2.js",["/home/pi/training_images/firebase_image"+counter+".jpg"]);
        	console.log('upload started');
			});
		  }
		});

	},
	onUnsubscribe: function() {
		console.log("onUnsubscribe");
		clearInterval(this.intervalId);
	}
});


bleno.on('stateChange', function(state) {
	console.log('on -> stateChange: ' + state);
	if (state === 'poweredOn') {
		bleno.startAdvertising(deviceName,[myId]);
	} else {
		bleno.stopAdvertising();
	}
});

bleno.on('advertisingStart', function(error) {
	console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
	if (!error) {
		bleno.setServices([
			new bleno.PrimaryService({
				uuid : myId,
				characteristics : [
					// add characteristics here
					terminal
				]
			})
		]);
		console.log('service added');
	}
});

bleno.on('accept', function(clientAddress) {
	console.log("Accepted connection from: " + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
	console.log("Disconnected from: " + clientAddress);
});

py.stdin.end();
   


