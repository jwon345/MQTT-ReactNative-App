//James Wong 2023

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ToastAndroid, TouchableOpacity, Vibration, Dimensions} from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native' 
import {Client, } from 'paho-mqtt';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {MaterialIcons, SimpleLineIcons, Ionicons, Feather, MaterialCommunityIcons} from "@expo/vector-icons"

import { LineChart } from 'react-native-chart-kit';
import { send } from 'q';

const client = new Client("52.63.111.219",8080,'/mqtt', 'native-' + parseInt(Math.random()*100000)); // randomise id int

export default function App() {

const settings ={
  leftColor: '#239F',
  rightColor: '#239F',
  borderWidth:1,
}

const graphSettings ={
  spacing: 10,
}


// react page navigation 
const Stack = createNativeStackNavigator();

//mqtt client

//reactive variables
const [recieveArr, setRecieveArr] = useState([0,0,0,0]);
const [lineData, setLineData] = useState([0.0]);
const [lightArrayState, setLightArray] = useState([0,0,0,0]);
  //connected or not indicator.
const[isconnected, setisconnceted] = useState(false);

const [msgTopic, setMsgTopic] = useState("");
const [msgData, setMsgData] = useState(0);


//this use to poll the host every -x seconds to check if the connection is alive
//WIP cant figure it out
//setInterval(() => {{setisconnceted(isconnected + 1); console.log(isconnected)} 1000});

//two clients. one for listening and one for sending
//client.onMessageDelivered
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = displayMessage; 

useEffect(() => {
  console.log("Init");
  client.connect({
    onSuccess:onConnect,
    onFailure:onDisconnect,
    reconnect:true,
  });


}, [])


// updating the line graph 
useEffect(()=> {

   const rubbishData = async()=> {
    // do some new data stuff.
    if (msgTopic === "sensor")
    {
      let temp = recieveArr;
      temp[0] = msgData;
      setRecieveArr([...temp]);
    }
    else if (msgTopic === "light")
    {
      let temp = recieveArr;
      temp[1] = msgData;
      setRecieveArr([...temp]);

      setLightArray(parseInt(temp[1], 16).toString(2).padStart(4,'0'));
      // console.log(parseInt(temp[1], 16).toString(2).padStart(4,'0'));
      // console.log({lightArrayState});
      // console.log(lightArrayState);
    }
    else if (msgTopic === "tempVal")
    {
      let temp = recieveArr;
      temp[2] = msgData;
      setRecieveArr([...temp]);
      if (msgData > 1500)
      {
        if (lineData.length < 20)
        {
          // console.log(msgData);
          let a = [...lineData];  
          // console.log(a);
          setLineData([...lineData, parseFloat(msgData/100)]);
        }
        else
        {
          // console.log("new");
          //removes the first index of the list
          let a = lineData;
          a.shift();

          // console.log(b);
          // console.log(a);
          setLineData([...a, parseFloat(msgData / 100)]);
        }
      }

      console.log("lineUpdate");

    }

    return;
  }

   
  rubbishData();

}, [msgData])

useEffect(() => {
  // do some new data stuff.
  // console.log(lightArrayState);
}, [lightArrayState])

// once connected subscribe to folders needed
function onConnect(responseObj){
  console.log("connected to server");
  client.subscribe("tempVal");
  client.subscribe("sensor")
  client.subscribe("light");
  setisconnceted(true);

  sendMsg(String(parseInt(Math.random() * 1000)), "newClient"); 

}

sendMsg = (sendString, Topic) => {
  client.send(Topic, sendString);
}

function lightToggle(toggleIndex)
{
  temp = [...lightArrayState];
  temp[toggleIndex] = (temp[toggleIndex] == 0 ? 1:0);
  console.log(temp);
  console.log(temp.join(''));
  console.log(parseInt(temp.join(''), 2).toString(16));
  sendMsg(parseInt(temp.join(''), 2).toString(16), "setLight")
}

function onDisconnect(responseObj)
{
  setisconnceted(false);
  console.log("disconnected");
  console.log(responseObj);
}

function onConnectionLost(responseObj)
{
  setisconnceted(false);
  console.log("connection Lost");
  console.log(responseObj);
}


function displayMessage(msg)
{
  // console.log(msg);
  setMsgTopic(msg.topic);
  setMsgData(msg.payloadString);
  // do some new data stuff.

  // if (msg.Topic === "sensor")
  // {
  //   var temp = recieveArr;
  //   temp[0] = msgData;
  //   setRecieveArr([...temp]);
  // }
  // else if (msg.Topic === "light")
  // {
  //   let temp = recieveArr;
  //   temp[1] = msgData;
  //   setRecieveArr([...temp]);

  //   setLightArray(parseInt(temp[1], 16).toString(2).padStart(4,'0'));
  //   // console.log(parseInt(temp[1], 16).toString(2).padStart(4,'0'));
  //   // console.log({lightArrayState});
  //   // console.log(lightArrayState);
  // }
  // else if (msg.Topic === "tempVal")
  // {
  //   var temp = recieveArr;
  //   temp[2] = msg.payload;
  //   setRecieveArr([...temp]);
  //   if (lineData.length < 20)
  //   {
  //     // console.log(msgData);
  //     let a = [...lineData];  
  //     // console.log(a);
  //     setLineData([...lineData, parseFloat(msgData/100)]);
  //   }
  //   else
  //   {
  //     // console.log("new");
  //     //removes the first index of the list
  //     var a = lineData;
  //     a.shift();

  //     // console.log(b);
  //     // console.log(a);
  //     setLineData([...a, parseFloat(msgData / 100)]);
  //   }

  //   console.log("lineUpdate");
  // }
}


//row status viewer layout
const Row = ({leftVal, rightVal, leftNavPageName, toggleIndex, leftMonitorText="unassinged", rightMonitorText="unassinged", navigation, iconLeft="〄",iconRight="💡" }) => {
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

 {/* navigation.navigate(rightNavPageName) */}
      <TouchableOpacity style={{flex:0.5, borderWidth:settings.borderWidth , borderColor:settings.rightColor, flexDirection:"row",}} onPress={() => { lightToggle(toggleIndex); Vibration.vibrate(15)}}>
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
          <View style={{paddingTop:10}}>
            {/* <DecoratorExample data={lineData}></DecoratorExample> */}
            {/* <Text>Find a good chart for react native...</Text>
            <Button title='PRESS' onPress={() => Vibration.vibrate(15)}/> */}
            <LineChart
            data={{
              labels: ["-20s", "-15s", "-10s", "-5s"],
              datasets: [
                {
                  data: lineData
                }
              ]
            }}
            width={Dimensions.get("window").width-40} // from react-native
            height={280}
            // yAxisLabel="$"
            yAxisSuffix="°C"
            yAxisInterval={5} // optional, defaults to 1
            xAxisInterval={7}
            fromNumber={40}
            fromZero={true}
            chartConfig={{
              backgroundColor: "#7FFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 1, // optional, defaults to 2dp

              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "2",
                strokeWidth: "4",
                stroke: "#7FFFFF"
              }
            }}
            bezier
            style={{
              marginVertical: 3,
              borderRadius: 6
            }}
          />
          </View>

        </View>

        <Row 
          leftVal={"non"}
          rightVal={lightArrayState[3] == 1 ? "ON" : "OFF"} 
          leftNavPageName="00"
          rightNavPageName="01"
          leftMonitorText="Power" 
          rightMonitorText="Outside lights" 
          navigation={navigation}
          iconLeft={<Feather name='battery-charging' size={iconSize} color="black"/>}
          iconRight={<MaterialIcons name='lightbulb-outline' size={iconSize} color={lightArrayState[3] == 1 ? "green" : "black"}/>}
          toggleIndex={3}
          />
        <Row 
          leftVal={"none"}
          rightVal={lightArrayState[2] == 1 ? "ON" : "OFF"} 
          leftNavPageName="01"
          rightNavPageName="11"
          leftMonitorText="Voltage" 
          rightMonitorText="Inside lights?" 
          navigation={navigation}
          iconLeft={<SimpleLineIcons name='energy' size={iconSize} color="black"/>}
          iconRight={<MaterialIcons name='lightbulb-outline' size={iconSize}  color={lightArrayState[2] == 1 ? "orange" : "black"}/>}
          toggleIndex={2}
          />

        <Row 
          leftVal={recieveArr[2][0] + recieveArr[2][1] + "." + recieveArr[2][2] + recieveArr[2][3] + "°c" } 
          rightVal={lightArrayState[1] == 1 ? "ON" : "OFF"} 
          leftNavPageName="01"
          rightNavPageName="11"
          leftMonitorText="Temperature" 
          rightMonitorText="Inside lights?" 
          navigation={navigation}
          iconLeft={<Ionicons name='ios-thermometer-outline' size={iconSize} color="black"/>}
          iconRight={<MaterialIcons name='lightbulb-outline' size={iconSize} color={lightArrayState[1] == 1 ? "#0055c4" : "black"}/>}
          toggleIndex={1}
          />

        <Row 
          leftVal={recieveArr[0] > 1500 ? ">1m" : recieveArr[0] + "mm"}
          rightVal={lightArrayState[0] == 1 ? "ON" : "OFF"} 
          leftNavPageName="01"
          rightNavPageName="11"
          leftMonitorText="Sensor Distance" 
          rightMonitorText="Inside lights?" 
          navigation={navigation}
          iconLeft={<MaterialCommunityIcons name='map-marker-distance' size={iconSize} color={recieveArr[0] < 100 ? "red" : "black"}/>}
          iconRight={<MaterialIcons name='lightbulb-outline' size={iconSize} color={lightArrayState[0] == 1 ? "yellow" : "black"}/>}
          toggleIndex={0}
          />

        <Text color="green" style={{textAlign:'center',textAlignVertical:'center', flex:0.04}}> status : {isconnected ? "Connected" : "Not Connected"} </Text>
      </View>
  );

}


const SecondPage = (navigation) => {


  return (
    <View>
      <View style={{margin:10}}>
        <Button title='switch 1 off' onPress={() => sendMsg("0" , "setLight1")}/>
      </View>
      <View style={{margin:10}}>
        <Button title='switch 1 on' onPress={() => sendMsg("1" , "setLight1")}/>
      </View>
      <View style={{margin:10}}>
        <Button title='switch 2 off' onPress={() => sendMsg("0" , "setLight2")}/>
      </View>
      <View style={{margin:10}}>
        <Button title='switch 2 on' onPress={() => sendMsg("1" , "setLight2")}/>
      </View>
      <View style={{margin:10}}>
        <Button title='switch 3 off' onPress={() => sendMsg("0" , "setLight3")}/>
      </View>
      <View style={{margin:10}}>
        <Button title='switch 3 on' onPress={() => sendMsg("1" , "setLight3")}/>
      </View>
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
        <Stack.Screen name="monitor" component={MainPage} options={{title:"Monitor"}} />

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
