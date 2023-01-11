import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import {Client} from 'paho-mqtt';

//James Wong 2023

export default function App() {

const settings =
{
  leftColor: "lightblue",
  rightColor: "blue"
}

const client = new Client("52.63.111.219",9001,'/mqtt','native');
client.connect({onSuccess:onConnect});
client.onMessageArrived = displayMessage;

const [messageList, setMessageList] = useState("empty");

useEffect(() => {
  setMessageList("connected");
},[]);  

function onConnect()
{
  client.subscribe("testing");
}

function displayMessage(msg)
{
  console.log(msg.payloadString);
  setMessageList(messageList + "\n" + msg.payloadString);
}

const Row = ({color1, color2}) => {
  return (
    <View style={{flex:0.1, flexDirection:"row", margin:1 }}>
      <View style={{flex:0.5, backgroundColor:settings.leftColor}}>
        <Text>
          sdf
        </Text>
      </View>
      <View style={{flex:0.5, backgroundColor:settings.rightColor}}>
        <Text>
          sss
          {color2}
        </Text>
      </View>
    </View>
  );
}




  return (
    <View style={styles.container}>
      <View style={{flex:0.3}}>
        <Button title='Clear' onPress={() => setMessageList("--")}/>
        <Text>{messageList}</Text>
        <StatusBar style="auto" />
      </View>

      <Row color1="blue" color2="pink"/>
      <Row color1="blue" color2="pink"/>
      <Row color1="blue" color2="pink"/>
      <Row color1="blue" color2="pink"/>
      <Row color1="blue" color2="pink"/>
      <Row color1="blue" color2="pink"/>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
});
