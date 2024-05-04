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
  Alert,
  Linking
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE} from './BaseUrl';
import RenderHtml from "react-native-render-html";
//import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
LogBox.ignoreAllLogs();//Ignore all log notifications
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
export default class VersionMsg extends Component {
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
    window.history.pushState(null, null, document.URL);
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
          this.setState({ loader: true});
            axios
            .get(
              `${BASE_URL_SIDDIQUE}/public/api/getNotifications_app?l_id=${this.state.lawyerCode}`
            )
            .then((resData) => {
              this.setState({ notificationData: resData.data });
              this.setState({ loader: false});
            });
        }
      }
      });
  }
msgModalClose= () => {
        this.setState({ isVisible:false });
  }
  msgModalShow= () => {
 Alert.alert(
  '',
  'Are you sure you want to delete?',  
  [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: () => console.log('OK Pressed')},
  ],
  { cancelable: false }
)
} 
  expandItem= (id) => {
      if (this._isMounted) {
        this.setState({ pressedOption:id });
      }
  }
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
  }
  onclickYes = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.sel.bdlawApps');
  }
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
            }
              axios
              .get(
                `${BASE_URL_SIDDIQUE}/public/api/getNotifications_app?l_id=${value}`
              )
              .then((resData) => {
                if (this._isMounted) {
                  this.setState({ notificationData: resData.data });
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
  render() {
    const { label, value, show, mode, displayFormat, dateFormat, dateTimeFormat } = this.state;
    return (
      <View style={styles.container}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
         <Text style={styles.LawyerInfoText}>
            Message List 
         </Text>
       </View>
        <SafeAreaView style={styles.container}>
        {this.state.loader == true &&
          <View style={{ flex:1,justifyContent: "center",alignItems: "center"}}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        }
  {/* <ReactNativeZoomableView
          maxZoom={1.5}
          minZoom={1}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
          offsetX= {1}           // current offset left
          offsetY= {1}          // current offset top                      
          lastX={1.5}             // last offset left (before we started the movement)
          lastY={1}              // last offset top (before we started the movement)
        > */}
          <ScrollView style={{ flex: 1 ,flexWrap: "wrap"}}>
            { this.state.notificationData && this.state.notificationData.length > 0 &&  this.state.notificationData.map((item, index)=> {
              return (
                 <View  style={[styles.hddata,{flex:1,justifyContent: "center",alignItems: "center" }]} key={item.id}>
                    <View  style={{ flexDirection: "row", padding: 0}}>
                          <Text  style={styles.textStyle }>
                          <Text style={styles.headText}>Latest App Version D & T:  {moment(item.created_at).format(dateTimeFormat)}{"\n"}{"\n"}</Text>
                                  <Text style={{textDecorationLine: 'underline'}} >Subject:{"\n"}{"\n"}</Text>
                                  <RenderHtml source= {{ html:item.notification_text== ''?item.commomnote.notification_text:item.notification_text }}
                                   tagsStyles={tagsStyles}
                                   contentWidth={responsiveWidth(100)}
                                 />
              <View style={ { flex:1, flexDirection: 'row', alignItems: 'flex-end', alignContent:'flex-end',justifyContent:'flex-end'}}>
                <TouchableOpacity><Text>                                                                                          </Text>
                <Text style={styles.yesB}>Yes</Text></TouchableOpacity>
                                </View>
                            </Text> 
                    </View>
                </View> 
             )
            })
            }
          {this.state.loading && 
            <Text style={this.state.notificationData && this.state.notificationData.length > 0 ? '' : styles.noItems }> {this.state.notificationData && this.state.notificationData.length > 0 ? '' : 'No Message Found.'}</Text>
          }
          </ScrollView>
          {/* </ReactNativeZoomableView> */}
        </SafeAreaView>
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
  img: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10
  },
  p: {
    textAlign: "justify",
    width:responsiveWidth(92),
    marginTop:-10
  },
   li: {
    textAlign: "justify",
    width:responsiveWidth(92),
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
  yesB: {
   alignSelf:'flex-end',   
    backgroundColor: '#0764d4',
    borderRadius: 15,
    color: '#fff',
    fontWeight:'bold',
    textAlign:'center',
    paddingVertical:8,
    paddingHorizontal:30,
    textAlign: 'right',
    fontSize:18,
  },
   modalContent: {
    height: '25%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#464C55',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
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
  dateText: {
    color: "#008000",
  },
  headText: {
    color: "#008000",
    fontWeight:'bold',
    textDecorationLine: 'underline'
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
    textAlign: "justify",
    width:responsiveWidth(92),
  },
});