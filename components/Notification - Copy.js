import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  LogBox,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  Pressable,  
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";
import ReadMore from 'react-native-read-more-text';
import RenderHtml from "react-native-render-html";
//import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE, BASE_URL_SIDDIQUE_ADMIN} from './BaseUrl';
LogBox.ignoreAllLogs();//Ignore all log notifications
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
export default class Notification extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      notificationData: [],
      notification: "",
      lawyerCode: "",
      show: false,
      value: "",
      mode: "date",
      displayFormat: "DD-MM-YYYY",
      dateFormat: "DD/MM/YYYY",
      dateTimeFormat: "DD/MM/YYYY - hh:mm a",
      label: "Date",
      loading: false,
      dateError: '',
      loader: false,
      nullbody:true,
      isNetConnected:'',
      fadeAnimation: new Animated.Value(0),
      isVisible: false, //state of modal default false  
      pressedOption: 32,
      compressOption:1000,
      selectButton:false,
      selectButtonp:false,
      width: ''
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
  componentWillUnmount() {
    this._isMounted = false;
    this.setState({ notificationData: [] });
  }
  componentDidMount() {
    this._isMounted = true;
    if(this.props.route.params.param === 1){
      this.commondata(0);
      this.setState({ selectButton: true });
     }
     if(this.props.route.params.param === 2){
      this.paymentdata();
      this.setState({ selectButtonp: true });
     }
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
    this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          if (this._isMounted) {
          this.setState({ lawyerCode: value });
        }
      }
      });
  }
  expandItem= (id) => {
      if (this._isMounted) {
        this.setState({ pressedOption:id });
      }
  }//reade more
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={styles.rmore} onPress={handlePress}>
        Read details
      </Text>
    );
  }
  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={styles.rless} onPress={handlePress}>
        Show less
      </Text>
    );
  }//end reade more 
  deleteItem = (id) => {
    axios
      .get(
        `${BASE_URL_BDLAW}/public/api/deleteNotifications_c?id=${id}`
      ).then((deleteData) => {
        this._loadInitialState() // returns promise, so process in chain
        .then((value) => {
          if (value !== null) {
            if (this._isMounted) {
              this.setState({ lawyerCode: value });
              this.setState({ loader: true});
            }
              axios
              .get(
                `${BASE_URL_SIDDIQUE}/public/api/getNotifications_c?l_id=${value}`
              )
              .then((resData) => {
                if (this._isMounted) {
                  this.setState({ notificationData: resData.data });
                  this.setState({ loader: false});
                }
              }).catch((error) => {
                console.log(error);
              });
          }
        });
      }).catch((error) => {
        console.log(error);
      });
 }
 commondata = (pdata) => {
      this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          if (this._isMounted) {
            this.setState({ lawyerCode: value });
            this.setState({ loader: true});
          }
            axios
            .get(
              `${BASE_URL_SIDDIQUE}/public/api/getNotifications_common_test?l_id=${value}&details=1&take=${pdata}`
            )
            .then((resData) => {
              if (this._isMounted) {
                this.setState({ notificationData: resData.data });
                this.setState({ loader: false});
              }
            }).catch((error) => {
              console.log(error);
            });
        }
      });  
}
viewUpdateMsg=(data)=>{
  axios
  .get(
    `${BASE_URL_SIDDIQUE}/public/api/appUpdateView_c?l_id=${this.state.lawyerCode}&id=${data}`
  )
}
  render() {
    const { label, value, show, mode, displayFormat, dateFormat, dateTimeFormat } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}></View>   
        <SafeAreaView style={styles.container}>
        {this.state.loader == true?
          <View style={{ flex:1, height:'100%', justifyContent: "center",alignItems: "center"}}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>:
  // <ReactNativeZoomableView
  //         maxZoom={1.5}
  //         minZoom={1}
  //         zoomStep={0.5}
  //         initialZoom={1}
  //         bindToBorders={true}
  //         offsetX= {1}           // current offset left
  //         offsetY= {1}          // current offset top                      
  //         lastX={1.5}             // last offset left (before we started the movement)
  //         lastY={1}              // last offset top (before we started the movement)
  //       >
          <ScrollView style={{ flex: 1 ,flexWrap: "wrap"}}>
            {this.state.notificationData && this.state.notificationData.length > 0 &&  this.state.notificationData.map((item, index)=> {
              return (
                 <View style={[item.l_id == this.state.lawyerCode? styles.hddata:styles.hddatanotview,{flex:1,justifyContent: "center",alignItems: "center",width:responsiveWidth(95)  }]} key={item.id}>
                    <Pressable onPress={()=>{ this.viewUpdateMsg(item.id)}} style={{ flexDirection: "row", paddingLeft: 5, width:responsiveWidth(94) }}>
                    <ReadMore numberOfLines={ this.state.selectButton?3:10}
                     renderTruncatedFooter={this._renderTruncatedFooter}
                     renderRevealedFooter={this._renderRevealedFooter}
                     textStyle={{textAlign: "center"}} > 
                          <Text  style={styles.textStyle }>
                                  <Text style={styles.dateText}> Date & Time: {moment(item.created_at).format(dateTimeFormat) }  {"\n"} </Text>
                                  <Text style={[styles.textStyle,{  textDecorationLine: 'underline'}]} >{item.note_head} {"\n"}{"\n"}</Text>
                                  <RenderHtml                                   
                                  source= {{ html:item.notification_text }}
                                  stylesheet={styles}
                                  tagsStyles={tagsStyles}
                                  contentWidth={responsiveWidth(80)}
                                />                                         
                            </Text>                       
                      </ReadMore>
                    </Pressable>                    
                </View>              
              )
            })
            }
          {this.state.loading && 
            <Text style={this.state.notificationData && this.state.notificationData.length > 0 ? '' : styles.noItems }> {this.state.notificationData && this.state.notificationData.length > 0 ? '' : 'No Message Found.'}</Text>
          }       
         </ScrollView>
        //  </ReactNativeZoomableView>
  }
        </SafeAreaView>
        {this.state.notificationData && this.state.notificationData.length ===10 ?
         <TouchableOpacity  onPress= {()=>{ this.commondata(1) }} ><View><Text style={{fontSize:18, textDecorationLine: 'underline', color:'#ff0', padding:10}}>View Latest 100 Massages</Text></View></TouchableOpacity>
         :null }
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
    );
  }
}
const tagsStyles = {
  h1: {
    color: '#6728C7',
    textAlign: 'center',
    marginBottom: -5
  },
  body:{ width:responsiveWidth(90)},
  img: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10
  },
  p: {
    textAlign: "justify",
    width:responsiveWidth(90),
    marginTop:-10
  },
   li: {
    textAlign: "justify",
    width:responsiveWidth(90),
  },
  span: {  
    flex: 1,
    alignItems: "center",
    justifyContent: "center", 
    textAlign: 'center',
    marginTop:-10
 },  
}
const styles = StyleSheet.create({
  LawyerInfoLeft:{
    borderTopRightRadius:13,
    borderBottomRightRadius:13,
   // borderWidth: 1,
   // borderColor: "rgba(190, 255, 255, 0.82)",    
    marginRight:8,
    alignItems: "center",
    justifyContent: "center",
    width:'2.5%',
    elevation:10,
    height:70,
   // backgroundColor:'rgba(255, 255, 255, 0.95)'
  },
  LawyerInfoRight:{
    borderTopLeftRadius:13,
    borderBottomLeftRadius:13,
   // borderWidth: 1,
   // borderColor: "rgba(190, 255, 255, 0.82)",    
    marginLeft:8,
    alignItems: "center",
    justifyContent: "center",
    width:'5%',
    elevation:10,
    height:70,
   // backgroundColor:'rgba(148, 217, 248, 0.97)'
  },
  hederTopnew:{
    backgroundColor:'#80c6f1',
    width:responsiveWidth(100),
    marginTop:-10,
    height:50,
   // borderBottomLeftRadius:30,
   // borderBottomRightRadius:30

  },
  LawyerInfo: {
   
   
    borderWidth: 1,
    borderColor: "rgba(190, 255, 255, 0.82)",
    borderRadius:6 ,
   // margintop:30,
    alignItems: "center",
    justifyContent: "center",
    width:'90%',
    elevation:2,
    height:70,
    backgroundColor:'rgba(167, 224, 250, 0.82)'
  },
  LawyerInfoText: {
   
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    color: "#071d9b",
    fontWeight:'bold',
    textAlign: 'center',
    width:'100%'
  },
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p:{
    textAlign: "justify",
  },
  yesB: {
    alignSelf:'flex-end',   
     backgroundColor: '#f8e807',
     borderRadius: 15,
     color: '#080808',
     fontWeight:'bold',
     textAlign:'center',
     paddingVertical:8,
     paddingHorizontal:10,
     textAlign: 'right',
     marginRight:20,
     marginLeft:25,
     fontSize:14,
   },
   yesBs: {
    alignSelf:'flex-end',   
     backgroundColor: '#FFFFBD',
     borderRadius: 15,
     color: '#080808',
     fontWeight:'bold',
     textAlign:'center',
     paddingVertical:8,
     paddingHorizontal:10,
     textAlign: 'right',
     marginRight:20,
     marginLeft:25,
     fontSize:14,
     fontWeight:'bold'
   },
  modal: {  
    justifyContent: 'center',  
    alignItems: 'center',   
    backgroundColor : "#00BCD4",   
    height: 300 ,  
    width: '80%',  
    borderRadius:10,  
    borderWidth: 1,  
    borderColor: '#fff',    
    marginTop: 80,  
    marginLeft: 40,  
     },  
     text: {  
        color: '#3f2949',  
        marginTop: 10  
     },  
     span: {  
      flex: 1,
      alignItems: "center",
      justifyContent: "center", 
      textAlign: 'center',
   },  
    rmore: {fontSize: 20, padding:10, fontWeight:'bold', color: '#0000A0', marginTop: 5, textAlign: 'center' },
    rless: {fontSize: 20, fontWeight:'bold', color: '#0000A0', marginTop: 5, textAlign: 'center'},
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0373BB",
  },
  textTile:{
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
    width:40,
    color: '#008000',  
  },
  CaseTypeNoTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:99,
  },
  textTilecln:{
    fontSize: 15,
    marginLeft: 100,
    paddingLeft:80,
    alignItems: "center",
   
    width:200,
    color: '#f00',  
  },
  textDescription:{
    paddingTop:3,
    width:responsiveWidth(92),
    textAlign: "justify",
  }, 
  textDescriptiona:{
    textAlignVertical: "center",textAlign: "center",
  },
  textParties:{
    fontSize: 8,
    paddingTop:8,
  },
  titleText: {
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  // LawyerInfo: {
  //   padding: 5,
  //   borderWidth: 1,
  //   borderColor: "white",
  //   borderRadius: 6,
  //   marginTop:5,
  // },
  // LawyerInfoText: {
  //   fontSize: 16,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   color: "white",
  //   textAlign: 'center',
  //   width: '100%'
  // },
  button: {
    alignItems: "center",
    backgroundColor: "#419641",
    width: 80,
    height: 37,
    padding: 3,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    marginTop: 10,
    marginLeft:10
  },
  buttonText: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  input: {
    width: 150,
    fontSize: 22,
    height: 38,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "white",
    marginVertical: 10,
    borderRadius: 6,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
  SectionHeaderStyle: {
    backgroundColor: "#CDDC89",
    fontSize: 20,
    padding: 5,
    color: "#fff",
  },
  SectionListItemStyle: {
    fontSize: 15,
    padding: 15,
    color: "#000",
    backgroundColor: "#F5F5F5",
  },
  hddata: {
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:5,
    marginBottom:0,
    marginLeft:7,
    marginRight:7,
    backgroundColor: "#FFFFBD",
  },
  hddatanotview: {
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:5,
    marginBottom:0,
    marginLeft:7,
    marginRight:7,
    backgroundColor: "#f8e807",
  },
  dateText: {
    color: "#008000",
  },
  hddataText: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
  },
  hddataResult: {
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:5,
    marginLeft:7,
    marginRight:7,
    backgroundColor: "#FFFFBD",
  },
  totalfound: {
    fontSize: 14,
    alignItems: "center",
    color: "#fff",
  },
  noItems: {
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    paddingLeft:90,
    width:responsiveWidth(92),
    paddingTop:20,
    paddingBottom:20,
    textShadowColor: 'rgba(0, 0, 0,0.9)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15
  },
  errorColor: {
    color:'coral',
  },
  isDraft: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    marginLeft:10,
  },
  CaseResultDate: {
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    marginLeft:5,
    marginRight:6,
    backgroundColor: "#fff",
    color: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  get_date: {
    fontSize: 17,
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
  },
  last_datetime: {
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
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
  textStyle: {
    fontSize: 14,
    textAlign: "center",
    width:responsiveWidth(92),
  },
});