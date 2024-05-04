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
  Modal,
  Pressable,
  Dimensions 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";
import RenderHtml from "react-native-render-html";
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE} from './BaseUrl';
import TopBar from './TopBar';
LogBox.ignoreAllLogs();//Ignore all log notifications
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
const windowHeight = Dimensions.get("window").height;
export default class BillInformation extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      notificationData: [],
      modalitem:[],
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
      modalVisible:false,
      lawyer_name:'',
      width: ''
    };
  }
  _loadInitialState = async () => {
    try {
      const value = await AsyncStorage.getItem("userCode");
      const lawyerName = await AsyncStorage.getItem("lawyerName");
      this.setState({ lawyer_name:lawyerName });
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
    window.history.pushState(null, null, document.URL);  
    if(this.props.route.params.param === 1){
      this.commondata();
      this.setState({ selectButton: true });
     }
     if(this.props.route.params.param === 2){
      this.paymentdata(0);
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
  }  //reade more
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
                `${BASE_URL_SIDDIQUE}/public/api/getNotifications_c?l_id=${this.state.lawyerCode}`
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
              `${BASE_URL_SIDDIQUE}/public/api/getNotifications_common?l_id=${value}&id=${pdata}`
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
viewpaymentdata = (pdata) => {
      this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          if (this._isMounted) {
            this.setState({ loader: true});
          }
            axios
            .get(
              `${BASE_URL_SIDDIQUE}/public/api/getNotifications_payment_value_update?l_id=${value}&id=${pdata}`
            )
            .then((resData) => {  
              this.setState({ loader: false});           
            }).catch((error) => {
              console.log(error);
            });
        }
      });
}
paymentdata = (pdata) => {
      this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          if (this._isMounted) {
            this.setState({ loader: true});
          }
            axios
            .get(
              `${BASE_URL_SIDDIQUE}/public/api/getNotifications_payment_newRo?l_id=${value}&id=${pdata}`
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
  render() {
    const { label, value, show, mode, displayFormat, dateFormat, dateTimeFormat } = this.state;
    return (
      <View style={styles.container}>
           <TopBar lawyer_id={this.state.lawyerCode} lawyer_name={this.state.lawyer_name} ></TopBar>
       <Modal
    animationType="slide"
    transparent={true}
    visible={this.state.modalVisible}
    onRequestClose={() => {        
      this.setState({ modalVisible: false});
    }}>
    <View >
      <View style={styles.modalView}>
      <View style={{ flexDirection: "row",  width:responsiveWidth(92) }}>
                  <Text  style={styles.textStyleM }>
                          <Text style={styles.dateText}> Date & Time: {moment(this.state.modalitem.created_at).format(this.state.dateTimeFormat) }{"\n"} </Text>
                          <Text style={[styles.textStyleM,{ fontWeight:'bold'}]} >{this.state.modalitem.note_head== ''?this.state.modalitem.commomnote.note_head:this.state.modalitem.note_head}:- {"\n"}</Text>
                          <RenderHtml source= {{ html:this.state.modalitem.notification_text== ''?this.state.modalitem.commomnote.notification_text:this.state.modalitem.notification_text }}
                          stylesheet={styles}
                          tagsStyles={tagsStylesM}
                          contentWidth={responsiveWidth(92)}
                        />  
                    </Text>
            </View>
            <Pressable
              style={[styles.buttonM, styles.buttonClose]}
              onPress={() =>  this.setState({ modalVisible: false})}>
              <Text style={styles.textStyleclose}>Ok</Text>
            </Pressable> 
      </View>
    </View>
  </Modal>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
         </View>
        <SafeAreaView style={styles.container}>
        {this.state.loader == true?
          <View style={{ flex:1, height:'100%', justifyContent: "center",alignItems: "center"}}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>:
          <View  style={{height:windowHeight,  }} >
          <ScrollView style={{ flex: 1 ,marginBottom:100, flexWrap: "wrap"}}>
            {this.state.notificationData && this.state.notificationData.length > 0 &&  this.state.notificationData.map((item, index)=> {
              return (
                 <View  style={[ item.is_view_notification == 1? styles.hddata:styles.hddatanotview,{flex:1,justifyContent: "center",alignItems: "center", width:responsiveWidth(95) }]} key={item.id}>
                    <TouchableOpacity activeOpacity={item.is_view_notification == 1? 1:0.2}  onPress={()=>{ this.setState({ modalitem: item});  this.setState({ modalVisible: true}); this.viewpaymentdata(item.id) } }style={{ flexDirection: "row", paddingLeft: 5, width:responsiveWidth(92) }}>
                          <Text  style={styles.textStyle }>
                                  <Text style={styles.dateText}> Date & Time: {moment(item.created_at).format(this.state.dateTimeFormat) }{"\n"} </Text>
                                  <Text style={[styles.textStyle,{ fontWeight:'bold'}]} >{item.note_head== ''?item.commomnote.note_head:item.note_head}:- {"\n"}</Text>
                                  <RenderHtml source= {{ html:item.notification_text== ''?item.commomnote.notification_text:item.notification_text }}
                                  stylesheet={styles}
                                  tagsStyles={tagsStyles}
                                  contentWidth={responsiveWidth(100)}
                                />   
                            </Text>
                    </TouchableOpacity>                    
                </View>
              )
            })
            }
          {this.state.notificationData && this.state.notificationData.length ==0 && 
            <Text style={this.state.notificationData && this.state.notificationData.length > 0 ? '' : styles.noItems }> {this.state.notificationData && this.state.notificationData.length > 0 ? '' : 'No Result Found.'}</Text>
          }


         </ScrollView></View>    
  }
        </SafeAreaView>
        {this.state.notificationData && this.state.notificationData.length ===10 ?
         <TouchableOpacity  onPress= {()=>{ this.paymentdata(1) }} ><View><Text style={{fontSize:18, textDecorationLine: 'underline', color:'#ff0', padding:10}}>View all bill information</Text></View></TouchableOpacity>
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
const tagsStylesM = {
  body:{ width:responsiveWidth(92), fontSize:18},
}
const tagsStyles = {
  h1: {
    color: '#6728C7',
    textAlign: 'center',
    marginBottom: -5
  },
  body:{ width:responsiveWidth(91)},
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
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p:{
    textAlign: "justify",
  },
  buttonM: {
    marginTop:20,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal:30,
    paddingVertical:10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#0344f8',
  },
  modalView: {
    marginTop: 200,
    backgroundColor: '#eaf7f8',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyleclose: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
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
    rmore: {fontSize: 16,color: '#0000A0', marginTop: 5},
    rless: {fontSize: 16,color: '#0000A0', marginTop: 5},
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
  LawyerInfo: {
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    marginTop:5,
  },
  LawyerInfoText: {
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: 'center',
    width: '100%'
  },
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
    paddingTop:120,
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
    textAlign: "justify",
    width:responsiveWidth(92),
  },
  textStyleM: {
    fontSize: 18,
    textAlign: "justify",
    width:responsiveWidth(92),
  },
});