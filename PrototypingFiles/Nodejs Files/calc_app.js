
const bleno = require("bleno");
const UUID = "69d9fdd724fa4987aa3f43b5f4cabcbf"; // set your own value
const MINOR = 2; // set your own value
const MAJOR = 1; // set your own value
const TX_POWER = -60; // just declare transmit power in dBm

fs = require('fs');
fs.readFile('./example_text.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

console.log("Starting bleno...");
bleno.on("stateChange", state => {
    if (state === 'poweredOn') {
        console.log("Starting broadcast...");
        bleno.startAdvertisingIBeacon(UUID, MAJOR, MINOR, TX_POWER, err => {
            if(err) {
                console.error(err);
            } else {
                console.log(`Broadcasting as iBeacon uuid:${UUID}, major: ${MAJOR}, minor: ${MINOR}`);
            }
        });
    } else {
        console.log("Stopping broadcast...");
        bleno.stopAdvertising();
    }        
});


const CALCULATOR_SERVICE_UUID = "00010000-89BD-43C8-9231-40F6E305F96D";
const ARGUMENT_1_UUID = "00010001-89BD-43C8-9231-40F6E305F96D";
const ARGUMENT_2_UUID = "00010002-89BD-43C8-9231-40F6E305F96D";
const RESULT_UUID = "00010010-89BD-43C8-9231-40F6E305F96D";

class ArgumentCharacteristic extends bleno.Characteristic {
    constructor(uuid, name) {
        super({
            uuid: uuid,
            properties: ["write"],
            value: null,
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: name
                  })
            ]
        });
        this.argument = 0;
        this.name = name;
    }
    onWriteRequest(data, offset, withoutResponse, callback) {
        try {
            if(data.length != 1) {
                callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
                return;
            }
            this.argument = data.readUInt8();
            console.log(`Argument ${this.name} is now ${this.argument}`);
            callback(this.RESULT_SUCCESS);
        } catch (err) {
            console.error(err);
            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }
}

class ResultCharacteristic extends bleno.Characteristic {
    constructor(calcResultFunc) {
        super({
            uuid: RESULT_UUID,
            properties: ["read"],
            value: null,
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: "Calculation result"
                  })
            ]
        });
        this.calcResultFunc = calcResultFunc;
    }
    onReadRequest(offset, callback) {
        try {
            const result = this.calcResultFunc();
            console.log(`Returning result: ${result}`);
            let data = new Buffer(1);
            data.writeUInt8(result, 0);
            callback(this.RESULT_SUCCESS, data);
        } catch (err) {
            console.error(err);
            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }
}

bleno.on("advertisingStart", err => {
    console.log("Configuring services...");
    
    if(err) {
        console.error(err);
        return;
    }
    let argument1 = new ArgumentCharacteristic(ARGUMENT_1_UUID, "Argument 1");
    let argument2 = new ArgumentCharacteristic(ARGUMENT_2_UUID, "Argument 2");
    let result = new ResultCharacteristic(() => argument1.argument + argument2.argument);
    let calculator = new bleno.PrimaryService({
        uuid: CALCULATOR_SERVICE_UUID,
        characteristics: [
            argument1,
            argument2,
            result
        ]
    });
    bleno.setServices([calculator], err => {
        if(err)
            console.log(err);
        else
            console.log("Services configured");
    });
});
bleno.on("stateChange", state => {
    if (state === "poweredOn") {
        
        bleno.startAdvertising("Calculator", [CALCULATOR_SERVICE_UUID], err => {
            if (err) console.log(err);
        });
    } else {
        console.log("Stopping...");
        bleno.stopAdvertising();
    }        
});
