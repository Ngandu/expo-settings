import * as Settings from 'expo-settings';
import SerialPortAPI from 'react-native-serial-port-api';
import * as React from 'react';
import { Button, Text, View, Alert } from 'react-native';

export default function App() {
  const [theme, setTheme] = React.useState<string>(Settings.getTheme());

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

  async function requestUSBPermission() {
    try {
      SerialPortAPI.setSuPath("/system/xbin/su");
      serialPort = await SerialPortAPI.open("/dev/ttyS4", { baudRate: 115200 })

      console.log("serialPort: ",serialPort);

      let n = serialPort.getPath();
      console.log(n);

      // subscribe received data
      sub = serialPort.onReceived(buff => {
        console.log('Buff - ',buff.toString('hex').toUpperCase());
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
      <Button title={`Set theme to ${nextTheme}`} onPress={() => Settings.setTheme(nextTheme)} />
      <Text>{Settings.boom()}</Text>
      <Button title='show' onPress={sshow} />
      <Button onPress={requestUSBPermission} title="Request  Permission"/>
    </View>
  );
}
