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
  Dimensions
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE,BASE_URL_SIDDIQUE_ADMIN} from './BaseUrl';
import TopBar from './TopBar';
LogBox.ignoreAllLogs();//Ignore all log notifications
const windowHeight = Dimensions.get("window").height;
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
export default class EntryCaseList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      notificationData: [],
      notification: "",
      hdRequestData:[],
      adRequestData:[],
      lawyerCode: "",
      lawyer_name:"",
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
      const lawyerName = await AsyncStorage.getItem("lawyerName");      
      this.setState({ lawyer_name:lawyerName });
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
    if(this.props.route.params.param === 1){
      this.commondata();
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
        //   this.setState({ lawyerCode: value });
        //   axios
        //   .post(
        //     `${BASE_URL_SIDDIQUE_ADMIN}/public/api/lawyerinfo?lawyerCode=${value}`
        //   )
        //   .then((resData) => {
        //    // this.setState({ Adaccess: resData.data.ad_user});
        //     this.setState({ lawyer_name: resData.data.lawyer_name });
        //     this.setState({ loader: false});
        // }).catch((error) => {
        //   console.log(error);
        //   this.setState({ loader: false});
        // });
        }
      }      
      });
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
            this.setState({ loader: true});
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
          }
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
       {/* <View style={{backgroundColor:'#007bff', alignItems: "center", padding:5, width:'100%'}}>
        <View style={styles.LawyerInfo}>
          <Text style={styles.LawyerInfoText}>
            General Code : {this.state.lawyerCode}
          </Text>
          <Text style={styles.LawyerInfoText}>{this.state.lawyer_name}</Text>
        </View>
        </View> */}
         <TopBar lawyer_id={this.state.lawyerCode} lawyer_name={this.state.lawyer_name} ></TopBar>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
         </View>
        <SafeAreaView style={styles.container1}>
        {this.state.loader == true?
          <View style={{ flex:1, height:'100%', justifyContent: "center",alignItems: "center"}}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>:
          <View  style={{height:windowHeight-80 }} >
          <ScrollView style={{ flex: 1 ,flexWrap: "wrap"}}>
          { (this.state.adRequestData.length && this.state.adRequestData.length >0) || (this.state.hdRequestData.length && this.state.hdRequestData.length >0) ?
            <View>
            <Text style= {styles.notebox }>Note: New case entry request submitted successfully. You will get a notification before next date cause list search. Thank you {"\n"}Siddique Enterprise, Contact: 01760 200 200</Text>
            </View>
              :<View style={{paddingTop:200}}><Text style= {styles.noItems1 }> No Case Found</Text></View>
          }
          {this.state.hdRequestData && this.state.hdRequestData.length > 0 ?
            <Text style = {styles.noItems1}>High court division case list {'\n'} Total = {this.state.hdRequestData?.length}</Text>:<></>
          }
            {this.state.hdRequestData && this.state.hdRequestData.length > 0 &&  this.state.hdRequestData.map((item, index)=> {
              return (
                <View  style={[styles.hddata]} key={index+1}>
              <View style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>Serial No.</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>{index+1}</Text>                 
                </View>
                <View style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>Dtae & time</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription1}>{moment(item.created_at).format(dateTimeFormat)}</Text>       
                </View>
                <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>Case Type </Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>{item.type_name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>Case No.</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>{item.case_no}{(item.case_type_id ==='15'|| item.case_type_id ==='20')?item.case_no_plus:null}/{item.case_year}</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>P/R</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>{item.pr==1 ? 'Petitioner' : ''} {item.pr==2 ? 'Respondent' : ''}</Text>
                </TouchableOpacity>  
            </View> 
              )
            })
            }
          {this.state.loading && 
            <Text style={this.state.hdRequestData && this.state.hdRequestData.length > 0 ? '' : styles.noItems }> {this.state.hdRequestData && this.state.hdRequestData.length > 0 ? '' : 'No Message Found.'}</Text>
          }
         {this.state.adRequestData && this.state.adRequestData.length > 0 ?
            <Text style = {styles.noItems1}>Appellate division case list {'\n'} Total = {this.state.adRequestData?.length}</Text>:<></>
          }
        {this.state.adRequestData && this.state.adRequestData.length > 0 &&  this.state.adRequestData.map((item, index)=> {
              return (
                <View  style={[styles.hddata]} key={index+1}>
                   <View style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>Serial No.</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>{index+1}</Text>                 
                </View>
                <View style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>Dtae & time</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription1}>{moment(item.created_at).format(dateTimeFormat)}</Text>      
                </View>
                <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>Case Type </Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>{item.type_name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>Case No.</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>{item.case_no}{(item.case_type_id ==='15'|| item.case_type_id ==='20')?item.case_no_plus:null}/{item.case_year}</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={styles.textTile}>P/R</Text>
                  <Text style={styles.textTilecln}>:</Text>
                  <Text style={styles.textDescription}>{item.pr==1 ? 'Petitioner' : ''} {item.pr==2 ? 'Respondent' : ''}</Text>
                </TouchableOpacity>  
            </View>
              )
            })
            }
            <View style={{marginBottom:20}}></View>
         </ScrollView>
         </View>
      }
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
    elevation:20,
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
    rmore: {fontSize: 16,color: '#0000A0', marginTop: 5},
    rless: {fontSize: 16,color: '#0000A0', marginTop: 5},
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0373BB",
  },
  container1: {
   // marginTop: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
   // backgroundColor: "#0373BB",
   marginBottom:30
  },
  CaseTypeNoTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:99,
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
    backgroundColor: "#7fc3fa",
  },
  textTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:95,
  },
  textTilecln:{
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    width:8,
  },
  textDescription:{
    paddingTop:3,
    width:'100%'
  },
  textDescription1:{
    paddingTop:3,
    width:'100%',
    fontWeight:'bold'
  },
  textDescription2:{
    width:80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:2,
    paddingHorizontal: 2,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: 'red',
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
  //   alignItems: "center",
  //   justifyContent: "center",
  //  // marginTop:5,
  //   width: '90%'
  
  // },
  // LawyerInfoText: {
  //   fontSize: 16,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   color: "white",
  //   textAlign: 'center',
  //   width: '90%'
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
  noItems1: {
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    paddingLeft:0,
    width:responsiveWidth(98),
    paddingBottom:10,
    textAlign:'center',
  },
  notebox: {
    marginTop:0,
    fontSize: 16,
    fontWeight:'bold',
    lineHeight: 25,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    paddingLeft:10,
    paddingRight:10,
    width:responsiveWidth(99),
    paddingTop:10,
    paddingBottom:10,
    textAlign:'justify',
    backgroundColor:"#007bff"
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