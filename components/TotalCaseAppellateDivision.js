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
  Dimensions
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";
import {BASE_URL_SIDDIQUE} from './BaseUrl';
import TopBar from './TopBar';
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
LogBox.ignoreAllLogs();//Ignore all log notifications
const windowHeight = Dimensions.get("window").height;
export default class TotalCaseAppellateDivision extends Component { 
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      jsonData: "",
      totalCaseList: [],
      caseDetails: [],
      caseDetailsLawyerWise: [],
      totalCaseListCount:0,
      lawyerCode: "",
      lawyer_name: "",
      mobile: "",
      address: "",
      phone: "",
      show: false,
      value: "",
      mode: "date",
      displayFormat: "DD-MM-YYYY",
      dateFormat: "DD/MM/YYYY",
      dateTimeFormat: "DD/MM/YYYY - hh:mm a",
      label: "Date",
      loading: false,
      dateError: '',
      isDraft: "",
      previousDate:[],
      previousDatTime: [],
      previousResultData: [],
      loaderFirstTime: false,
      loader: false,
      nullbody:true,
      ypMsg:[],
      maxDate:'',
      minDate:'',
      minYear:'',
      minMonth:'',
      maxD:'',
      maxYear:'',
      maxMonth:'',
      isNetConnected:'',
      fadeAnimation: new Animated.Value(0)
    };
  }
  showDateTimePicker = () => {
    if (this._isMounted) {
      this.setState({ show: true });
    }
  };
  hideDateTimePicker = () => {
    if (this._isMounted) {
      this.setState({ show: false });
    }
  };
  handleDatePicked = (value) => {
    if (this._isMounted) {
      this.setState({ value: value });
    }
    this.hideDateTimePicker();
    setTimeout(() => {
      this.GetHDData();
    }, 300);
  };
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
    this.setState({ totalCaseList: [] });
    this.setState({ previousDate: [] });
    this.setState({ previousDatTime: [] });
    this.setState({ previousResultData: [] });
    this.setState({ ypMsg: [] });
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
              // axios
              // .post(
              //   `${BASE_URL_SIDDIQUE}/public/api/lawyerinfo?lawyerCode=${value}`
              // )
              // .then((res) => {
              //   this.setState({ lawyer_name: res.data.lawyer_name });
              //   this.setState({ address: res.data.address });
              //   this.setState({ phone: res.data.phone });
              setTimeout(()=>{ this.GetTotalHDData();}, 100); 
                
              // }).catch((error) => {
              //   console.log(error);
              // });           
          }
        }
      });
  }
  GetTotalHDData() {
    this.setState({ loaderFirstTime: true});
    this.setState({ nullbody: true})
    const { label, value, show, mode, displayFormat } = this.state;   
    axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/totalcaselistad?search_code=${this.state.lawyerCode}`
      )
      .then((res) => {
        if (this._isMounted) {
          this.setState({ totalCaseList: res.data });
          this.setState({ loading: true});
          this.setState({ loaderFirstTime: false});
          this.setState({ nullbody: false})
          this.setState({ totalCaseListCount: res.data.length });
        }
      }).catch((error) => {
        console.log(error);
      });
  }
  getTotalCaseDetailsTypeWise(case_type_id) {
    this.scrollListReftop.scrollTo({y: this.state.totalCaseListCount*30, animated: true});
    this.setState({ loader: true});
    this.setState({ nullbody: true})
    this.setState({ caseDetails: [] });
    this.setState({ caseDetailsLawyerWise: [] });
    const { label, value, show, mode, displayFormat } = this.state;
    axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/totalcaselistaddetails?l_id=${this.state.lawyerCode}&case_type_id=${case_type_id}`
      )
      .then((res) => {
        if (this._isMounted) {
          this.setState({ caseDetails: res.data });
          this.setState({ loading: true});
          this.setState({ loader: false});
          this.setState({ nullbody: false});
        }
      }).catch((error) => {
        console.log(error);
      });
  }
  getCasesummaryDetailslw() {
    this.scrollListReftop.scrollTo({y: this.state.totalCaseListCount*30, animated: true});
    this.setState({ loader: true});
    this.setState({ nullbody: true})
    this.setState({ caseDetails: [] });
    this.setState({ caseDetailsLawyerWise: [] });
    const { label, value, show, mode, displayFormat } = this.state;
    axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/adcasesummarydetailslw?l_id=${this.state.lawyerCode}`
      )
      .then((res) => {
        if (this._isMounted) {
          this.setState({ caseDetailsLawyerWise: res.data });
          this.setState({ loading: true});
          this.setState({ loader: false});
          this.setState({ nullbody: false});
        }
      }).catch((error) => {
        console.log(error);
      });
  }
  render() {
    const { label, value, show, mode, displayFormat, dateFormat, dateTimeFormat } = this.state;
    return (
      <View style={styles.container}>
          <TopBar lawyer_id={this.state.lawyerCode} lawyer_name={this.state.lawyer_name} ></TopBar>  
        {/* <TouchableOpacity style={styles.LawyerInfo}>
          <Text style={styles.LawyerInfoText}>
            General Code : {this.state.lawyerCode}
          </Text>
          <Text style={styles.LawyerInfoText}>{this.state.lawyer_name}</Text>
          <Text style={styles.LawyerInfoText}>My Case Summary</Text>
        </TouchableOpacity>    */}
        <SafeAreaView style={[styles.container,{width: responsiveWidth(96),marginTop:5,    marginBottom:30 }]}>       
        <View  style={{height:windowHeight-80, }} >
          <ScrollView contentContainerStyle={{
                flexGrow: windowHeight,
               
              }}  style={{ marginBottom: 100, bottom:0,  paddingBottom:80}} ref={(ref) => { this.scrollListReftop = ref; }}>
          <TouchableOpacity style={styles.TotalCaseBox}>
          {this.state.totalCaseList && this.state.totalCaseList.length > 0 &&
            <View  style={[styles.hddata]}>
              <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                <Text style={styles.caseTypeHeader1}>Case Type</Text>
                <Text style={styles.caseTypeHeader}>Total</Text>
                <Text style={styles.caseTypeHeader}>Details</Text>
              </TouchableOpacity>
            </View>
          }
          {this.state.totalCaseList && this.state.totalCaseList.length > 0 && this.state.totalCaseList.map((item, key)=> {
              return (
                <View key={key}>
                    <TouchableOpacity  onPress={() =>this.getTotalCaseDetailsTypeWise(item.case_type_id) } style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={key % 2 == 0?styles.bodyTextone:styles.bodyTextone1}>{item.type_name}</Text>
                      <Text style={key % 2 == 0?styles.bodyText:styles.bodyText1}>{item.type_total_count }</Text>
                      <Text style={key % 2 == 0?styles.bodyText:styles.bodyText1}>
                          <View>
                              <Pressable style={styles.buttons}                              
                              onPress={() =>this.getTotalCaseDetailsTypeWise(item.case_type_id) }                              
                              >
                              <Text style={styles.texts1}>Details</Text>
                              </Pressable>
                          </View>
                      </Text>
                    </TouchableOpacity>
                </View>
              )
            })
        }
          {this.state.totalCaseList && this.state.totalCaseList.length > 0 &&
            <View style={[styles.hddata]}>
              <TouchableOpacity   onPress={() =>this.getCasesummaryDetailslw() } style={{ flexDirection: "row", padding: 0 }}>
                <Text style={styles.caseTypeHeader1}>Total Case</Text>
                <Text style={styles.caseTypeHeader}>
                  {this.state.totalCaseList.reduce((a,v) =>  a = a + Number(v.type_total_count), 0 )}
                  </Text>
                <Text style={styles.caseTypeHeader}>
                    <View>
                          <Pressable style={styles.buttons}                          
                            onPress={() =>this.getCasesummaryDetailslw() }                         
                          >
                          <Text style={styles.texts1}>Details</Text>
                          </Pressable>
                    </View>
                </Text>
              </TouchableOpacity>
            </View>
          }
      </TouchableOpacity>
        {this.state.loaderFirstTime == true &&
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", textAlign:'center', marginTop:150,  marginBottom:150 }}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        }
        {this.state.loader == true &&
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", textAlign:'center',  marginTop:150,  marginBottom:150  }}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        }
    <TouchableOpacity style={styles.TotalCaseTypeWiseBox}>       
          {this.state.caseDetails && this.state.caseDetails.length > 0 && this.state.nullbody  == false &&  
            <View style={[styles.typeWiseTitle1]}>     
                <Text style={styles.caseTypeHeaderCountTotalTitletop}>{this.state.caseDetails[0].type_name}</Text>
            </View>
          }
          {this.state.caseDetails && this.state.caseDetails.length > 0 && this.state.nullbody  == false &&  
            <View style={[styles.caseTypeHeaderTitleBG]}>
              <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                <Text style={styles.caseTypeHeaderTitle1}>Case No.</Text>
                <Text style={styles.caseTypeHeaderTitle}>P/R</Text>
                <Text style={styles.caseTypeHeaderTitle}>Entry Date</Text>
              </TouchableOpacity>
            </View>
          }
          {this.state.caseDetails && this.state.caseDetails.length > 0 && this.state.caseDetails.map((item, key)=> {
            return (
                <View key={key}>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={key % 2 == 0?styles.bodyTextone:styles.bodyTextone1}>{item.case_no}{item.case_no_plus}/{item.case_year }</Text>
                      <Text style={key % 2 == 0?styles.bodyText:styles.bodyText1}>{item.pr==1 ? 'Petitioner' : ''} {item.pr==2 ? 'Respondent' : ''}</Text>
                      <Text style={key % 2 == 0?styles.bodyText:styles.bodyText1}>
                        { moment(item.entry_date).format(displayFormat) }
                      </Text>
                    </TouchableOpacity>
                </View>
              )
            })
          }
        {this.state.caseDetails && this.state.caseDetails.length > 0 && this.state.nullbody  == false &&  
            <View  style={[styles.typeWiseTitle]}>
              <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                <Text style={styles.caseTypeHeaderCountTotalTitle}>{this.state.caseDetails[0].type_name}</Text>
                <Text style={styles.caseTypeHeaderCountTitle1Number}>Total : {this.state.caseDetails.length}</Text>
              </TouchableOpacity>
            </View>
        }
          {this.state.caseDetailsLawyerWise && this.state.caseDetailsLawyerWise.length != 0 && this.state.nullbody  == false &&  
            <View style={[styles.totalCaseCount]}>
              <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                <Text style={styles.totalCaseCountTypeHeader}>Total Case : {this.state.totalCaseList.reduce((a,v) =>  a = a + Number(v.type_total_count), 0 )}</Text>
              </TouchableOpacity>
            </View>
          }
          {this.state.caseDetails && this.state.caseDetails.length > 0 && this.state.nullbody  == false && (() => {
                return ( 
              <View style={styles.main_body_two}> 
                  <Text style={{textAlign:"center", fontSize: 20}}>
                      End.
                  </Text>     
                </View>             
            )})()
          } 
          {this.state.caseDetailsLawyerWise && this.state.caseDetailsLawyerWise.length != 0 && this.state.nullbody  == false &&  
            <View style={[styles.caseTypeHeaderTitleBG]}>
              <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                <Text style={styles.caseTypeHeaderCountTitle1}>Case No.</Text>
                <Text style={styles.caseTypeHeaderCountTitle}>P/R</Text>
                <Text style={styles.caseTypeHeaderCountTitle}>Entry Date</Text>
              </TouchableOpacity>
            </View>
          }
          {Object.entries(this.state.caseDetailsLawyerWise).map(([key, value]) => {
            return (
              <View key={key}>
                {value.map((item, keys)=> {
                  return (
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={keys % 2 == 0?styles.bodyTextone:styles.bodyTextone1}>{item.case_no}{item.case_no_plus}/{item.case_year }</Text>
                      <Text style={keys % 2 == 0?styles.bodyText:styles.bodyText1}>{item.pr==1 ? 'Petitioner' : ''} {item.pr==2 ? 'Respondent' : ''}</Text>
                      <Text style={keys % 2 == 0?styles.bodyText:styles.bodyText1}>
                        { moment(item.entry_date).format(displayFormat) }
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                  <Text style={key % 2 == 0?styles.bodyTextTotal:styles.bodyTextTotal1}>{ key } : {value.length}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        {this.state.caseDetailsLawyerWise && this.state.caseDetailsLawyerWise.length > 0 && this.state.caseDetailsLawyerWise.map((item, key)=> {
          return (
              <View key={key}>
                  <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                    <Text style={key % 2 == 0?styles.bodyTextone:styles.bodyTextone1}>{item.case_no}{item.case_no_plus}/{item.case_year }</Text>
                    <Text style={key % 2 == 0?styles.bodyText:styles.bodyText1}>{item.pr==1 ? 'Petitioner' : ''} {item.pr==2 ? 'Respondent' : ''}</Text>
                    <Text style={key % 2 == 0?styles.bodyText:styles.bodyText1}>
                      {item.entry_date }
                    </Text>
                  </TouchableOpacity>
              </View>
            )
          })
        }
        {this.state.caseDetailsLawyerWise && this.state.caseDetailsLawyerWise.length != 0 && this.state.nullbody  == false &&  (() => {
            return ( 
          <View style={styles.main_body_two}> 
              <Text style={{textAlign:"center", fontSize: 20}}>
                  End.
              </Text>     
            </View>         
          )})()
        }        
          {this.state.loading && 
             (() => {
              if (this.state.totalCaseList && this.state.totalCaseList.length > 0){
                return null;
              }
              return ( 
                <Text style={this.state.totalCaseList && this.state.totalCaseList.length > 0 ? '' : styles.noItems}> {this.state.totalCaseList && this.state.totalCaseList.length > 0 ? '' : 'No Case Found.'}</Text>
            )
          })()}
      </TouchableOpacity>
      </ScrollView>
      </View>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0373BB",
  },
  caseTypeHeader1:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(42),
    fontWeight:'bold'
  },
   main_body_two: {
    padding: 7,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:3,
    alignSelf:'center',
    marginBottom:2,
    marginRight:5,
    backgroundColor: "#FFF",
    width:responsiveWidth(95),
  },
  caseTypeHeader:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 18,
    width:responsiveWidth(27),
    fontWeight:'bold'
  },
  caseTypeHeaderCountTitle:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    textAlign:'center',
    width:responsiveWidth(27),
    color:'#fff',
    fontWeight:'bold'
  },
  caseTypeHeaderCountTitle1:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(42),
    color:'#fff',
    fontWeight:'bold'
  },
  caseTypeHeaderCountTotalTitletop:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    textAlign:'center',
    paddingRight:20,
    color:'#fff'
  },
  caseTypeHeaderCountTotalTitle:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(65),
    textAlign:'right',
    paddingRight:20,
    color:'#fff'
  },
  caseTypeHeaderCountTitle1Number:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(32),
    textAlign:'left',
    paddingLeft:10,
    color:'#fff'
  },
  caseTypeHeaderTitle:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    textAlign:'center',
    width:responsiveWidth(27),
    color:'#fff'
  },
  caseTypeHeaderTitle1:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(42),
    color:'#fff',
    fontWeight:'bold'
  },
  totalCaseCountTypeHeader:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(42),
    color:'#ffffff',
    fontWeight:'bold'
  },
  totalCaseCountTypeHeader1:{
    paddingTop:3,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(42),
    color:'#ffffff',
    fontWeight:'bold'
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
    paddingHorizontal: 1,
    elevation: 3,
    marginBottom:4,
    color:'blue',
    marginRight:5,
  },
  texts1: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'blue',
  },
  textTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:75,
  },
  CaseTypeNoTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:99,
  },
  topbodyText: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#000', 
    backgroundColor:'#ccc',
    width:responsiveWidth(27),
    paddingVertical:6
  },
  topbodyTextone: { 
    fontSize: 14, 
    textAlign: 'left', 
    color: '#000', 
    backgroundColor:'#ccc',
    width:responsiveWidth(42),
    paddingLeft: 18,
    paddingVertical:6
  },
  topbodyText1: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#000', 
    backgroundColor:'#fffffc',
    width:responsiveWidth(27),
    paddingVertical:6
  },
  topbodyTextone1: { 
    fontSize: 14, 
    textAlign: 'left', 
    color: '#000', 
    backgroundColor:'#fffffc',
    width:responsiveWidth(42),
    paddingLeft: 18,
    paddingVertical:6
  },
  bodyText: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#000', 
    backgroundColor:'#ccc',
    width:responsiveWidth(27),
   paddingVertical:6
  },
  bodyTextone: { 
    fontSize: 14, 
    textAlign: 'left', 
    color: '#000', 
    backgroundColor:'#ccc',
    width:responsiveWidth(42),
    paddingLeft: 18,
    paddingVertical:6
  },
  bodyText1: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#000', 
    backgroundColor:'#fffffc',
    width:responsiveWidth(27),
    paddingVertical:6
  },
  bodyTextone1: { 
    fontSize: 14, 
    textAlign: 'left', 
    color: '#000', 
    backgroundColor:'#fffffc',
    width:responsiveWidth(42),
    paddingLeft: 18,
    paddingVertical:6
  },
  bodyTextTotal: { 
    fontSize: 14, 
    textAlign: 'right', 
    color: '#000', 
    backgroundColor:'#ccc',
    width:"33%",
    paddingLeft: 18,
    paddingRight:20,
    paddingVertical:6
  },
  bodyTextTotal1: { 
    fontSize: 14, 
    textAlign: 'right', 
    color: '#fff', 
    backgroundColor:'#4876a2',
    width:"100%",
    paddingLeft: 18,
    paddingTop:4,
    paddingRight:20,
    paddingBottom:4,
    fontWeight:'bold'
  },
  textTilecln:{
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    width:8,
  },
  textDescription:{
    paddingTop:3,
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
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width:'90%'
  // },
  TotalCaseBox: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width:'98%',
    backgroundColor:'white',
    marginTop:2,
  },
  TotalCaseTypeWiseBox: {
    marginTop:10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width:'98%',
    backgroundColor:'white',
  },
  // LawyerInfoText: {
  //   fontSize: 16,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   color: "white",
  //   textAlign: 'center',
  //   width:'100%'
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
    marginLeft:15
  },
  buttonText: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    width:'100%'
  },
  input: {
    width: 135,
    fontSize: 22,
    height: 38,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "white",
    marginVertical: 10,
    borderRadius: 6,
    color: "#fff",
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
    paddingTop: 4,
    paddingLeft:10,
    paddingBottom:5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:0,
    marginBottom:0,
    alignItems: "center",
    justifyContent: "center",
    textAlign:'center',
    backgroundColor: "#d6d6ff",  
  },
  caseTypeHeaderTitleBG: {
    paddingTop: 4,
    paddingLeft:10,
    paddingBottom:5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:0,
    marginBottom:0,
    alignItems: "center",
    justifyContent: "center",
    textAlign:'center',
    backgroundColor: "#093070",
  },
  totalCaseCount: {
    paddingTop: 4,
    paddingBottom:5,
    fontWeight:'bold',
    alignItems: "center",
    justifyContent: "center",
    textAlign:'center',
    backgroundColor: "#4876a2",
    color:'#ffffff',
    width:'100%',
  },
  typeWiseTitle: {
    paddingTop: 4,
    paddingLeft:0,
    paddingBottom:5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:0,
    marginBottom:0,
    alignItems: "center",
    justifyContent: "center",
    textAlign:'center',
    backgroundColor: "#4876a2",
  },
  typeWiseTitle1: {
    paddingTop: 4,
    paddingLeft:0,
    paddingBottom:5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:0,
    marginBottom:0,
    alignItems: "center",
    justifyContent: "center",
    textAlign:'center',
    backgroundColor: "#4876a2",
    width:responsiveWidth(99),
  },
  totalCaseList: {
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
    width:300,
    paddingTop:20,
    paddingBottom:10,
    textShadowColor: 'rgba(0, 0, 0,0.9)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15
  },
  pmsg: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 6,
    fontSize: 20,
    alignItems: "center",
    textAlign:"center",
    color: "#fff",
    paddingLeft:4,
    width:345,
    paddingTop:5,
    paddingBottom:10,
    marginLeft:7,
    marginTop:10,
    textShadowColor: 'rgba(0, 0, 0,0.9)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15
  },
  p: {
     fontSize: 20,
    textAlign:"center",
    color: "#fff",
    paddingLeft:4,
    width:345,
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
    marginTop:10,
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
});