import "react-native-gesture-handler";
import {BASE_URL_SIDDIQUE} from './BaseUrl';
import React, { Component } from "react";
import {
  LogBox,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "react-native-modal-datetime-picker";
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";
import HTMLView from 'react-native-htmlview';
import TopBar from './TopBar';
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
import {
  DatePickerModal,
  DatePickerModalContent,
  TimePickerModal,
  DatePickerInput,
  // @ts-ignore TODO: try to fix expo to work with local library
} from 'react-native-paper-dates';
LogBox.ignoreAllLogs();//Ignore all log notifications
const windowHeight = Dimensions.get("window").height;
export default class AppellateDivision extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      jsonData: "",
      lawyerData: [],
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
      loader: false,
      nullbody:true,
      ypMsg2:[],
      maxDate:'',
      minDate:'',
      minYear:'',
      minMonth:'',
      maxD:'',
      maxYear:'',
      maxMonth:'',
      isNetConnected:'',
      isBlockSearchList:false,
      isBlockSearchListMsg:'',
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

    //alert(value);
    if (this._isMounted) {
      this.setState({ value: value.date });
    }

    this.hideDateTimePicker();
    setTimeout(() => {
      this.GetADData();
    }, 300);
    // setTimeout(() => {
    //   this.hideDateTimePicker();
    // }, 250);
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
    this.setState({ lawyerData: [] });
    this.setState({ previousDate: [] });
    this.setState({ previousDatTime: [] });
    this.setState({ previousResultData: [] });
    this.setState({ ypMsg2: [] });
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
        window.history.pushState(null, null, document.URL);
       
        this.setState({ isNetConnected: state.isConnected });
      }
    });
    this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          if (this._isMounted) {
          this.setState({ lawyerCode: value });
           axios
           .post(
            `${BASE_URL_SIDDIQUE}/public/api/getSearchListBlockStatus?id=2`
           )
           .then((res) => {
             this.setState({ isBlockSearchList: res.data.is_block_ad });
             this.setState({ isBlockSearchListMsg: res.data.message });
           }).catch((error) => {
             console.log(error);
           });// Check isBlockSearchList End
         if(!this.state.isBlockSearchList)
         {
            // axios
            //   .post(
            //     `${BASE_URL_SIDDIQUE}/public/api/lawyerinfo?lawyerCode=${value}`
            //   )
            //   .then((res) => {
            //     this.setState({ lawyer_name: res.data.lawyer_name });
            //     this.setState({ address: res.data.address });
            //     this.setState({ phone: res.data.phone });
            //   }).catch((error) => {
            //     console.log(error);
            //   });
              axios
              .get(
                `${BASE_URL_SIDDIQUE}/public/api/getADMaxDate`
              )
              .then((resData) => {
                this.setState({ maxDate: resData.data });
                setTimeout(() => {
                  this.GetADData();
                }, 400);
              }).catch((error) => {
                console.log(error);
              });
               axios
              .get(
                `${BASE_URL_SIDDIQUE}/public/api/getADSeventhDate`
              )
              .then((minDate) => {
                this.setState({ minYear: minDate.data.Year });
                this.setState({ minMonth: minDate.data.Month });
                this.setState({ minDate: minDate.data.Date });
                this.setState({ maxYear: minDate.data.maxYear });
                this.setState({ maxMonth: minDate.data.maxMonth });
                this.setState({ maxD: minDate.data.maxD });
              }).catch((error) => {
                console.log(error);
              });
            }
          }
        }
      });
  }
  GetADData() {
    axios  // Check isBlockSearchList start this.state.isBlockSearchList
    .post(
      `${BASE_URL_SIDDIQUE}/public/api/getSearchListBlockStatus?id=2`
    )
    .then((res) => {
      this.setState({ isBlockSearchList: res.data.is_block_ad });
      this.setState({ isBlockSearchListMsg: res.data.message });
    }).catch((error) => {
      console.log(error);
    });// Check isBlockSearchList End
    if(this.state.maxDate==""){
      this.setState({dateError:"Date field is Required"});
      this.setState({dateError:""});
      return false;
    }
    else{
      this.setState({dateError:""})
    }
    this.setState({ loader: true});
    this.setState({ nullbody: true})
    const { label, value, show, mode, displayFormat } = this.state;
    axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/getMessage_c?lawyerCode=${this.state.lawyerCode}&searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((resData2) => {
       if (this._isMounted) {
         this.setState({ ypMsg2: resData2.data });
       }
      }).catch((error) => {
        console.log(error);
      });
      axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/ad_casetoday?lawyerCode=${this.state.lawyerCode}&searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((res) => {
        if (this._isMounted) {
          this.setState({ lawyerData: res.data });
          this.setState({ loading: true});
          this.setState({ loader: false});
          this.setState({ nullbody: false})
        }
      }).catch((error) => {
        console.log(error);
      });
      axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/ad_is_draft_copy?searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((res1) => {
        if (this._isMounted) {
          this.setState({ isDraft: res1.data  });
        }
      }).catch((error) => {
        console.log(error);
      });
      axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/ad_prev_date?searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((res2) => {
        if (this._isMounted) {
          this.setState({ previousDate: res2.data });
        }
      }).catch((error) => {
        console.log(error);
      });
      axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/ad_prev_result_datetime?searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((res3) => {
        if (this._isMounted) {
          this.setState({ previousDatTime: res3.data });
        }
      }).catch((error) => {
        console.log(error);
      });
      axios
      .post(
        `${BASE_URL_SIDDIQUE}/public/api/ad_previous_result?lawyerCode=${this.state.lawyerCode}&searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((res4) => {
        if (this._isMounted) {
          this.setState({ previousResultData: res4.data });
        }
      }).catch((error) => {
        console.log(error);
      });
  }
  render() {
    const { label, value, show, mode, displayFormat, dateFormat, dateTimeFormat } = this.state;
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity style={styles.LawyerInfo}>
          <Text style={styles.LawyerInfoText}>
            General Code : {this.state.lawyerCode}
          </Text>
          <Text style={styles.LawyerInfoText}>{this.state.lawyer_name}</Text>
        </TouchableOpacity> */}
        <TopBar lawyer_id={this.state.lawyerCode} lawyer_name={this.state.lawyer_name} ></TopBar>
      
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: 2 , marginTop:5}}>
        <DatePickerModal
                       locale='en-GB'
                        mode="single"
                        visible={show}
                        onDismiss={this.hideDateTimePicker}
                        date={value}
                        onConfirm={this.handleDatePicked.bind(this)}
                        onChange={this.handleDatePicked.bind(this)}
                        validRange={{
                          startDate: new Date(this.state.minYear, this.state.minMonth, this.state.minDate),
                         // disabledDates: [futureDate],
                          // startDate: new Date(2021, 1, 2), // optional
                           endDate: new Date(this.state.maxYear, this.state.maxMonth, this.state.maxD), // optional
                        }}
                        // saveLabel="Save" // optional
                        // uppercase={false} // optional, default is true
                        label="Search List Date " // optional
                        // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                        // startYear={2000} // optional, default is 1800
                        // endYear={2100} // optional, default is 2200
                         //allowEditing={true} // optional, default is true
                        //inputEnabled={true} // optional, default is true

                      />
           <TextInput
            value={value ? moment(value).format(displayFormat) : (this.state.maxDate ? moment(this.state.maxDate).format(displayFormat) : "")}
           // onPress={this.showDateTimePicker}
           //  autoFocus={false}
            onTouchStart={this.showDateTimePicker}
            pointerEvents="none"
         
            showSoftInputOnFocus={false}
            placeholder="dd-mm-yyyy"
            placeholderTextColor="white"
            style={styles.input}
          /> 
           <Text style={{ marginLeft: 15 }}>
            <TouchableOpacity onPress={this.showDateTimePicker}>
              <Image
              source={require('../assets/calender.jpg')}
                style={{ width: 55, height: 38, marginTop: 10, borderRadius: 6}}
              />
            </TouchableOpacity>
          </Text> 
          {this.state.loader == true &&
            <TouchableOpacity style={styles.button} >
            <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity> 
          }
          {this.state.loader == false &&
            <TouchableOpacity style={styles.button} onPress={() =>this.GetADData() } >
            <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity> 
          }
       </View>
       <Text style={styles.LawyerInfoText1}>
            Search List Date : {value ? moment(value).format(displayFormat) : (moment(this.state.maxDate).format(displayFormat)=="Invalid date"?"":moment(this.state.maxDate).format(displayFormat))   } 
         </Text>
       {this.state.dateError !=""  &&
        <Text style={styles.errorColor}>{this.state.dateError}</Text>
        }
        <SafeAreaView style={styles.container}>
        {this.state.loader == true &&
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop:-200 }}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        }
          {this.state.lawyerData && this.state.lawyerData.length > 0 && this.state.loading  && this.state.nullbody  == false && this.state.isBlockSearchList == false &&
            <Text style={styles.totalfound}>Total&nbsp;Case&nbsp;Found: {this.state.lawyerData.length}</Text>
          }
          {this.state.lawyerData && this.state.lawyerData.length < 1 && this.state.loading  && this.state.nullbody  == false && this.state.isBlockSearchList == false &&
            <Text>Total&nbsp;Case&nbsp;Found: 0</Text>
          }
          {this.state.nullbody  == false &&  this.state.isBlockSearchList == false && 
          <View  style={{height:windowHeight-80,  }} >
          <ScrollView style={{ marginBottom: 80 }}>
            {this.state.isDraft == 1 &&
              <Text style={styles.isDraft}>{this.state.isDraft == 1 ? 'DRAFT' : ''}</Text>
            }
            {this.state.isDraft != 1 &&
              <Text style={styles.isDraft}>{this.state.isDraft != 1 ? 'FINAL' : ''}</Text>
            }
            {this.state.lawyerData && this.state.lawyerData.length > 0 && this.state.lawyerData.map((item)=> {
              return (
                <View  style={[styles.hddata]} key={item.id}>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0}}>
                      <Text style={styles.textTile}>Court</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{ item.ad_court_list?.court_name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Page</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.page_no }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Serial</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.dout } {item.sl}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>CaseType</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={[styles.textDescription,{width:280}]}>{item.ad_case_type?.type_name }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>CaseNo.</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.case_no}{item.case_no_plus}/{item.case_year }</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>For</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 13, paddingTop:2,}}>{item.what_for?.title}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>P/R</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.pr==1 ? 'Petitioner' : ''} {item.pr==2 ? 'Respondent' : ''}</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Parties</Text>
                      <Text style={styles.textTilecln}>:</Text>                
                      <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 11, paddingTop:2,}}> { item.ad_parties_info?.vs} </Text>
                    </TouchableOpacity>  
                </View>
              )
            })
            }
          {this.state.loading && 
             (() => {
              if (this.state.lawyerData && this.state.lawyerData.length > 0){
                return null;
              }
              return ( 
            <Text style={this.state.lawyerData && this.state.lawyerData.length > 0 ? '' : styles.noItems }> {this.state.lawyerData && this.state.lawyerData.length > 0 ? '' : 'No Case Found.'}</Text>
            )
          })()}
          {this.state.ypMsg2 && this.state.ypMsg2.length > 0 && this.state.ypMsg2.map((itemsg, key)=> {
              return (
                (() => {
                  if (itemsg.messageText  === null || itemsg.messageText ==="" || itemsg.messageText ==="undefined"){
                    return null;
                  }
                  return (
                    <View style={styles.pmsg}  key={key}>
            <HTMLView 
            value={itemsg.messageText}
            stylesheet={styles}
          />
          </View>
          )  })()
          )
        })
        }
          {this.state.loading  &&
            <TouchableOpacity style={styles.CaseResultDate}>
              {this.state.previousDate && this.state.previousDate.length > 0 && this.state.previousDate.map((itemPrevdate, key)=> {
                  return (
                    <View key={key} >
                      <Text style={styles.get_date}>Case Results of Previous Day ({itemPrevdate.get_date ? moment(itemPrevdate.get_date).format(dateFormat) : ""})</Text>
                    </View>
                  )
                })
              }
              {this.state.previousDatTime && this.state.previousDatTime.length > 0 && this.state.previousDatTime.map((itemPrevDateTime, key)=> {
                    return (
                      <View  key={key}>
                        <Text style={styles.last_datetime}>(Based on available results in Bangladesh Supreme Court’s website as on {itemPrevDateTime.last_datetime ? moment(itemPrevDateTime.last_datetime).format(dateTimeFormat) : ""})</Text>
                      </View>
                    )
                  })
                }
            </TouchableOpacity>
            }
              {this.state.previousResultData && this.state.previousResultData.length > 0 && this.state.previousResultData.map((itemPrevResult)=> {
                return (
                     <View style={[styles.hddataResult]} key={itemPrevResult.id}>
                      <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                        <Text style={styles.CaseTypeNoTile}>CaseType&No.</Text>
                        <Text style={styles.textTilecln}>:</Text>
                        <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 13, paddingTop:3,}}>{itemPrevResult.case_type_id==45 ? '?' : ''} { itemPrevResult.type_name } No. { itemPrevResult.case_no }/{ itemPrevResult.case_year }</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                        <Text style={styles.CaseTypeNoTile}>Result</Text>
                        <Text style={styles.textTilecln}>:</Text>
                        <Text style={{flex: 1, flexWrap: 'wrap', paddingTop:3,}}>{itemPrevResult.result }</Text>
                      </TouchableOpacity>
                    </View>
                )
              })
            }
          {this.state.loading  &&
            <Text style={this.state.previousResultData && this.state.previousResultData.length > 0 ? '' : styles.noItems}>{this.state.previousResultData && this.state.previousResultData.length > 0 ? '' :'No Result Found.'}</Text>
          }
          <View style={{marginBottom:80, flexDirection:'row'}}>
          <View style={{flex: 1, height: 2, marginTop:13, backgroundColor: '#fff'}} />
            <View>
              <Text style={{width: 50, fontSize:20, fontWeight:'bold', color:'#fff',  textAlign: 'center'}}>End</Text>
            </View>
            <View style={{flex: 1, height: 2, marginTop:13, backgroundColor: '#fff'}} />
          </View>
          </ScrollView>
          </View>
          }
          {this.state.loader == false && this.state.isBlockSearchList == true  && this.state.nullbody  == false &&  
            <Text style={styles.isBlockSearchList}>{this.state.isBlockSearchListMsg}</Text>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0373BB",
   

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
  textTilecln:{
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    width:8,
  },
  textDescription:{
    paddingTop:3,
    fontSize: 13,
  
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
  LawyerInfoText1: {
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    width:'100%',
    textAlign:'center'
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
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:5,
    marginBottom:0,
    marginLeft:7,
    marginRight:7,
    backgroundColor: "#FFFFBD",
    width:responsiveWidth(97),
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
  isBlockSearchList: {
    fontSize: 22,
    textAlign:"center",
    color : "#fff",
    textShadowColor: 'rgba(255, 0, 0, 0.75)',
    textShadowRadius: 15
  },
  CaseResultDate: {
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    marginTop:10,
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
});