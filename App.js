//James Wong 2023

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ToastAndroid, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native' 
import {Client} from 'paho-mqtt';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AreaChart, LineChart, Grid} from 'react-native-svg-charts';


import DecoratorExample from './components/chartExample';

import {MaterialIcons, SimpleLineIcons, Ionicons, Feather} from "@expo/vector-icons"





export default function App() {

const settings =
{
  leftColor: '#239F',
  rightColor: '#239F',
  borderWidth:1, 
}



const Stack = createNativeStackNavigator();


//mqtt client
const client = new Client("52.63.111.219",8080,'/mqtt','native');
client.onConnectionLost = onConnectionLost;
client.on = onDisconnect; 
client.onMessageArrived = displayMessage;


client.connect({
  onSuccess:onConnect,
  // mqttVersion:3,
});

//reactive variables
const [messageList, setMessageList] = useState("empty");
const [recieveArr, setRecieveArr] = useState([0,0]);
const [lineData, setLineData] = useState([0]);
  //connected or not indicator.
const[isconnected, setisconnceted] = useState(20);

//this use to poll the host every -x seconds to check if the connection is alive
//WIP cant figure it out
//setInterval(() => {{setisconnceted(isconnected + 1); console.log(isconnected)} 1000});

// once connected subscribe to folders needed
function onConnect(responseObj)
{
  console.log("connected to server");
  console.log(responseObj);
  client.subscribe("x");
  // client.subscribe("y");
}

function onDisconnect(responseObj)
{
  console.log("disconnected");
  console.log(responseObj);
}

function onConnectionLost(responseObj)
{
  console.log("connection Lost");
  console.log(responseObj);
}


function displayMessage(msg)
{
  console.log(msg.topic);
  console.log(msg.payloadString);
  setMessageList(messageList + msg.payloadString);
  if (msg.topic === "x")
  {
    let temp = recieveArr;
    temp[0] = msg.payloadString;
    setRecieveArr([...temp]);
    
    setLineData([...lineData, parseInt(msg.payloadString)]);
    console.log("setL");
  }
  else if (msg.topic === "y")
  {
    let temp = recieveArr;
    temp[1] = msg.payloadString;
    setRecieveArr([...temp]);
    console.log("setR");
  }

  console.log(recieveArr);
  //msg.topic ? "x" : setRecieveArr(recieveArr)
  //want to make it more declaritive with this and spread operator

  //case by case topic sorted assignment
  //if topic => do this
}

//row status viewer layout
const Row = ({leftVal, rightVal, leftNavPageName, rightNavPageName, leftMonitorText="unassinged", rightMonitorText="unassinged", navigation, iconLeft="〄",iconRight="💡" }) => {
  return (
    <View style={{flex:0.14, flexDirection:"row"}}>
      <TouchableOpacity style={{flex:0.5, borderWidth:settings.borderWidth  ,borderColor:settings.leftColor, flexDirection: "row"}} onPress={() => navigation.navigate(leftNavPageName)}>

        <View style={{flex:0.5}}>
          <Text style={{flex:1, textAlign:"center", textAlignVertical:"center"}}> 
            {iconLeft}
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
          {iconRight}
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

  const iconSize = 75;

  return (
   
      <View style={styles.container}>
        <StatusBar style="auto" />


        <View style={{flex:0.4, justifyContent:"center"}}>
          <View style={{padding:20}}>
            <DecoratorExample data={lineData}></DecoratorExample>
          </View>

        </View>

        <Row 
          leftVal={recieveArr[0]}
          rightVal={recieveArr[1]} 
          leftNavPageName="00"
          rightNavPageName="01"
          leftMonitorText="Power" 
          rightMonitorText="Outside lights" 
          navigation={navigation}
          iconLeft={<Feather name='battery-charging' size={iconSize} color="black"/>}
          iconRight={<MaterialIcons name='lightbulb-outline' size={iconSize} color="black"/>}
          />
        <Row 
          leftVal={recieveArr[0]}
          rightVal={recieveArr[1]} 
          leftNavPageName="01"
          rightNavPageName="11"
          leftMonitorText="Voltage" 
          rightMonitorText="Inside lights?" 
          navigation={navigation}
          iconLeft={<SimpleLineIcons name='energy' size={iconSize} color="black"/>}
          iconRight={<MaterialIcons name='lightbulb-outline' size={iconSize} color="black"/>}
          />

        <Row 
          leftVal={recieveArr[0]}
          rightVal={recieveArr[1]} 
          leftNavPageName="01"
          rightNavPageName="11"
          leftMonitorText="Temperature" 
          rightMonitorText="Inside lights?" 
          navigation={navigation}
          iconLeft={<Ionicons name='ios-thermometer-outline' size={iconSize} color="black"/>}
          iconRight={<MaterialIcons name='lightbulb-outline' size={iconSize} color="black"/>}
          />

        <Row 
          leftVal={recieveArr[0]}
          rightVal={recieveArr[1]} 
          leftNavPageName="01"
          rightNavPageName="11"
          leftMonitorText="Timer" 
          rightMonitorText="Inside lights?" 
          navigation={navigation}
          iconLeft={<Ionicons name='timer-outline' size={iconSize} color="black"/>}
          iconRight={<MaterialIcons name='lightbulb-outline' size={iconSize} color="black"/>}
          />

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

const ThirdPage = (navigation) => {
  return (
    <View>
      <Text> third page </Text>
    </View>
  );
}

const TemperaturePage = (navigation) => {
  return (
    <View>
      <Text> third page </Text>
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

        <Stack.Screen name="10" component={TemperaturePage} options={{title:"Temperature"}}/>
        <Stack.Screen name="11" component={ThirdPage} options={{title:"Control Light 2"}}/>


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

 