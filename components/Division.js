import 'react-native-gesture-handler';
import Constants from 'expo-constants';
import React, {Component } from 'react';
import { Alert, Text, TouchableOpacity, Pressable, ScrollView, View, StyleSheet, Animated, ActivityIndicator} from 'react-native';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device';
import { LogBox, Platform } from 'react-native';
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE, BASE_URL_SIDDIQUE_ADMIN} from './BaseUrl';
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions";
import {Menu, PaperProvider} from 'react-native-paper';
//import { ThemedButton } from 'react-native-really-awesome-button';
import { LinearGradient } from 'expo-linear-gradient';
LogBox.ignoreAllLogs();//Ignore all log notifications
setTimeout(() => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

}, 1300);

const projectId = Constants.expoConfig.extra.eas.projectId;
export default class Division extends Component{
  _isMounted = false; //Start code for expo push notification
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
            buttonColor3:['#FFFFB7', '#FFEA61', '#FFDD3C'],
            buttonColor4:['#FFFF', '#FFFFdd', '#FFFFBD'],
            buttonColor5:['#FFFFB7', '#FFEA61', '#FFD400'],
        };
        this.onPopstate = this.onPopstate.bind(this)
    }
    onPopstate() {
      this.setState({ isBack: true });   
      this.props.navigation.goBack(null);
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
      this._notificationReceivedSubscription.remove();
      this._notificationResponseSubscription.remove();
      this.setState({ notification: {} });
    }
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      window.history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.onPopstate);

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
 _handleNotification = notification => {
    if (this._isMounted) {
        this.setState({ notification: notification });
        var str = this.state.notification.request.content.title;
        if(str.includes('High') == true)
        {
          this.props.navigation.navigate("HighCourtDivision");
        }
        if(str.includes('Appellate') == true)
        {
          this.props.navigation.navigate("AppellateDivision");
        }
        if(str.includes('Notification') == true)
        {
          this.props.navigation.navigate("Notification");
        }
        if(str.includes('NewCase') == true)
        {
          this.props.navigation.navigate("TotalCaseNotification");
        }
    }
};
  _handleNotificationResponse = response => {
    setTimeout(() => {
      if (this._isMounted) {
          var str = response.notification.request.content.title;
          if(str.includes('High') == true)
          {
            this.props.navigation.navigate("HighCourtDivision");
          }
          if(str.includes('Appellate') == true)
          {
            this.props.navigation.navigate("AppellateDivision");
          }
          if(str.includes('Notification') == true)
          {
            this.props.navigation.navigate("Notification");
          }
          if(str.includes('NewCase') == true)
          {
            this.props.navigation.navigate("TotalCaseNotification");
          }
      }
    }, 1000);
  };
  registerForPushNotificationsAsync = async () => {
      if (this._isMounted) {
          let token;
          if (Constants.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                  alert('Failed to get push token for push notification!');
                  return;
                }
                try {                  
                    const token = (await Notifications.getExpoPushTokenAsync({
                      projectId
                    })).data;
                    //console.log(token);                
                    this.setState({ expoToken: token });                 
                  } catch (error)                   
                  {
                    console.log(error);
                  }  
                try {
                 let DeviceInformation = Device.deviceName.replace(/ /g, '')+"-"+Device.productName+"-"+Device.osVersion+"-"+Device.osBuildId;
                const appVersion = Constants.expoConfig.version; // from app.json
                const appVersionCode = Constants.expoConfig.android.versionCode; // from app.json
                axios
                .post(
                  `${BASE_URL_SIDDIQUE}/public/api/api_token_update?Username=${this.currentUser}&apiToken=${this.state.expoToken}&DeviceInformation=${DeviceInformation}&appVersion=${appVersion}&appVersionCode=${appVersionCode}`
                )
                .then((res) => {
                }).catch((error) => {
                  console.log(error);
                });
              } catch (error) {
                  console.log(error)
                }
              }
              else {
                alert('Must use physical device for Push Notifications');
              }
              if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                  name: 'default',
                  importance: Notifications.AndroidImportance.MAX,
                  vibrationPattern: [0, 250, 250, 250],
                  lightColor: '#FF231F7C',
                });
              } 
        }
  };

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
            var hours = new Date().toLocaleString(); //Current Hours
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
    this._notificationReceivedSubscription.remove();
    this._notificationResponseSubscription.remove();
    this.setState({ notification: {} });
  }
  async componentDidMount() {
    this._isMounted = true;
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
        this.setState({ l_id: value})
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
      });
        axios
        .get(
          `${BASE_URL_SIDDIQUE}/public/api/getNotifications_payment_count?l_id=${value}`
        )
        .then((resData) => {
          this.setState({ paymentCount: resData.data});
        }).catch((error) => {
          console.log(error);
        });
        axios
        .get(
          `${BASE_URL_SIDDIQUE}/public/api/getNotifications_common?l_id=${value}&details=0`
        )
        .then((resData) => {
          this.setState({ LmsgCount: resData.data});
        
        }).catch((error) => {
          console.log(error);
        });
        axios
        .get(
          `${BASE_URL_SIDDIQUE}/public/api/getNewCaseRequest?l_id=${value}&division=2`
        )
        .then((resData) => {
          if (this._isMounted) {
            this.setState({ hdRequestData: resData.data });
            this.setState({ loader: false});
          }
        }).catch((error) => {
          console.log(error);
        });
        axios
        .get(
          `${BASE_URL_SIDDIQUE}/public/api/getNewCaseRequest?l_id=${value}&division=1`
        )
        .then((resData) => {
          if (this._isMounted) {
            this.setState({ adRequestData: resData.data });
            this.setState({ loader: false});
          }
        }).catch((error) => {
          console.log(error);
          this.setState({ loader: false});
        });
      });
      this.getUpdateTime() // returns promise, so process in chain
      .then((value) => {
        this.setState({ UpdateTime: value})
      })
      this._notificationReceivedSubscription =  Notifications.addNotificationReceivedListener(this._handleNotification);
      this._notificationResponseSubscription =  Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
      this.currentUser = await AsyncStorage.getItem("userCode");
      await this.registerForPushNotificationsAsync();
    }
  }
  //End code for expo push notification 
