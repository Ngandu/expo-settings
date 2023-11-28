import * as Settings from 'expo-settings';
import SerialPortAPI from 'react-native-serial-port-api';
import * as React from 'react';
import { Button, Text, View, Alert, ScrollView } from 'react-native';

export default function App() {
  const [theme, setTheme] = React.useState<string>(Settings.getTheme());

  const [data,setData] = React.useState([]);
  const [connected,setonnected] = React.useState<Boolean>(false);

  let scannedData = [];

  SerialPortAPI.setSuPath("/system/xbin/su");
  let serialPort, sub;

  React.useEffect(() => {
    const subscription = Settings.addThemeListener(({ theme: newTheme }) => {
      setTheme(newTheme);
    });

    return () => subscription.remove();
  }, [setTheme]);

  const sshow = ()=>{
    console.log("sshow");
    
    Settings.show();
    Settings.requestp();
  }



  React.useEffect(()=>{
    // console.log("data: ",data);
  },[data])



  async function connect() {
    try {
      SerialPortAPI.setSuPath("/system/xbin/su");
      serialPort = await SerialPortAPI.open("/dev/ttyS4", { baudRate: 115200 })

      console.log("serialPort: ",serialPort);

      setonnected(true);

      let n = serialPort.getPath();
      // console.log(n);

      // subscribe received data
      sub = serialPort.onReceived(buff => {
        let trmp = buff.toString('hex').toUpperCase();
        // console.log('Buff - ',trmp);

        let strt = trmp.indexOf("A");

        let barNum = trmp.slice(strt, strt+12);

        console.log("barNum: ",barNum);

        if(barNum.length == 0) return;

        let exists = data.includes(barNum);

        if(!exists){
          setData((data) => [
            ...data,
            barNum
          ]);
        }

      })

      // unsubscribe
      // sub.remove();

      // send data with hex format
      // await serialPort.send('00FF');

      // close
      // serialPort.close();
    } catch (error) {
      console.warn(error);
    }
  }
  

  // Toggle between dark and light theme
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={{ flex: 1 }}>
      <View style={{flexDirection: "row"}}>
      <Button onPress={connect} title={connected ? "disconnect" : "connect"}/>
      <Text style={{paddingLeft: 20}}>Scaned: {data.length}</Text>
      </View>
      {/* <Text>Theme: {Settings.getTheme()}</Text>
      <Button title={`Set theme to ${nextTheme}`} onPress={() => Settings.setTheme(nextTheme)} />
      <Text>{Settings.boom()}</Text>
      <Button title='show' onPress={sshow} /> */}
      <ScrollView style={{ flex: 1 }}>
      {
        data.map((item, i)=>{
          return <Text style={{padding: 10, borderBottomWidth: 0.5, borderColor: "#dddddd"}} key={i}>{i+1} - {item}</Text>
        })
      }
      </ScrollView>
    </View>
  );
}
