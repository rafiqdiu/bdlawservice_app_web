
import React, { Component,useState, useEffect, useRef } from 'react';
import { Redirect,Platform, Alert,Linking, Button, Text, TouchableOpacity, TextInput, View, StyleSheet,Image,AppState } from 'react-native';

import Registration from './components/Registration';
import Login from './components/Login';
import Division from './components/Division';
import Otp from './components/Otp';
import AppellateDivision from './components/AppellateDivision';
import HighCourtDivision from './components/HighCourtDivision';
import TotalCaseAppellateDivision from './components/TotalCaseAppellateDivision';
import TotalCaseHighCourtDivision from './components/TotalCaseHighCourtDivision';
import Notification from './components/Notification';
import RunningCourt from './components/RunningCourt';
import AppellateCourtlist from './components/AppellateCourtlist';
import RunningCourtDetails from './components/RunningCourtDetails';
import DashboardOne from './components/DashboardOne';
//import DashboardTwo from './components/DashboardTwo';
//import * as Notifications from 'expo-notifications';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//import VersionCheck from 'react-native-version-check-expo';
//import * as Linking from 'expo-linking';
//import RootNavigation from './components/RootNavigation.js';
//import isReadyRef   from './components/RootNavigation.js';

const RootStack = createStackNavigator();

export default function App() {
  useEffect(() => {
  //   if(Platform.OS === 'android' ){
  //   VersionCheck.getLatestVersion({
  //     provider: 'playStore'  // for Android
  //   });
   
  // // checkUpdateNeeded();
  // }
  }, []);

  
  // const checkUpdateNeeded= async () => {
  //   try {
  //     let updateNeeded = await VersionCheck.needUpdate();
  //     //console.log('robeen');
  //    // console.log(updateNeeded);
  //    // alert(updateNeeded);
  //     if (updateNeeded.isNeeded) {
  //       Linking.openURL(updateNeeded.storeUrl);
  //         // Alert.alert(
  //         //        'Please Update The New Version',
  //         //        'BD Law Service মোবাইল App টি আপডেট করে নিন।', 
  //         //        [{
  //         //            text: 'Update',
  //         //            onPress: ()=> {
  //         //             BackHandler.exitApp();
  //         //             Linking.openURL(updateNeeded.storeUrl);
  //         //            },
                     
  //         //        }, 
  //         //       ], 
  //         //       {
  //         //            cancelable: false
  //         //        }
  //         //     );
  //     }
  
  //   } catch (error) {
  //     return error;
  //   }
  // };  
 
        return (
          <NavigationContainer>
            <RootStack.Navigator>
              <RootStack.Screen name="Login" component={Login} options={{ title: "Login", headerTitleAlign: "center",  headerStyle: {
            //backgroundColor: '#307ecc', //Set Header color
            backgroundColor: '#ffffff', //Set Header color
            height:30,
            color:'#000'
          },
          headerTintColor: '#070707', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'normal',
            color:'#000' //Set Header text style
          },  }} />
              <RootStack.Screen name="Registration" component={Registration} options={{ title: "Registration", headerTitleAlign: "center" }} />
              <RootStack.Screen name="Division" component={Division} options={{ title: "Division", headerTitleAlign: "center" }} />
              <RootStack.Screen name="Otp" component={Otp} options={{ title: "Otp", headerTitleAlign: "center" }} />
              <RootStack.Screen name="AppellateDivision" component={AppellateDivision} options={{ title: "Appellate Division", headerTitleAlign: "center" }} />
              <RootStack.Screen name="HighCourtDivision" component={HighCourtDivision} options={{ title: "High Court Division", headerTitleAlign: "center" }} />
              <RootStack.Screen name="TotalCaseAppellateDivision" component={TotalCaseAppellateDivision} options={{ title: "Total Case Appellate Division", headerTitleAlign: "center" }} />
              <RootStack.Screen name="TotalCaseHighCourtDivision" component={TotalCaseHighCourtDivision} options={{ title: "Total Case High Court Division", headerTitleAlign: "center" }} />
              <RootStack.Screen name="Notification" component={Notification} options={{ title: "Messages", headerTitleAlign: "center" }} />
              <RootStack.Screen name="RunningCourt" component={RunningCourt} options={{ title: "Case List: Index Page (HD)", headerTitleAlign: "left" }} />
              <RootStack.Screen name="RunningCourtDetails" component={RunningCourtDetails} options={{ title: "Case List: Court Page", headerTitleAlign: "center" }} />
              <RootStack.Screen name="AppellateCourtlist" component={AppellateCourtlist} options={{ title: "Case List Index Page (AD)", headerTitleAlign: "left" }} />
              <RootStack.Screen name="DashboardOne" component={DashboardOne} options={{ title: "Dashboard",  headerShown:false, headerTitleAlign: "left" }} />

            </RootStack.Navigator>
          
          </NavigationContainer>
        );
 
}