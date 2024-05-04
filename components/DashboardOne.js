import 'react-native-gesture-handler';
import React, {Component } from 'react';
import {View, StyleSheet, Image} from 'react-native';
import { LogBox, Platform } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import DashboardScreen from './Division';
import DashboardTwo from './DashboardTwo';
import AppellateDivision from './AppellateDivision';
import HighCourtDivision from './HighCourtDivision';
import Notification from './Notification';
import EntryCaseList from './EntryCaseList';
import BillInformation from './BillInformation';
import VersionMsg from './VersionMsg';
import TotalCaseNotification from './TotalCaseNotification';
import RunningCourt from './RunningCourt';
import RunningCourtButton from './RunningCourtButton';
import TotalCaseButton from './TotalCaseButton';
import SearchListButton from './SearchListButton';
import CaseEntryButton from './CaseEntryButton';
import AppellateCourtlist from './AppellateCourtlist';
import RunningCourtDetails from './RunningCourtDetails';
import TotalCaseAppellateDivision from './TotalCaseAppellateDivision';
import TotalCaseHighCourtDivision from './TotalCaseHighCourtDivision';
import CaseEntryAD from './CaseEntryAD';
import CaseEntryHD from './CaseEntryHD';
import AppellateAccess from './AppellateAccess';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

