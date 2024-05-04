import 'react-native-gesture-handler';
import Constants from 'expo-constants';
import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity,Linking, Pressable, ScrollView,TextInput, AppState, View, StyleSheet,Image,Animated, YellowBox, ActivityIndicator} from 'react-native';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device';
import { LogBox, Platform } from 'react-native';
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE, BASE_URL_SIDDIQUE_ADMIN} from './BaseUrl';
//import { ThemedButton } from 'react-native-really-awesome-button';
import { LinearGradient } from 'expo-linear-gradient';
import SITE_BANNER_VERTICAL_IMAGE from '../assets/sel.png';
import * as Animatable from 'react-native-animatable';
import TopBar from './TopBar';
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
LogBox.ignoreAllLogs();//Ignore all log notifications

const projectId = Constants.expoConfig.extra.eas.projectId;
export default class RunningCourtButton extends Component{    //Start code for expo push notification
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
            expoToken:'',
            mobDeviceId:'',
            isNetConnected:'',
            fadeAnimation: new Animated.Value(0),
            redirectUrl:'',
            Linking:'',
            notification: {},
            l_id:0,
            TimeFormat: "hh:mm a",
            dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
            UpdateTime:'',
            loader: false,
            visible:false,
            trirtyMinuteAlert:false,
            lastupdatetime:'',
            is_insert_val:0,
            is_index_page:0,
            is_court_page:0,
            totalCaseList:[],
            notificationData:[],
            updateMsgcount:0,
            Adaccess:'',
            paymentCount:0,
            LmsgCount:0,
            hdRequestData:[],
            adRequestData:[],
            buttonColor1:['#68bac0', '#5B80AF', '#44648E'],
            buttonColor2:['#EAFAF9', '#c1edfa', '#a0d4f8'],
            buttonColor3:['#fffd0e', '#ffd700', '#ffb900'],
            buttonColor4:['#FFFF', '#FFFFdd', '#FFFFBD'],
            width: new Animated.Value(30),
            height: new Animated.Value(30),
        };
    }
    _loadInitialState = async () => {
      try {
        const value = await AsyncStorage.getItem("userCode");
        if (value !== null) {
          return value;
        }
      } catch (error) {
        return error;
      }
    };
    getUpdateTime = async () => {
      try {
        const value = await AsyncStorage.getItem("updateTime");
        if (value !== null) {
          return value;
        }
      } catch (error) {
        return error;
      }
    };
    GetTotalHDData(lawyerCode) {
      axios
        .post(
          `${BASE_URL_SIDDIQUE_ADMIN}/public/api/notificationlist?current_laywerCode=${lawyerCode}`
        )
        .then((res) => {
          if (this._isMounted) {
            this.setState({ totalCaseList: res.data });            
          }  
        }).catch((error) => {
          console.log(error);
        });
    }
   componentWillUnmount() {
    this._isMounted = false;

    }
  componentDidMount() {
    this._isMounted = true;
    window.history.pushState(null, null, document.URL);
    if (this._isMounted) {
      axios
      .get(
        `${BASE_URL_SIDDIQUE}/public/api/getCaseResultRunningInsert`
      )
      .then((resData) => {
        this.setState({ lastupdatetime: resData.data.cureentUpdateTime});
        this.setState({ is_index_page: resData.data.is_index_page});
        this.setState({ is_court_page: resData.data.is_court_page});
        if(resData.data.diffTime <= 30)
        {
          this.setState({ trirtyMinuteAlert: true});
        }
        else
        {
          this.setState({ trirtyMinuteAlert: false});
        }
        if(resData.data.is_insert==0){
          this.setState({ loader: true});
          this.setState({ is_insert_val: 0});
        }
        else
        {
          this.setState({ loader: false});
          this.setState({ is_insert_val: 1});
        }
      }).catch((error) => {
        console.log(error);
      });
      this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        this.setState({ l_id: value});
        this.GetTotalHDData(value);
        this.setState({ loader: true});
        axios
        .post(
          `${BASE_URL_SIDDIQUE_ADMIN}/public/api/lawyerinfo?lawyerCode=${value}`
        )
        .then((resData) => {
          this.setState({ Adaccess: resData.data.ad_user});
          this.setState({ loader: false});
      }).catch((error) => {
        console.log(error);
      });
      axios
      .get(
        `${BASE_URL_SIDDIQUE}/public/api/getNotifications_app?l_id=${value}`
      )
      .then((resData) => {
        this.setState({ notificationData: resData.data[0] });
        this.setState({ loader: false});
      });
      
      })
      this.getUpdateTime() // returns promise, so process in chain
      .then((value) => {
        this.setState({ UpdateTime: value})
      })
        Animated.timing(this.state.fadeAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true
        }).start();
        NetInfo.fetch().then(state => {
          if (this._isMounted) {
            this.setState({ isNetConnected: state.isConnected });
          }
        });
        registerForPushNotificationsAsync();        
        this._notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
      }
  }

  insert_case_result() {
    if (this._isMounted) {
      this.setState({ loader: true});
      this.setState({ is_insert_val: 0});
        axios
          .get(
            `${BASE_URL_BDLAW}/public/api/insert_court_case_result`
          )
          .then((resData) => {            
            this.setState({ loader: false});
            var hours = new Date().toLocaleString(); //Current Hours    // var min = new Date().toLocaleString(); //Current Minutes
            var ctime = moment(hours).format(this.state.TimeFormat); //moment(); 
            AsyncStorage.setItem('updateTime', (ctime));
           alert("Successfully Updated");
           this.setState({ loader: false});
           this.setState({ is_insert_val: 1});
           this.componentDidMount();
          }).catch((error) => {
            this.setState({ loader: false});
            console.log(error);
          });
    }
  }
  showPopUp = () =>
  Alert.alert(
    "Alert",
    "আপডেট হয়েছে যে ৩০ মিনিট হয় নাই তার পরও আপডেট করবেন ?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => this.insert_case_result() }
    ]
  );
  showPopUpRunning = () =>
  Alert.alert(
    "Alert",
    "Update Running Please Wait!",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => console.log("Cancel Pressed") }
    ]
  );
  async componentWillUnmount() {
    this._isMounted = false;
  }
  async componentDidMount() {
    this._isMounted = true;
    Animated.timing(
      this.state.width, // The animated value to drive
       {
         toValue: 150, // Animate to opacity: 1 (opaque)
         duration: 450, // Make it take a while
         useNativeDriver: false,
       },
     ).start(); // Starts the animation
     Animated.timing(
       this.state.height, // The animated value to drive
       {
         toValue: 150, // Animate to opacity: 1 (opaque)
         duration: 10000, // Make it take a while
         useNativeDriver: false,
       },
     ).start(); // Starts the animation
      axios
      .get(
        `${BASE_URL_SIDDIQUE}/public/api/getCaseResultRunningInsert`
      )
      .then((resData) => {
        this.setState({ lastupdatetime: resData.data.cureentUpdateTime});
        this.setState({ is_index_page: resData.data.is_index_page});
        this.setState({ is_court_page: resData.data.is_court_page});
        if(resData.data.diffTime <= 30)
        {
          this.setState({ trirtyMinuteAlert: true});
        }
        else
        {
          this.setState({ trirtyMinuteAlert: false});
        }
        if(resData.data.is_insert==0){
          this.setState({ loader: true});
          this.setState({ is_insert_val: 0});
        }
        else
        {
          this.setState({ loader: false});
          this.setState({ is_insert_val: 1});
        }
      }).catch((error) => {
        console.log(error);
      });
  }  //End code for expo push notification 
  openMenu  = () => {
    this.setState({ visible: true});
  };
  closeMenu   = () => {
    this.setState({ visible: false});
  };
  render() {
    return (<> 
      <View style={styles.container}> 
      <Image
        source={ SITE_BANNER_VERTICAL_IMAGE}
        style={{
          marginTop:240,
          borderRadius:75,
          width: 100,
          height: 100,
          position: 'absolute',
        }}
      />  
     
      <View style={{flex:1, 
    alignItems: 'center',
    paddingTop: 5,}}>
      <Text style={styles.titleTextOnes}>Running Court Item & Result</Text>
       <Text style={styles.titleTextTwos }>(As Per Supreme Court Cause List/Website)</Text>
       {this.state.is_index_page == 1 && 
          // <TouchableOpacity
          //     style={styles.buttonR}
          //     onPress={() => this.props.navigation.navigate('AppellateCourtlist')}
          //   >
          //   <Text style={styles.buttonTextMessage}>Appellate Division</Text>
          //   </TouchableOpacity>
            
            <TouchableOpacity      onPress={() => this.props.navigation.navigate('AppellateCourtlist')}
            style={styles.buttonAll}          
             ><LinearGradient 
               colors={this.state.buttonColor4}
               style={{ ...StyleSheet.absoluteFillObject }} 
              >
             <Text style={styles.butText}>
             Appellate Division
               </Text>
               </LinearGradient>
           </TouchableOpacity>
        }
        <View style={styles.BottomM}></View>
        {this.state.is_court_page == 1 && 
            // <TouchableOpacity
            //     style={styles.buttonR}
            //     onPress={() =>this.props.navigation.navigate('RunningCourt')}
            //   >
            //   <Text style={styles.buttonTextMessage}>High Court Division</Text>
            // </TouchableOpacity>
           
           <TouchableOpacity     onPress={() =>this.props.navigation.navigate('RunningCourt')}
           style={styles.buttonAll}          
            ><LinearGradient 
              colors={this.state.buttonColor2}
              style={{ ...StyleSheet.absoluteFillObject }} 
             >
            <Text style={styles.butText}>
            High Court Division
              </Text>
              </LinearGradient>
          </TouchableOpacity>
          
        }
      {this.state.isNetConnected == false &&
        <Animated.View
          style={[
            styles.fadingContainer,
              {
                opacity: this.state.fadeAnimation
              }
            ]}
          >     
            <Text style={styles.fadingText}>You are currently offline, Please check your internet connection.</Text>
        </Animated.View>
         }
</View>
<Text  style={{fontSize:30, color:'#fff', fontWeight:'bold',textAlign:'center' }} direction="alternate">সফলতার ২০ বছর{'\n'}পরিবর্তনে প্রতিশ্রুতিবদ্ধ</Text>
         <View style={{marginBottom:150}}></View>
     </View>
     </>
  );
  }
};
const styles = StyleSheet.create({
  buttonAll:{
    height:60,
    width:260
  },
  BottomM:{marginBottom:15},
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  butText1: {
    fontSize: 22,
    //fontFamily: 'Gill Sans',
fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
    paddingHorizontal:0,
    color: '#071d9b',
    backgroundColor: 'transparent',
  },
  butText: {
    fontSize: 22,
    //fontFamily: 'Gill Sans',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    paddingHorizontal:0,
    color: '#071d9b',
    backgroundColor: 'transparent',
  },
  MenuButton:{
    flexDirection:'row',
    width:responsiveWidth(70),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:10 ,
    paddingHorizontal: 5,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#ff0',
  },
  Menutext: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#000',
  },
  container: {
    flex: 1,
    paddingTop:10,
    position:'relative',
    alignItems: 'center',
    backgroundColor: '#0373BB',
  },
  containers: {
    flex:1,
    paddingTop:30,
    zIndex:100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0373BB',
  },
  container2: {
   marginTop:15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0373BB',
    width:'100%' 
  },
  titleText:{
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  buttontop: {
    alignItems: 'center',
    backgroundColor: '#419641',
    width: responsiveWidth(45),
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    textAlignVertical:'center',
    paddingVertical:10
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
    marginTop:15,
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
  buttonMessage1: {
    alignItems: 'center',
    backgroundColor: "#FFFFBD",
    flexDirection:'row',
    paddingVertical: 8,
    paddingHorizontal:25,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    marginBottom: 0,
    width:250,
    zIndex:-1,
  },
  buttonMessage11: {
    alignItems: 'center',
    backgroundColor: "#FFFFBD",
    flexDirection:'row',
    paddingVertical: 3,
    paddingHorizontal:12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    marginBottom: 10,
    width:250,
    zIndex:-1,
  },
  buttonMessage: {
    alignItems: 'center',
    backgroundColor: "#FFFFBD",
    paddingVertical: 7,
    paddingHorizontal:25,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    marginBottom: 12,
    zIndex:-1,
  },
  buttonText:{
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color:'white',
    width:'100%'
  },
  buttonTextTop:{
    fontSize: 17,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color:'white',
    width:'100%'
  },
  buttonTextMessage:{
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'center',
    width:'100%' 
  },
  buttonTextMessage1:{
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'left',
    width:'74%',
    textAlignVertical:'center' 
  },
  buttonTextMessage111:{
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'left',
    width:'100%',
    textAlignVertical:'center' 
  },
  buttonTextMessage11:{
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'left',
    width:'100%',
    textAlignVertical:'center' 
  },
  buttonTextMessage2:{
    fontSize: 30,
    marginRight:10,
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'left',
    width:20,
    textAlignVertical:'center' 
  },
  causelistbuttonTextMessage:{
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'center',
    width:'100%' 
  },
  UpdateTime:{
    fontSize: 18,
    marginTop:0,
    alignItems: 'center',
    justifyContent: 'center',  
    textAlign: 'center',
    paddingTop:5,
    color:'white',
    width:'100%' 
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
    marginBottom:10,
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color : "#fff",
    textShadowColor: 'rgba(255, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15,
    width:'100%' 
  },
    titleTexttotal:{
    marginBottom:10,
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color : "#fff",
    textShadowColor: 'rgba(255, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15,
    width:'100%' 
  },
  titleTextTwos:{
    marginBottom:18,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color : "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15,
    width:550 
  },
    titleTextOnes:{
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color : "#fff",
    textShadowColor: 'rgba(255, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15,
    width:500 
  },
  fadingText: {
    fontSize: 16,
    textAlign: "center",
    color : "#fff",
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
});