import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ToastAndroid, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import {Client} from 'paho-mqtt';

//James Wong 2023

export default function App() {

const settings =
{
  leftColor: '#239F',
  rightColor: '#239F',
  borderWidth:1, 
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
  console.log(msg.topic)
  console.log(msg.payloadString);
  setMessageList(messageList + "\n" + msg.payloadString);
  //case by case topic sorted assignment
  //if topic => do this
}


function toast()
{
  ToastAndroid.show("testing", ToastAndroid.SHORT);
}

//row status viewer layout
const Row = ({color1, color2}) => {
  return (
    <View style={{flex:0.14, flexDirection:"row"}}>
      <TouchableOpacity style={{flex:0.5, borderWidth:settings.borderWidth  ,borderColor:settings.leftColor, flexDirection: "row"}}>
        <Text style={{flex:0.4, textAlign:"center", textAlignVertical:"center"}}> 
          〄
        </Text>
        <Text style={{flex:0.6, textAlign:"center", textAlignVertical:"center"}} > 
          $$val$$
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{flex:0.5, borderWidth:settings.borderWidth , borderColor:settings.rightColor, flexDirection:"row",}} onPress={() => toast()}>
        <Text style={{flex:0.4, textAlign:"center", textAlignVertical:"center", fontSize:70}}> 
          💡
        </Text>
        <Text style={{flex:0.6, textAlign:"center", textAlignVertical:"center"}}> 
          status
        </Text>
      </TouchableOpacity>
    </View>
  );
}




  return (
    <View style={styles.container}>
      <View style={{flex:0.4, alignItems:"center", justifyContent:"center"}}>
        <Button title='Clear' onPress={() => setMessageList("--")}/>
        <Text>{messageList}</Text>
        <StatusBar style="auto" />
      </View>

      <Row color1="blue" color2="pink"/>
      <Row color1="blue" color2="pink"/>
      <Row color1="blue" color2="pink"/>
      <Row color1="blue" color2="pink"/>

      <Text color="green"> status : connected/disconnected</Text>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
