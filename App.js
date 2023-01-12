//James Wong 2023

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ToastAndroid, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native' 
import {Client} from 'paho-mqtt';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {

const settings =
{
  leftColor: '#239F',
  rightColor: '#239F',
  borderWidth:1, 
}

const Stack = createNativeStackNavigator();


//mqtt client
const client = new Client("52.63.111.219",9001,'/mqtt','native');
client.connect({onSuccess:onConnect});
client.onMessageArrived = displayMessage;

//reactive variables
const [messageList, setMessageList] = useState("empty");
const [recieveArr, setRecieveArr] = useState([0,0]);

//setting inital message --> this is bad use



// once connected subscribe to folders needed
function onConnect()
{
  //remove testing
  client.subscribe("x");
  client.subscribe("y");
}


function displayMessage(msg)
{
  console.log(msg.topic)
  //console.log(msg.payloadString);
  setMessageList(messageList + msg.payloadString);
  if (msg.topic === "x")
  {
    let temp = recieveArr;
    temp[0] = msg.payloadString;
    setRecieveArr([...temp]);
    console.log("setL");
  }
  else if (msg.topic === "y")
  {
    let temp = recieveArr;
    temp[1] = msg.payloadString;
    setRecieveArr([...temp]);
    console.log("setR")
  }

  console.log(recieveArr);
  //msg.topic ? "x" : setRecieveArr(recieveArr)
  //want to make it more declaritive with this and spread operator

  //case by case topic sorted assignment
  //if topic => do this
}


function toast()
{
  ToastAndroid.show("testing", ToastAndroid.SHORT);
}

//row status viewer layout
const Row = ({leftVal, rightVal, leftNavPageName, rightNavPageName, navigation}) => {
  return (
    <View style={{flex:0.14, flexDirection:"row"}}>
      <TouchableOpacity style={{flex:0.5, borderWidth:settings.borderWidth  ,borderColor:settings.leftColor, flexDirection: "row"}} onPress={() => navigation.navigate(leftNavPageName)}>
        <Text style={{flex:0.4, textAlign:"center", textAlignVertical:"center", fontSize:70}}> 
          〄
        </Text>
        <Text style={{flex:0.6, textAlign:"center", textAlignVertical:"center"}} > 
          {leftVal}   
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{flex:0.5, borderWidth:settings.borderWidth , borderColor:settings.rightColor, flexDirection:"row",}} onPress={() => navigation.navigate(rightNavPageName)}>
        <Text style={{flex:0.4, textAlign:"center", textAlignVertical:"center", fontSize:70}}> 
          💡
        </Text>
        <Text style={{flex:0.6, textAlign:"center", textAlignVertical:"center"}}> 
          {rightVal}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const MainPage = ({navigation}) => {
  return (
   
      <View style={styles.container}>
        <View style={{flex:0.4, alignItems:"center", justifyContent:"center"}}>
          <Button title='Clear' onPress={() => setMessageList("--")}/>
          <StatusBar style="auto" />
        </View>

        <Row leftVal={recieveArr[0]} rightVal={recieveArr[1]} leftNavPageName="00" rightNavPageName="01" navigation={navigation}/>
        <Row leftVal={recieveArr[0]} rightVal={recieveArr[1]} navigation={navigation}/>
        <Row leftVal={recieveArr[0]} rightVal={recieveArr[1]} navigation={navigation}/>
        <Row leftVal={recieveArr[0]} rightVal={recieveArr[1]} navigation={navigation}/>

        <Text color="green"> status : connected/disconnected</Text>

      </View>
  );

}

const SecondPage = (navigation) => {
  return (
    <Text>Welcome To the Second Page</Text>
  );

}

  //stack naming convention follows the corresponding 2x6 matrix indexing from 0
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="monitor" component={MainPage} options={{title:"Mointor"}}/>
        <Stack.Screen name="00" component={SecondPage} options={{title:"Control First top Left"}}/>
        <Stack.Screen name="01" component={SecondPage} options={{title:"Control Light 1"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
