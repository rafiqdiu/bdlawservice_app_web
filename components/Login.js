import 'react-native-gesture-handler';
import React,  { Component} from 'react';
import { LogBox, BackHandler, Animated, Text, TouchableOpacity, TextInput, View, StyleSheet, Image, ActivityIndicator  } from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import {BASE_URL_SIDDIQUE,BASE_URL_SIDDIQUE_ADMIN,BASE_URL_BDLAW,BASE_URL_ASP} from './BaseUrl';
import SITE_BANNER_VERTICAL_IMAGE from '../assets/sel.png';
import moment from "moment";
import _ from 'lodash';
LogBox.ignoreAllLogs();//Ignore all log notifications
setTimeout(() => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}, 1200);

export default class Login extends Component{
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state={
      userCode:'',
      userCodeError:'',
      password:'',
      lawyer_name:'',
      Adaccess:'',
      passwordError:'',
      isSucess:false,
      loader: false,
      errorMsg:false,
      isNetConnected:'',
      redirectUrl:'',
      fadeAnimation: new Animated.Value(0),
      notification: {},
      SMSResponse:'',
      BASE_URL_SIDDIQUE: BASE_URL_SIDDIQUE,
      originalArray: [BASE_URL_SIDDIQUE, BASE_URL_BDLAW],
      randomNumber: 0,
      BASE_URL: BASE_URL_BDLAW,
      //BASE_URL_Asp:"https://adm.lcmsbd.com",
      BASE_URL_Asp:BASE_URL_ASP
    }
  }

  shuffleArray = () => {
    let randomVal =Math.floor(Math.random() * 2);
    const { originalArray } = this.state;
    if(this.state.randomNumber==randomVal)
    {
      if(randomVal==0)
      {
        randomVal = 1;
      }
      else
      {
        randomVal = 0;
      }
    }
    this.setState({ BASE_URL: originalArray[randomVal] == BASE_URL_SIDDIQUE ? BASE_URL_BDLAW : BASE_URL_SIDDIQUE});
    this.setState({ randomNumber: randomVal });
  };

  onButtonPress = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // then navigate
    navigate('NewScreen');
  }

  handleBackButton = () => {

    NetInfo.fetch().then(state => {
     if (this._isMounted) {
      this.setState({ isNetConnected: state.isConnected });
     }
     //this.shuffleArray();
      this._loadInitialState() // returns promise, so process in chain
      .then(value => {
        if (value != null && state.isConnected == true) {
          axios.post(`${this.state.BASE_URL}/public/api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
          .then((res) => {
            if(res.data.code==200)
            {
              this.props.navigation.navigate("DashboardOne");
            }
            if(res.data.code==501)
            {
              AsyncStorage.removeItem('password');
            }
          });
        }
      }).catch((error) => {
        console.log(error);
      }); 
    });
  } 
  
  componentWillUnmount() {
    this._isMounted = false;
   
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount(){
    
   
    this._isMounted  = true;
    //console.log(this.state.BASE_URL);
    //this.shuffleArray();
    
    this._notificationSubscription = Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
   
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
    }).start();

    NetInfo.fetch().then(state => {
     if (this._isMounted) {
      this.setState({ isNetConnected: state.isConnected });
     }

     this._loadInitialPassword() // returns promise, so process in chain
     .then(value => {
       if (value != null && state.isConnected == true) {
         this.setState({ password: value });
      
       }
     }).catch((error) => {
       console.log(error);
     }); 

     if (this._isMounted) {

      this._loadInitialState() // returns promise, so process in chain
      .then(value => {
        if (value != null && state.isConnected == true) {

            /*
              axios
              .post(
                `${BASE_URL_SIDDIQUE_ADMIN}/public/api/lawyerinfo?lawyerCode=${value}`
              )
              .then((resData) => {
                this.setState({ lawyer_name: resData.data.lawyer_name });
                this.setState({ Adaccess: resData.data.ad_user});
                this.setState({ loader: false});
                this._loadsetItem()
            }).catch((error) => {
              console.log(error);
              this.setState({ loader: false});
            });
            */

        
          this.setState({ userCode: value });
          let hour = moment().format('HH');
        //if (hour >= 20 && hour <= 23){

          axios.post(`${this.state.BASE_URL_Asp}/Api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
              .then((res) => {
               
                if(res.data.code==200)
                {
                 //this.setState({ lawyer_name: res.data.user_info.name });

                  
                  this.setState({ Adaccess: res.data.user_info.ad_user});
                  this.setState({ lawyer_name: res.data.user_info.lawyer_name  }); 
                  setTimeout(() => {
                    this._loadsetItem() // returns promise, so process in chain
                  }, 400);   
               
                  this.setState({ loader: false});
                  this.setState({ errorMsg: false});
                  //this.props.navigation.navigate("DashboardOne");


                 var myvar=this.state.SMSResponse;

                 if (typeof myvar == 'undefined' || myvar=='' ) {
                  this.props.navigation.navigate("DashboardOne");
                  }
                 
                }
                if(res.data.code==501)
                {
                  AsyncStorage.removeItem('password');
                }
              }).catch((error) => {
                console.log(error);
              });

            /*
          }else{
              axios.post(`${this.state.BASE_URL}/public/api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
              .then((res) => {
               
                if(res.data.code==200)
                {
                 this.setState({ lawyer_name: res.data.user_info.name });
                 var myvar=this.state.SMSResponse;

                 if (typeof myvar == 'undefined' || myvar=='' ) {
                 
                  this.props.navigation.navigate("DashboardOne");
                  }
                 
                }
                if(res.data.code==501)
                {
                  AsyncStorage.removeItem('password');
                }
              }).catch((error) => {
                console.log(error);
              });
            }
            */
        }
      }).catch((error) => {
        console.log(error);
      }); 
    }
    }).catch((error) => {
      console.log(error);
    });
  }


 _handleNotification = notification => {

  if (this._isMounted) {
    this.setState({ notification: notification });
    var str = this.state.notification.request.content.title;
    if(str.includes('High') == true){
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

  }
};


_handleNotificationResponse = response => {

  if (this._isMounted) {

    var str = response.notification.request.content.title;

    //this.shuffleArray();

    this.setState({ SMSResponse: str });

    if(str.includes('High') == true){
      NetInfo.fetch().then(state => {
        this.setState({ isNetConnected: state.isConnected });

        this._loadInitialState() // returns promise, so process in chain
        .then(value => {
          if (value != null && state.isConnected == true) {
            let hour = moment().format('HH');
            //if (hour >= 20 && hour <= 23){
                axios.post(`${this.state.BASE_URL_Asp}/Api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
                .then((res) => {
                  if(res.data.code==200)
                  {
                    this.props.navigation.navigate("HighCourtDivision");
                  }
                  if(res.data.code==501)
                  {
                    AsyncStorage.removeItem('password');
                  }
                });

              /*
              }else{
                axios.post(`${this.state.BASE_URL}/public/api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
                .then((res) => {
                  if(res.data.code==200)
                  {
                    this.props.navigation.navigate("HighCourtDivision");
                  }
                  if(res.data.code==501)
                  {
                    AsyncStorage.removeItem('password');
                  }
                });
              }
              */
            
          }
        }).catch((error) => {
          console.log(error);
        }); 
      }).catch((error) => {
        console.log(error);
      });
    }

    if(str.includes('Appellate') == true)
    {
      NetInfo.fetch().then(state => {
        this.setState({ isNetConnected: state.isConnected });

        this._loadInitialState() // returns promise, so process in chain
        .then(value => {
          if (value != null && state.isConnected == true) {
            let hour = moment().format('HH');
            //if (hour >= 20 && hour <= 23){
              axios.post(`${this.state.BASE_URL_Asp}/Api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
              .then((res) => {
                if(res.data.code==200)
                {
                  this.props.navigation.navigate("AppellateDivision");
                }
                if(res.data.code==501)
                {
                  AsyncStorage.removeItem('password');
                }
              }).catch((error) => {
                console.log(error);
              });

              /*
            } else{
            axios.post(`${this.state.BASE_URL}/public/api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
                .then((res) => {
                  if(res.data.code==200)
                  {
                    this.props.navigation.navigate("AppellateDivision");
                  }
                  if(res.data.code==501)
                  {
                    AsyncStorage.removeItem('password');
                  }
                }).catch((error) => {
                  console.log(error);
                });
              }
              */
          }
        }).catch((error) => {
          console.log(error);
        }); 
      });
      
    }

    if(str.includes('Notification') == true)
    {
      NetInfo.fetch().then(state => {
        this.setState({ isNetConnected: state.isConnected });

        this._loadInitialState() // returns promise, so process in chain
        .then(value => {
          if (value != null && state.isConnected == true) {
            let hour = moment().format('HH');

            //if (hour >= 20 && hour <= 23){

                axios.post(`${this.state.BASE_URL_Asp}/Api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
                .then((res) => {
                  if(res.data.code==200)
                  {
                    this.props.navigation.navigate("Notification");
                  }
                  if(res.data.code==501)
                  {
                    AsyncStorage.removeItem('password');
                  }
                }).catch((error) => {
                  console.log(error);
                });

                /*
              }else{
                axios.post(`${this.state.BASE_URL}/public/api/appsAndWebLogin?username=${value}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
                .then((res) => {
                  if(res.data.code==200)
                  {
                    this.props.navigation.navigate("Notification");
                  }
                  if(res.data.code==501)
                  {
                    AsyncStorage.removeItem('password');
                  }
                }).catch((error) => {
                  console.log(error);
                });
              }
              */
          }
        }).catch((error) => {
          console.log(error);
        }); 
      });
      
    }
  }
};


  _loadInitialState= async () => {
    try {
      const value =  await AsyncStorage.getItem('userCode');
      if (value !== null){
        return value
      }
 
    } catch (error) {
      return error;
    }
  }
  _loadInitialPassword= async () => {
    try {
      const value =  await AsyncStorage.getItem('password');
      if (value !== null){
        return value
      }
 
    } catch (error) {
      return error;
    }
  }

  
  onLogin() {

    if(this.state.userCode==""){
      this.setState({userCodeError:"User Code is Required"})
      return false;
    }
    else{
      this.setState({userCodeError:""})
    }
    if(this.state.password==""){
      this.setState({passwordError:"Password is Required"})
      return false;
    }
    else{
      this.setState({passwordError:""})
    }

    this.setState({ loader: true});

    if(this.state.isNetConnected == false)
    {
      this.setState({ loader: false});
      return false;
    }
    //this.shuffleArray();

    //console.log(this.state.BASE_URL);
    let hour = moment().format('HH');
    
    //if (hour >= 20 && hour <= 23){
    axios.post(`${this.state.BASE_URL_Asp}/Api/appsAndWebLogin?username=${this.state.userCode}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
    .then(res => {
      //console.log(res.data);
        if(res.data.code==200){

          this.setState({ Adaccess: res.data.user_info.ad_user});
          this.setState({ lawyer_name: res.data.user_info.lawyer_name  });  
          setTimeout(() => {
            this._loadsetItem() // returns promise, so process in chain
          }, 400); 
          if (this._isMounted) {
            this.setState({ loader: false});
            this.setState({ errorMsg: false});
            this.props.navigation.navigate("DashboardOne");
          }

            /*
            try {

              axios
              .post(
                `${BASE_URL_SIDDIQUE_ADMIN}/public/api/lawyerinfo?lawyerCode=${this.state.userCode}`
              )
              .then((resData) => {
                this.setState({ Adaccess: resData.data.ad_user});
                this.setState({ lawyer_name: resData.data.lawyer_name  });  
                this._loadsetItem() // returns promise, so process in chain
                .then(value => {
                  if (value !== null) {
                    if (this._isMounted) {
                      this.setState({ loader: false});
                      this.setState({ errorMsg: false});
                      this.props.navigation.navigate("DashboardOne");
                    }
                  }
                }).catch((error) => {
                  console.log(error);
                });
            }).catch((error) => {
              console.log(error);
              this.setState({ loader: false});
            });
            
             // this.setState({ lawyer_name: res.data.user_info.name });  
              
            } catch (e) {
              console.error(e)
            }
            */

        }else{
          
          this.setState({ errorMsg: true});
          this.setState.isSucess=false;
          this.setState({ loader: false});
        }
    }).catch((error) => {
      console.log(error);
    });

    /*
  }else{
    axios.post(`${this.state.BASE_URL}/public/api/appsAndWebLogin?username=${this.state.userCode}&password=${this.state.password}&apps_user_type=1&is_mobile=1`)
    .then(res => {
      //console.log(res.data);
        if(res.data.code==200){
            try {

              axios
              .post(
                `${BASE_URL_SIDDIQUE_ADMIN}/public/api/lawyerinfo?lawyerCode=${this.state.userCode}`
              )
              .then((resData) => {
                this.setState({ Adaccess: resData.data.ad_user});
                this._loadsetItem() // returns promise, so process in chain
                .then(value => {
                  if (value !== null) {
                    if (this._isMounted) {
                      this.setState({ loader: false});
                      this.setState({ errorMsg: false});
                      this.props.navigation.navigate("DashboardOne");
                    }
                  }
                }).catch((error) => {
                  console.log(error);
                });
            }).catch((error) => {
              console.log(error);
              this.setState({ loader: false});
            });
              this.setState({ lawyer_name: res.data.user_info.name });  
              
            } catch (e) {
              console.error(e)
            }
         
        }else{
          
          this.setState({ errorMsg: true});
          this.setState.isSucess=false;
          this.setState({ loader: false});
        }
    }).catch((error) => {
      console.log(error);
    });
  }
  */

  };

  _loadsetItem= async () => {
    try {
      const pass = await AsyncStorage.setItem('password',this.state.password);
      const value = await AsyncStorage.setItem('userCode',this.state.userCode);
      const lawyer_name = await AsyncStorage.setItem('lawyerName',this.state.lawyer_name);
      const Adaccess = await AsyncStorage.setItem('Adaccess', JSON.stringify(this.state.Adaccess));
      if (value != null){
        
        return value
      }
 
    } catch (error) {
      return error
    }
  }

  fadeIn = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000
    }).start();
  };

  fadeOut = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      duration: 4000
    }).start();
  };
 
  render() {
    return (

      <View style={styles.container}>
      <Image source={ SITE_BANNER_VERTICAL_IMAGE}  style={{width: 80, height: 80}} />
      <Text style={styles.titleText}>BD Law Service</Text>

      <TextInput
        value={this.state.userCode}
        onChangeText={(userCode) => this.setState({ userCode })}
        placeholder='User Code'
        placeholderTextColor = 'white'
        keyboardType = "number-pad"
        autoCorrect={false}
        style={styles.input}
        selectionColor={"white"}
      />

        {this.state.userCodeError !=""  &&
          <Text style={styles.errorColor}>{this.state.userCodeError}</Text>
        }
      <TextInput
        value={this.state.password}
        onChangeText={(password) => this.setState({ password })}
        placeholder={'Password'}
        secureTextEntry={true}
        keyboardType="default"
        placeholderTextColor = 'white'
        autoCorrect={false}
        style={styles.input}
        selectionColor={"white"}
      />
      
       {this.state.passwordError !=""  &&
          <Text style={styles.errorColor}>{this.state.passwordError}</Text>
        }

     { this.state.loader == true &&
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={{fontWeight:'bold',fontSize:25, color:'#fff', marginTop:15 }}>Please Wait... </Text>
          </View>
       }
       {this.state.loader == true &&
        <TouchableOpacity
          style={styles.buttonLogin}  
        >
      <Text style={styles.buttonText}>Login </Text>
      </TouchableOpacity>
       }
 {this.state.loader == false &&
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() =>this.onLogin() }  
        >
      <Text style={styles.buttonText}>Login </Text>
      </TouchableOpacity>
       }
      
        <Animated.View
          style={[
            styles.fadingContainer,
              {
                opacity: this.state.fadeAnimation
              }
            ]}
          >
          {this.state.errorMsg == true &&
            <Text style={styles.fadingText}>The User code or password is incorrect.</Text>
          }

          {this.state.isNetConnected == false &&
            <Text style={styles.fadingText}>You are currently offline, Please check your internet connection.</Text>
          }
        </Animated.View>
     </View>
  );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0373BB',
    paddingTop:12,
  },

  fadingContainer: {
    backgroundColor: "blueviolet",
    borderRadius:4,
    margin: 20,
  },

  fadingText: {
    fontSize: 16,
    textAlign: "center",
    color : "#fff",
    paddingVertical: 5,
    paddingHorizontal: 25,
  },

  buttonRow: {
    flexDirection: "row",
    marginVertical: 16
  },
  
  titleText:{
    fontSize: 26,
    alignItems: 'center',
    justifyContent: 'center',
    color : "#fff",
    paddingTop:6,
    paddingBottom:7,
    textAlign:'center',
    width:'100%'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#419641',
    width: 210,
    height: 44,
    padding: 6,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText:{
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color:'white'
  },
  buttonLogin: {
    alignItems: 'center',
    backgroundColor: '#419641',
    width: 210,
    height: 44,
    padding: 7,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    marginTop:12,
  },
  input: {
    width: 210,
    fontSize: 20,
    height: 40,
    padding: 8,
    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 5,
    borderRadius: 10,
    color:'white',
  },
  errorColor: {
    color:'coral',
  },
  loading: {
   // position: 'absolute',
   // left: 0,
   // right: 0,
   // top: -200,
   // bottom: 15,
   // opacity: 0.95,
    //backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
}

});