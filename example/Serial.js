import SerialPortAPI from 'react-native-serial-port-api';

export default class Serial {
    static instance; //= serial.instance || new serial();

    static getinstance(
        path,
        baudRate
      ) {

        if(!Serial.instance){
            Serial.instance = new Serial(); 
        }

        connect(){

            SerialPortAPI.setSuPath("/system/xbin/su");
            let serialPort = await SerialPortAPI.open(path, { baudRate });

            serialPort.onReceived(buff => {
                console.log('Buff - ',buff.toString('hex').toUpperCase());
              })
        }

      }
}