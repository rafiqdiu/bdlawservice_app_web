import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {Text, TouchableOpacity, View, StyleSheet,Image, Linking} from 'react-native';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL_SIDDIQUE} from './BaseUrl';
import axios from "axios";
LogBox.ignoreAllLogs();//Ignore all log notifications
export default class DashboardTwo extends Component{
  constructor(props) {
    super(props);
    this.state = {
            userAccessStatus: [],
            l_id:0,
            userCode:0,
            Pass_number:0
        };
    }
  componentDidMount() {
    this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        this.setState({ userCode: value});
        axios
        .post(
          `${BASE_URL_SIDDIQUE}/public/api/appsUserAccessStatus?username=`+value
        )
        .then((resData) => {
          this.setState({ userAccessStatus: resData.data});
        }).catch((error) => {
          console.log(error);
        });
      })
  }
  _loadInitialState = async () => {
    try {
      const value = await AsyncStorage.getItem("userCode");
      const p_number = await AsyncStorage.getItem("password");
      if (p_number !== null) {
        this.setState({ Pass_number: p_number});
      }
      if (value !== null) {
        return value;
      }
    } catch (error) {
      return error;
    }
  };
  bdlawReferencePress = () => {
    if(this.state.userAccessStatus.data.status==1 && this.state.userAccessStatus.data.bdlawreference_allow==1)
    {
      const url = 'app://bdlawReference';
      Linking.openURL(url)
        .catch(err => {
          Linking.openURL('https://play.google.com/store/apps/details?id=com.rafiqse.LCMS_APPS');
      })
    }
    else
    {
      alert("Your Account is blocked, Please contact this phone number : 01771335577")
    }
  }
  judgeCourtPress = () => {
    if(this.state.userAccessStatus.data.status==1 && this.state.userAccessStatus.data.judgecourt_allow==1)
    {
      const url = 'app://judgeCourt';
      Linking.openURL(url)
        .catch(err => {
          Linking.openURL('https://play.google.com/store/apps/details?id=com.sel.JudgeCourt.com');
      })
    }
    else
    {
      alert("Your Account is blocked, Please contact this phone number : 01771335577")
    }
  }
  render() {
    return (
      <View style={styles.buttonMiddle}> 
        <TouchableOpacity
          onPress={ ()=>{ this.props.navigation.navigate("BDLawService")}}  
        >
        <View style={{ backgroundColor:'#1075c7' , borderRadius: 23}}>
        <View  style={styles.customBtnBGtop} ><Image style={styles.imgBannertop} source={require('../assets/sel.png')} />
          <Text style={styles.customBtnTexttop}>BD Law Service For {"\n"}Supreme Court Cause List Search</Text><Text style={[styles.customBtnTexttop,{textDecorationLine:'underline' }]}>Version-1</Text>
        </View>
        <View style={{marginBottom:10}}>
        <Text style={styles.customBtnTexttopP}>Code No.: {this.state.userCode}</Text>
        <Text style={styles.customBtnTexttopP}>Password: {this.state.Pass_number}</Text>
        <Text style={styles.customBtnTexttopM}>If you want to change your password,</Text>
        <Text style={styles.customBtnTexttopM}>Please contact us.</Text>
        </View>
       </View>
       </TouchableOpacity>
        <View style={{flex: 1, width:'100%', marginTop:15, marginBottom:3,  borderWidth: 1,
        borderColor:'black',}} />
        <View style={{flex: 1, width:'100%', marginBottom:20,  borderWidth: 1,
        borderColor:'black',}} />
      <TouchableOpacity
          style={[styles.customBtnBG,{backgroundColor:'#3342ce'}]}
          onPress={() => this.judgeCourtPress()}
        ><Image style={styles.imgBanner} source={require('../assets/jc.png')} />
          <Text style={styles.customBtnText}>BD Judge Court For{"\n"} Judge Court Diary & Case Search</Text><Text style={[styles.customBtnText,{textDecorationLine:'underline' }]}>Trial Version</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.customBtnBG,{backgroundColor:'#1a6656'}]}
          onPress={() => this.bdlawReferencePress()}
        ><Image style={styles.imgBanner} source={require('../assets/blr.png')} />
          <Text style={styles.customBtnText}>BD Law Reference (BLR){"\n"}For Judgment / Reference Search</Text><Text style={[styles.customBtnText, {textDecorationLine:'underline' }]}>Trial Version</Text>
        </TouchableOpacity>
        </View>
    );
  }
};
const styles = StyleSheet.create({
  imgBannertop:{
    width:80,
    height:80,
    justifyContent:'center',
    alignSelf:'center',
    borderRadius:15,
      },
      imgBanner:{
        width:50,
        height:50,
        justifyContent:'center',
        alignSelf:'center',
        borderRadius:13
          },
      buttonMiddle: {
        textAlign: 'center',
        verticalAlign:'middle',
        justifyContent:'center',
        alignItems:'center',
        marginTop:40,
        width:'100%',
        alignContent:'center'
      },
      customBtnTexttopP: {
        fontSize: 19,
        fontWeight: 'bold',
        color: "#fcf37c",
        textAlign: 'center',
    },
      customBtnTexttopM: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#fcf37c",
        textAlign: 'center',
    },
      customBtnTexttop: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#f9f9fa",
        textAlign: 'center',
    },
      customBtnText: {
        fontSize: 18,
        fontWeight: '400',
        color: "#fff",
        textAlign: 'center',
    },
    customBtnBGtop: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginBottom:10,
      borderRadius: 10,
      justifyContent:'center',
      width:350,
      verticalAlign:'middle',
      alignSelf:'center'
      },
    /* Here style the background of your button */
    customBtnBG: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom:20,
    borderRadius: 10,
    justifyContent:'center',
    width:300,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
    verticalAlign:'middle',
    alignSelf:'center'
    },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 5,
    fontSize: 18,
    textAlign: 'center',
    verticalAlign:'middle',
    marginTop:50,
  },
  devided: {
    marginTop:20,
    textAlign: 'center',
  },
  svgCurve: {
    position: 'absolute',
    width: 200,
  },
  headerContainer: {
    marginTop: 15,
    marginHorizontal: 10
  },
  headerTexth: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  item: {
    alignItems:'center',
    borderRadius: 4,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    width: 200,
    bottom: 0,
    zIndex: -3,
  },
  text: {
    fontSize: 20,
    color: '#09f',
    textAlign: 'center'
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  mainContainer: {
    flex:1,
    flexDirection: 'row'
  },
  LeftContainer: {
   flex: 1,
   backgroundColor: "#aa88aa" 
  },
  bodyContainer: {
    flex: 6
  },
  inputs: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#fff',
  },
});