LogBox.ignoreAllLogs();//Ignore all log notifications
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const HomeScreenStack = ({navigation}) => {
  const tintColor='#031163';
  const headColor='#80c6f1';

  return (
    <Stack.Navigator initialRouteName="DashboardScreen"   
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
       // headerTransparent: true,
      },
      headerTintColor: '#031163',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize:19
      },
    }}
    >
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          title: 'BD Law Service', //Set Header Title
          headerTitleAlign: 'center', 
        }}
      />
      <Stack.Screen
        name="AppellateDivision"
        component={AppellateDivision}       
        options={{
         // headerTransparent: true,
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          title: 'Search List By Date (A.D)', //Set Header Title
          headerTitleAlign: 'center',
                    
        }}    
      />
      <Stack.Screen
        name="AppellateDivisionMsg"
        component={AppellateAccess}       
        options={{
         // headerTransparent: true,
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          title: ' Search List By Date  (A.D)', //Set Header Title
          headerTitleAlign: 'center',         
        }}    
      />
       <Stack.Screen
        name="HighCourtDivision"
        component={HighCourtDivision}       
        options={{
         // headerTransparent: true,
          title: 'Search List By Date (H.D)', //Set Header Title
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center', 
                   
        }}    
      />
      <Stack.Screen
        name="TotalCaseAppellateDivision"
        component={TotalCaseAppellateDivision}       
        options={{
         // headerTransparent: true,
          title: 'Total Case (A.D)', //Set Header Title
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
       <Stack.Screen
        name="TotalCaseAppellateDivisionMsg"
        component={AppellateAccess}       
        options={{
         // headerTransparent: true,
          title: 'Total Case (A.D)', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
       <Stack.Screen
        name="TotalCaseHighCourtDivision"
        component={TotalCaseHighCourtDivision}       
        options={{
         // headerTransparent: true,
          title: 'Total Case (H.D)', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
    <Stack.Screen
        name="TotalCaseNotification"
        component={TotalCaseNotification}       
        options={{
         // headerTransparent: true,
          title: 'New Case Added', //Set Header Title
          headerTintColor:tintColor,
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
      <Stack.Screen
        name="CaseEntryAD"
        component={CaseEntryAD}       
        options={{
         // headerTransparent: true,
          title: 'New Case Entry (A.D)', //Set Header Title
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',  
                 
        }}    
      />
       <Stack.Screen
        name="CaseEntryADMsg"
        component={AppellateAccess}       
        options={{
        //  headerTransparent: true,
          headerTintColor: tintColor,
          title: 'New Case Entry (A.D)', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',  
                 
        }}    
      />
       <Stack.Screen
        name="CaseEntryHD"
        component={CaseEntryHD}       
        options={{
         // headerTransparent: true,
          title: 'New Case Entry (H.D)', //Set Header Title
          headerTitleAlign: 'center', 
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          
               
        }}    
      />
       <Stack.Screen
        name="BillInformation"
        component={BillInformation}       
        options={{
        //  headerTransparent: true,
          title: 'Bill Information List', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',  
        }}    
      />
        <Stack.Screen
        name="Notification"
        component={Notification}       
        options={{
         // headerTransparent: true,
          title: 'Latest Messages List', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',  
             
        }}    
      />
       <Stack.Screen
        name="EntryCaseList"
        component={ EntryCaseList}       
        options={{
        //  headerTransparent: true,
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          title: 'Entry Requisition Slip', //Set Header Title
          headerTitleAlign: 'center',  
             
        }}    
      />
       <Stack.Screen
        name="VersionMsg"
        component={VersionMsg}       
        options={{
        //  headerTransparent: true,
          title: 'App Version Update Massages', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',  
             
        }}    
      />
       <Stack.Screen
        name="RunningCourt"
        component={RunningCourt}       
        options={{
         // headerTransparent: true,
          title: 'Running Court & Result (HD)', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
       <Stack.Screen
        name="AppellateCourtlist"
        component={AppellateCourtlist}       
        options={{
        //  headerTransparent: true,
          title: 'Running Court & Result (AD)', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
       <Stack.Screen
        name="RunningCourtDetails"
        component={RunningCourtDetails}       
        options={{
         // headerTransparent: true,
          title: 'Running Item & Result (HD)', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
       <Stack.Screen
        name="RunningCourtButton"
        component={RunningCourtButton}       
        options={{
        //  headerTransparent: true,
          title: 'Running Court Item & Result', //Set Header Title
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
       <Stack.Screen
        name="TotalCaseButton"
        component={TotalCaseButton}       
        options={{
        //  headerTransparent: true,
          title: 'Total Case List', //Set Header Title
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
      <Stack.Screen
        name="CaseEntryButton"
        component={CaseEntryButton}       
        options={{
         // headerTransparent: true,
         headerTintColor: tintColor,
         headerStyle: styles.stackHeader,
          title: 'New Case Entry', //Set Header Title
          headerTitleAlign: 'center',         
        }}    
      />
      <Stack.Screen
        name="SearchListButton"
        component={SearchListButton}       
        options={{
         // headerTransparent: true,
          title: 'Search List By Date', //Set Header Title
          headerTintColor: tintColor,
          headerStyle: styles.stackHeader,
          headerTitleAlign: 'center',         
        }}    
      />
    </Stack.Navigator>
  );
 
 
};
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="BDLawService"
    
    //  activeColor="#f44336"
    activeColor="#ffffff"
    inactiveColor="#ffffff"
     // barStyle={{ backgroundColor: '#ffffff', height:42, marginTop: -15  }}
     //shifting={true}
     sceneAnimationEnabled={true}
     tabBarBadge={true}
     style={{ 
       backgroundColor: '#fff',
      // height:40,
      //backgroundColor: 'transparent',
      //opacity:0.7
     // paddingTop:-15,
      marginTop:0,
     }}
     barStyle={{ 
      backgroundColor: '#fff',
     // borderRadius: 50,
      marginBottom: 0,
      marginTop: 0,
      paddingHorizontal: 12,
      paddingTop: 0,
      height: 35,
      borderColor: '#fff',
     
      position: "absolute",
     }}
    
     
     
     
    >
      <Tab.Screen
        name="Home"
        component={DashboardTwo}
        options={{
          tabBarLabel: 'Home',
          headerShown:true,
          tabBarIcon: ({ focused }) => (
            <View  style={styles.image_view} >{focused ? <Image style={styles.image_show} source={require('../assets/home-icon-red.png')}                               
                    />:<Image style={styles.image_show} source={require('../assets/home-icon-black.png')} />}</View>
        ),
        }}
      />
      <Tab.Screen
        name="BDLawService"
        component={HomeScreenStack}
        options={{
          tabBarLabel: 'BD Law Service',
          headerShown:false,
           tabBarIcon: ({ focused }) => (
                        <View  style={styles.image_view}  >{focused ? <Image style={styles.image_show} source={require('../assets/Iconselred.png')}                               
                                />:<Image style={styles.image_show} source={require('../assets/sel64.png')} />}</View>
                    ),
        }}
      />
    </Tab.Navigator>
  );
}
export default class DashboardOne extends Component{
  
  render() {
    return (
      
          <MyTabs/>

          
    );
  }
};
const styles = StyleSheet.create({
 stackHeader: { height: 35  },
  image_show: {
   marginTop:-16,
  height:28, width:28,
  },
  image_view: {
    backgroundColor:'#fff',
    marginTop:-16,
    height:50, 
    width:80,
    alignItems: 'center',
    justifyContent: 'center',
   },
  container: {
    flex: 1,
    paddingTop:50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0373BB',
  },
  container2: {
   marginTop:30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0373BB',
  },
  titleText:{
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#419641',
    width: 210,
    height: 44,
    padding: 7,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonR: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: 210,
    height: 44,
    padding: 7,
    borderWidth: 1,
    borderColor: 'red',
    color : "black",
    borderRadius: 10,
    marginBottom: 15,
  },
  causelistbuttonR: {
    alignItems: 'center',
    backgroundColor: 'yellow',
    width: 210,
    height: 44,
    padding: 7,
    borderWidth: 1,
    borderColor: 'red',
    color : "black",
    borderRadius: 10,
    marginBottom: 0,
    marginTop:20,
  },
  buttonMessage: {
    alignItems: 'center',
    backgroundColor: "#FFFFBD",
    width: 210,
    height: 44,
    padding: 7,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText:{
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color:'white'
  },
  buttonTextMessage:{
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',  
  },
  causelistbuttonTextMessage:{
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',  
  },
  UpdateTime:{
    fontSize: 18,
    marginTop:0,
    alignItems: 'center',
    justifyContent: 'center',  
    paddingTop:5,
    color:'white',
  },
  input: {
    width: 210,
    fontSize: 20,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
  },
  fadingContainer: {
    backgroundColor: "blueviolet",
    borderRadius:4,
    margin: 20,
  },
  titleTextTwo:{
    marginTop: -90,
    marginBottom:20,
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    color : "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15
  },
  titleTextOne:{
    marginBottom:90,
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    color : "#fff",
    textShadowColor: 'rgba(255, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15
  },
  titleTextTwos:{
    marginBottom:18,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    color : "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15
  },
  titleTextOnes:{
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    color : "#fff",
    textShadowColor: 'rgba(255, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15
  },
  fadingText: {
    fontSize: 16,
    textAlign: "center",
    color : "#fff",
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
});