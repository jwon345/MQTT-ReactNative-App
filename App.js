//James Wong 2023

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ToastAndroid, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native' 
import {Client} from 'paho-mqtt';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PureChart from 'react-native-pure-chart-bar-kit';

import React from 'react';
import { AreaChart, LineChart, Grid} from 'react-native-svg-charts';

import LineChartExample from './components/chartExample';

import Svg, {
  Circle,
  Ellipse,
  G,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
  SvgUri
} from 'react-native-svg';




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
client.onConnectionLost = onDisconnect;
client.onMessageArrived = displayMessage;

//reactive variables
const [messageList, setMessageList] = useState("empty");
const [recieveArr, setRecieveArr] = useState([0,0]);
const [lineData, setLineData] = useState([0]);
  //connected or not indicator.
const[isconnected, setisconnceted] = useState(5);

//this use to poll the host every -x seconds to check if the connection is alive
//WIP cant figure it out
//setInterval(() => {{setisconnceted(isconnected + 1); console.log(isconnected)} 1000});

// once connected subscribe to folders needed
function onConnect()
{
  console.log("connected to server");
  setisconnceted(true); 
  client.subscribe("x");
  client.subscribe("y");
}

function onDisconnect()
{
  console.log("disconnected");
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
    
    setLineData([...lineData, parseInt(msg.payloadString)])
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
const Row = ({leftVal, rightVal, leftNavPageName, rightNavPageName, leftMonitorText="unassinged", rightMonitorText="unassinged", navigation}) => {
  return (
    <View style={{flex:0.14, flexDirection:"row"}}>
      <TouchableOpacity style={{flex:0.5, borderWidth:settings.borderWidth  ,borderColor:settings.leftColor, flexDirection: "row"}} onPress={() => navigation.navigate(leftNavPageName)}>
        <View style={{flex:0.5}}>
          <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", fontSize:70}}> 
            〄
          </Text>
          <Text style={{textAlign:"center"}}>
            {leftMonitorText}
          </Text>
        </View>

        <Text style={{flex:0.5, textAlign:"center", textAlignVertical:"center", fontSize:30}} > 
          {leftVal}   
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{flex:0.5, borderWidth:settings.borderWidth , borderColor:settings.rightColor, flexDirection:"row",}} onPress={() => navigation.navigate(rightNavPageName)}>
        <View style={{flex:0.5}}>
          <Text style={{flex:1, textAlign:"center", textAlignVertical:"center", fontSize:70}}> 
          💡
          </Text>
          <Text style={{textAlign:"center"}}>
            {rightMonitorText} 
          </Text>
        </View>

        <Text style={{flex:0.5, textAlign:"center", textAlignVertical:"center", fontSize:30}}> 
          {rightVal}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const MainPage = ({navigation}) => {
  return (
   
      <View style={styles.container}>
        <StatusBar style="auto" />


        <View style={{flex:0.4, justifyContent:"center"}}>
         <LineChartExample></LineChartExample> 
          {/* <Text>
            testing
          </Text>

          <Svg width={(Dimensions.get('window').width)} height="60">
            <Rect
              x={recieveArr[0]}
              y="5"
              width="50"
              height="50"
              fill="rgb(0,0,255)"
              strokeWidth="3"
              stroke="rgb(0,0,0)"
            />
          </Svg> */}
        </View>

        <Row leftVal={recieveArr[0]} rightVal={recieveArr[1]} leftNavPageName="00" rightNavPageName="01" leftMonitorText="Power" rightMonitorText="Outside lights" navigation={navigation}/>
        <Row leftVal={recieveArr[0]} rightVal={recieveArr[1]} navigation={navigation}/>
        <Row leftVal={recieveArr[0]} rightVal={recieveArr[1]} navigation={navigation}/>
        <Row leftVal={recieveArr[0]} rightVal={recieveArr[1]} navigation={navigation}/>

        <Text color="green" style={{textAlign:'center',textAlignVertical:'center', flex:0.04}}> status : {isconnected < 15 ? "Connected" : "Not Connected"} </Text>

      </View>
  );

}

const SecondPage = (navigation) => {
  return (
    <View>
      <Text>Welcome To the Second Page</Text>
      <Text>Welcome To the Second Page</Text>
    </View>
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

 