openMenu  = () => {
  this.setState({ visible: true});
};
closeMenu   = () => {
  this.setState({ visible: false});
};


  render() {
    return (<>
     <View style={{ flex:1, height:responsiveHeight(100)}}>
    <ScrollView style={{ backgroundColor:'#0373BB', }}>
   
    {/* <View style={styles.containers}>
  <PaperProvider>
      <View
        style={{
          flex:1 ,
          flexDirection: 'row',
        backgroundColor:'#0373BB'
        }}>
        <Menu  
        style={{ marginTop: 0,backgroundColor:'#0373BB', marginLeft:-responsiveWidth(12.2), paddingBottom:-20, 
         marginTop:-67, width:responsiveWidth(68.5),  zIndex:100}}    
          visible={this.state.visible}
          onDismiss={this.closeMenu}
        dark={true}
          anchor={
            <Pressable style={styles.MenuButton} onPress={this.openMenu} >
            <Text style={styles.Menutext}>Search List User Menu    </Text><Text style={{fontSize:22, marginTop:-5}}>{this.state.visible?"🔼":"🔽"}</Text>
          </Pressable>}>
          <Menu.Item titleStyle={{fontSize:19, color: '#ff0', fontWeight:'bold'}}  style={{width:responsiveWidth(72), backgroundColor:'#086eb3',marginTop:-3,   marginBottom:5,borderWidth:1, borderColor:'#ff0', borderRadius:8,  }}   title="Search List By Date        ▼"  />
          <Menu.Item titleStyle={{ color: '#fff', fontWeight:'bold'}} style={{width:responsiveWidth(72),backgroundColor:'#636262', marginBottom:5 ,borderWidth:1, borderColor:'#fff', borderRadius:8, }} onPress={() => { this.props.navigation.navigate('HighCourtDivision')}} title="           High Court Division" />
          <Menu.Item titleStyle={{ color: '#fff', fontWeight:'bold'}} style={{width:responsiveWidth(72),backgroundColor:'#636262', marginBottom:5,borderWidth:1, borderColor:'#fff', borderRadius:8,  }} onPress={() => { this.state.Adaccess==="0"?this.props.navigation.navigate('AppellateDivisionMsg'):this.props.navigation.navigate('AppellateDivision')}} title="           Appellate Division" />
          <Menu.Item titleStyle={{fontSize:19, color: '#ff0',fontWeight:'bold'}} style={{width:responsiveWidth(72),backgroundColor:'#086eb3',color: '#24611e', marginBottom:5,borderWidth:1, borderColor:'#ff0', borderRadius:8,}}  title="New Case Entry              ▼" /> 
          <Menu.Item titleStyle={{ color: '#fff', fontWeight:'bold'}} style={{width:responsiveWidth(72),backgroundColor:'#636262', marginBottom:5, borderWidth:1, borderColor:'#fff', borderRadius:8, }} onPress={() => {this.props.navigation.navigate('CaseEntryHD')}} title="           High Court Division" />
          <Menu.Item titleStyle={{ color: '#fff', fontWeight:'bold'}}  style={{width:responsiveWidth(72),backgroundColor:'#636262', marginBottom:5,borderWidth:1, borderColor:'#fff', borderRadius:8,  }} onPress={() => {this.state.Adaccess==="0"?this.props.navigation.navigate('CaseEntryADMsg'):this.props.navigation.navigate('CaseEntryAD')}} title="           Appellate Division" />
          <Menu.Item titleStyle={{fontSize:19, color: '#ff0',fontWeight:'bold'}}  style={{width:responsiveWidth(72),backgroundColor:'#086eb3',color: '#24611e', marginBottom:5,borderWidth:1, borderColor:'#ff0', borderRadius:8,}}  title="Total Case List                ▼" /> 
          <Menu.Item titleStyle={{ color: '#fff', fontWeight:'bold'}} style={{width:responsiveWidth(72),backgroundColor:'#636262', marginBottom:5, borderWidth:1, borderColor:'#fff', borderRadius:8, }} onPress={() => { this.props.navigation.navigate('TotalCaseHighCourtDivision')}} title="           High Court Division" />
          <Menu.Item titleStyle={{ color: '#fff', fontWeight:'bold'}}  style={{width:responsiveWidth(72),backgroundColor:'#636262', marginBottom:-7,borderWidth:1, borderColor:'#fff', borderRadius:8, }} onPress={() => { this.state.Adaccess==="0"?this.props.navigation.navigate('TotalCaseAppellateDivisionMsg'):this.props.navigation.navigate('TotalCaseAppellateDivision')}} title="           Appellate Division" />      
        </Menu>
      </View>
    </PaperProvider>
    </View> */}

      <View style={styles.container}>
      <View style={{ marginTop:20, marginBottom: 0 }}>
      <View style={{ marginBottom: 20 }}></View>
      <View  style={{ flexDirection:'column'}}>
      <TouchableOpacity   onPress={() => this.props.navigation.navigate('SearchListButton')}     
         style={styles.buttonAll}          
          ><LinearGradient 
            colors={this.state.buttonColor3}
            style={{ ...StyleSheet.absoluteFillObject }} 
           >
          <Text style={styles.butText1}>
          Search List By Date 
            </Text>
            </LinearGradient>
        </TouchableOpacity>
     
      <View style={styles.BottomM}></View> 
     

        <TouchableOpacity   onPress={() => this.props.navigation.navigate('CaseEntryButton')}    
         style={styles.buttonAll}          
          ><LinearGradient 
            colors={this.state.buttonColor2}
            style={{ ...StyleSheet.absoluteFillObject }} 
           >
          <Text style={styles.butText1}>
          New Case Entry 
            </Text>
            </LinearGradient>
        </TouchableOpacity>


      <View style={styles.BottomM}></View>
    <View style={{flexDirection:'row'}}>
     
        <TouchableOpacity     onPress={() => this.props.navigation.navigate('EntryCaseList', {param: 1})}    
         style={styles.buttonAll}          
          ><LinearGradient 
            colors={this.state.buttonColor2}
            style={{ ...StyleSheet.absoluteFillObject }} 
           >
          <Text style={styles.butText1}>
          Entry Requisition Slip
            </Text>
            </LinearGradient>
        </TouchableOpacity>
        <View style={styles.red_circle}>
          <Text style={styles.red_circle_t} >{this.state.hdRequestData?.length + this.state.adRequestData?.length}
          </Text>
        </View>
      </View>


      <View style={styles.BottomM}></View>

      <View style={{flexDirection:'row'}}>      
        <TouchableOpacity     onPress={() => this.props.navigation.navigate('TotalCaseNotification')}   
         style={styles.buttonAll}          
          ><LinearGradient 
            colors={this.state.buttonColor2}
            style={{ ...StyleSheet.absoluteFillObject }} 
           >
          <Text style={styles.butText1}>New Case Added</Text>
            </LinearGradient>
        </TouchableOpacity>
        <View style={styles.red_circle}>
          <Text style={styles.red_circle_t} >{this.state.totalCaseList.length > 0?this.state.totalCaseList.length:0}
          </Text>
        </View>
      </View>
      
      <View style={styles.BottomM}></View>
      
        <TouchableOpacity     onPress={() => this.props.navigation.navigate('TotalCaseButton')}   
         style={styles.buttonAll}          
          ><LinearGradient 
            colors={this.state.buttonColor2}
            style={{ ...StyleSheet.absoluteFillObject }} 
           >
          <Text style={styles.butText1}>Total Case List</Text>
            </LinearGradient>
        </TouchableOpacity>
      <View style={styles.BottomM}></View>

      <View style={{flexDirection:'row'}}>      
        <TouchableOpacity      onPress={() => this.props.navigation.navigate('Notification', {param: 1})}   
         style={styles.buttonAll}          
          ><LinearGradient 
            colors={this.state.buttonColor4}
            style={{ ...StyleSheet.absoluteFillObject }} 
           >
          <Text style={styles.butText1}>Latest Message</Text>
            </LinearGradient>
        </TouchableOpacity>
        <View style={styles.red_circle}>
          <Text style={styles.red_circle_t} >{this.state.LmsgCount}
          </Text>
        </View>
      </View>
     
      <View style={styles.BottomM}></View>
      
        <TouchableOpacity     onPress={() => this.props.navigation.navigate('RunningCourtButton')}  
         style={styles.buttonAll}          
          ><LinearGradient 
            colors={this.state.buttonColor4}
            style={{ ...StyleSheet.absoluteFillObject }} 
           >
          <Text style={styles.butText}>Running&nbsp;Court&nbsp;Item&nbsp;&&nbsp;Result</Text>
            </LinearGradient>
        </TouchableOpacity>
        <View style={styles.BottomM}></View>
        <View style={{flexDirection:'row'}}>
     
        <TouchableOpacity     onPress={() => this.props.navigation.navigate( 'BillInformation', {param: 2})}  
         style={styles.buttonAll}          
          ><LinearGradient 
            colors={this.state.buttonColor2}
            style={{ ...StyleSheet.absoluteFillObject }} 
           >
          <Text style={styles.butText1}> Bill Information</Text>
            </LinearGradient>
        </TouchableOpacity>
        <View style={styles.red_circle}>
          <Text style={styles.red_circle_t} >{this.state.paymentCount}
          </Text>
        </View>
      </View>
      </View>
      
      </View>
      <View style={styles.container2}>
   
      {this.state.l_id == 100 && (() => 
      {
        if (this.state.l_id){
          return (
            <>
            {this.state.loader == true &&
            <View>
              <ActivityIndicator size="large" height="0" color="#00ff00" />
            </View>
            }
            {this.state.loader == false && this.state.trirtyMinuteAlert == false && this.state.is_insert_val == 1 &&
            <TouchableOpacity style={styles.causelistbuttonR} onPress={() => this.insert_case_result()}>
              <Text style={styles.causelistbuttonTextMessage}>Cause List Update</Text>
            </TouchableOpacity>
             }
            {this.state.loader == true && this.state.is_insert_val == 0 && 
            <TouchableOpacity style={styles.causelistbuttonR} onPress={() => this.showPopUpRunning()}>
              <Text style={styles.causelistbuttonTextMessage}>Cause List Update</Text>
            </TouchableOpacity>
             }
            {this.state.trirtyMinuteAlert == true && this.state.is_insert_val == 1 && 
            <TouchableOpacity style={styles.causelistbuttonR} onPress={() => this.showPopUp()}>
              <Text style={styles.causelistbuttonTextMessage}>Cause List Update</Text>
            </TouchableOpacity>
             }
            <View style={{ width:'100%' }}>
                <Text style={styles.UpdateTime}>Last Updated : {this.state.lastupdatetime}</Text>
            </View></>  
        )}
         else
         {
            return null;
          }            
          })()
      }
      </View>
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
     
     </ScrollView>
     </View>
     </>
  );
  }
};
const styles = StyleSheet.create({
  buttonAll:{
    height:40,
    width:270
  },
  red_circle_t:{
    color: 'white',
    fontWeight:'bold',
    fontSize:18,
    textAlign:'center',
    marginTop:3
  },
  red_circle:{
    backgroundColor: 'rgb(247, 66, 66)',
   borderColor:'rgb(165, 1, 1)',
   borderWidth:2,
    width:37,
    height:37,
    borderRadius: 40,
    color: 'white',
    marginLeft:-20,
    marginTop: -10
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  butText1: {
    fontSize: 18,
    //fontFamily: 'Gill Sans',
fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
    paddingHorizontal:0,
    color: '#071d9b',
    backgroundColor: 'transparent',
  },
  butText: {
    fontSize: 18,
    //fontFamily: 'Gill Sans',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal:0,
    color: '#071d9b',
    backgroundColor: 'transparent',
  },
  BottomM:{marginBottom:20},
  MenuButton:{
    flexDirection:'row',
    width:responsiveWidth(72),
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
    paddingTop:0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0373BB',
    marginLeft:15
  },
  containers: {
    flex:1,
    paddingTop:30,
    zIndex:100,
    alignItems: 'center',
    backgroundColor: '#0373BB',
  },
  container2: {
   marginTop:5,
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
   // backgroundColor: "#FFFFBD",
    flexDirection:'row',
    paddingVertical: 3,
    paddingHorizontal:12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    marginBottom: 10,
    width:responsiveWidth(69),
    zIndex:-1,
  },
  buttonMessageH: {
    alignItems: 'center',
    backgroundColor: "#FFF",
    flexDirection:'row',
    paddingVertical: 3,
    paddingHorizontal:12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    marginBottom: 10,
    width:responsiveWidth(69),
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
    fontSize: 17,
    paddingVertical:5,
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
    width:'100%' 
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
    width:'100%' 
  },
  fadingText: {
    fontSize: 16,
    textAlign: "center",
    color : "#fff",
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
});