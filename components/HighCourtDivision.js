import "react-native-gesture-handler";
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
import {BASE_URL_SIDDIQUE,BASE_URL_BDLAW, BASE_URL_SIDDIQUE_ADMIN,BASE_URL_ASP} from './BaseUrl';
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
export default class HighCourtDivision extends Component {
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
      displayFormatnew: "YYYY-MM-DD",
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
      preloader: false,
      asp:false,
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
      isBlockSearchList:false,
      isBlockSearchListMsg:'',
      fadeAnimation: new Animated.Value(0),
      BASE_URL_SIDDIQUE:BASE_URL_SIDDIQUE,
      originalArray: [BASE_URL_SIDDIQUE, BASE_URL_BDLAW],
      randomNumber: 0,
      BASE_URL: BASE_URL_BDLAW,
      //BASE_URL_Asp:"https://adm.lcmsbd.com"
      BASE_URL_Asp:BASE_URL_ASP

    };
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
      this.setState({ value: value.date });
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
    this.setState({ lawyerData: [] });
    this.setState({ previousDate: [] });
    this.setState({ previousDatTime: [] });
    this.setState({ previousResultData: [] });
    this.setState({ ypMsg: [] });
}
  componentDidMount() {
    this._isMounted = true;
    //this.shuffleArray();
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
          axios  // Check isBlockSearchList start this.state.isBlockSearchList
            .post(
              `${this.state.BASE_URL}/public/api/getSearchListBlockStatus?id=1`
            )
            .then((res) => {
              this.setState({ isBlockSearchList: res.data.is_block_hd });
              this.setState({ isBlockSearchListMsg: res.data.message });
            }).catch((error) => {
              console.log(error);
            }); // Check isBlockSearchList End
          if(!this.state.isBlockSearchList)
          {          
              // axios
              // .post(
              //   `${BASE_URL_SIDDIQUE}/public/api/lawyerinfo?lawyerCode=${value}`
              // )
              // .then((res) => {
              //   this.setState({ lawyer_name: res.data.lawyer_name });
              //   this.setState({ address: res.data.address });
              //   this.setState({ phone: res.data.phone });
              // }).catch((error) => {
              //   console.log(error);
              // });
              this.setState({ loader: true});
              axios
              .get(
                `${this.state.BASE_URL_Asp}/Api/getHDMaxDate`
              )
              .then((resData) => {
                this.setState({ maxDate: resData.data.MaxDate });
                this.setState({ loader: false});
                setTimeout(() => {
                  this.GetHDData();
                }, 400);                
              }).catch((error) => {
                console.log(error);
              });

              // axios
              // .get(
              //   `${this.state.BASE_URL}/public/api/getHDMaxDate`
              // )
              // .then((resData) => {
              //   this.setState({ maxDate: resData.data });
              //   this.setState({ loader: false});
              //   setTimeout(() => {
              //     this.GetHDData();
              //   }, 400);                
              // }).catch((error) => {
              //   console.log(error);
              // });
              axios     //Yellow Page Message Get
              .get(
                //`${BASE_URL_SIDDIQUE}/public/api/yellow_page_message`
                `${BASE_URL_SIDDIQUE_ADMIN}/public/api/yellow_page_message`
              )
              .then((resData) => {
                this.setState({ ypMsg: resData.data });
              }).catch((error) => {
                console.log(error);
              });
              axios
              .get(
                `${this.state.BASE_URL}/public/api/getHDSeventhDate`
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
  GetHDData() {
    //this.shuffleArray();
    axios     // Check isBlockSearchList start this.state.isBlockSearchList
    .post(
      `${this.state.BASE_URL}/public/api/getSearchListBlockStatus?id=1`
    )
    .then((res) => {
      this.setState({ isBlockSearchList: res.data.is_block_hd });
      this.setState({ isBlockSearchListMsg: res.data.message });
    }).catch((error) => {
      console.log(error);
    });  // Check isBlockSearchList End
    if(this.state.maxDate==""){
      this.setState({dateError:""});
      return false;
    }
    else{
      this.setState({dateError:""})
    }
    this.setState({ loader: true});
    this.setState({ nullbody: true})
    const { label, value, show, mode, displayFormat, displayFormatnew } = this.state;
    axios
    .post(
      `${this.state.BASE_URL}/public/api/getMessage_c?lawyerCode=${this.state.lawyerCode}&searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
    )
    .then((resData) => {
     if (this._isMounted) {
      this.setState({ ypMsg: resData.data });
     }
    }).catch((error) => {
      console.log(error);
    });

    axios
    .post(
      //`${this.state.BASE_URL}/public/api/is_draft_copy?searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      `${this.state.BASE_URL_Asp}/Api/isDraftCopyAPI?searchDate=${this.state.value ? moment(this.state.value).format(displayFormatnew) : moment(this.state.maxDate).format(displayFormatnew)}`
      )
    .then((res1) => {
      if (this._isMounted) {
        this.setState({ isDraft: res1.data  });
      }
    }).catch((error) => {
      console.log(error);
    });

    let currentDay= new Date();

   // console.log(this.state.value ? moment(this.state.value).format(displayFormatnew) : moment(this.state.maxDate).format(displayFormatnew));
  if((this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)) > moment(currentDay).format(displayFormat)){
    axios
    .post(
      `${this.state.BASE_URL_Asp}/Api/GetCasetoday?lawyerCode=${this.state.lawyerCode}&searchDate=${this.state.value ? moment(this.state.value).format(displayFormatnew) : moment(this.state.maxDate).format(displayFormatnew)}`
    )
    .then((res) => {
      if (this._isMounted) {
       
       // const array = Object.values( res.data );
        //console.log(array);
        this.setState({ asp: true});
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
        `${this.state.BASE_URL_Asp}/Api/GetPreResult?lawyerCode=${this.state.lawyerCode}&searchDate=${this.state.value ? moment(this.state.value).format(displayFormatnew) : moment(this.state.maxDate).format(displayFormatnew)}`
      )
      .then((res4) => {
        if (this._isMounted) {
          this.setState({ previousResultData: res4.data });
          this.setState({ preloader: false });
        }
      }).catch((error) => {
        console.log(error);
        this.setState({ preloader: false });
      });

  }else{

    axios
      .post(
        `${this.state.BASE_URL}/public/api/casetoday?lawyerCode=${this.state.lawyerCode}&searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((res) => {
        if (this._isMounted) {
          this.setState({ asp: false});
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
        `${this.state.BASE_URL}/public/api/previous_result?lawyerCode=${this.state.lawyerCode}&searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((res4) => {
        if (this._isMounted) {
          this.setState({ previousResultData: res4.data });
          this.setState({ preloader: false });
        }
      }).catch((error) => {
        console.log(error);
        this.setState({ preloader: false });
      });
  }
     
      axios
      .post(
        `${this.state.BASE_URL}/public/api/prev_date?searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      )
      .then((res2) => {
        if (this._isMounted) {
          this.setState({ previousDate: res2.data });
        }
      }).catch((error) => {
        console.log(error);
      });
      this.setState({ preloader: true });
      // axios
      // .post(
      //   `${this.state.BASE_URL}/public/api/prev_result_datetime?searchDate=${this.state.value ? moment(this.state.value).format(displayFormat) : moment(this.state.maxDate).format(displayFormat)}`
      // )
      // .then((res3) => {
      //   if (this._isMounted) {

      //     this.setState({ previousDatTime: res3.data });
         
      //   }
      // }).catch((error) => {
      //   console.log(error);
       
      // });
      
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
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: 2 ,marginTop:5 }}>
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
           <TouchableOpacity onPress={this.showDateTimePicker}>
          <TextInput value={value ? moment(value).format(displayFormat) : (this.state.maxDate ? moment(this.state.maxDate).format(displayFormat) : "")}
         onTouchStart={this.showDateTimePicker}
           showSoftInputOnFocus={false}
            placeholder="dd-mm-yyyy"
            placeholderTextColor="white"
            style={styles.input}
          /> 
          </TouchableOpacity>
         <Text  style={{ marginLeft: 15 }}>
            <TouchableOpacity onPress={this.showDateTimePicker}>
              <Image 
                source= {require('../assets/calender.jpg')}
                style={{ width: 50, height: 38, marginTop: 10,borderRadius: 6 }}
              />
            </TouchableOpacity>
          </Text> 
          {this.state.loader == true &&
            <TouchableOpacity style={styles.button} >
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity> 
          }
          {this.state.loader == false &&
            <TouchableOpacity style={styles.button} onPress={() =>this.GetHDData() } >
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
            <Text style={{fontWeight:'bold',fontSize:25, color:'#fff', marginTop:15 }}>Please Wait... </Text>
          </View>
        }
          {this.state.lawyerData && this.state.lawyerData.length > 0 && this.state.loading  && this.state.nullbody  == false && this.state.isBlockSearchList == false && 
            <Text style={styles.totalfound}>Total&nbsp;Case&nbsp;Found: {this.state.lawyerData.length}</Text>
          }
          {this.state.lawyerData && this.state.lawyerData.length < 1 && this.state.loading  && this.state.nullbody  == false && this.state.isBlockSearchList == false && 
            <Text style={styles.totalfound}>Total&nbsp;Case&nbsp;Found: 0</Text>
          }
          {this.state.nullbody  == false &&  this.state.isBlockSearchList == false && 
          <View  style={{height:windowHeight-80,  }} >
          <ScrollView style={{ marginBottom: 5, bottom:0,  paddingBottom:80}}>
            {this.state.isDraft == 1 &&
              <Text style={styles.isDraft}>{this.state.isDraft === 1 ? 'DRAFT' : ''}</Text>
            }
            {this.state.isDraft == 0 &&
              <Text style={styles.isDraft}>{this.state.isDraft === 0 ? 'FINAL' : ''}</Text>
            }
            {this.state.lawyerData && this.state.lawyerData.length > 0 && this.state.lawyerData.map((item,index)=> {
              return (
                <View  style={[styles.hddata]} key={index}>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Court</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{this.state.asp?item.court_name:( item.court_list?.court_name)}</Text>
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
                      <Text style={[styles.textDescription,{width:280}]}>{this.state.asp? item.type_name :(item.case_type?.type_name )}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>CaseNo.</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.case_no}{item.case_no_plus}/{item.case_year }</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>For</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 13, paddingTop:2,}}>{this.state.asp?item.title:item.what_for?.title}</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>P/R</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.pr==1 ? 'Petitioner' : ''} {item.pr==2 ? 'Respondent' : ''}</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Parties</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 11, paddingTop:2,}}> { this.state.asp? item.vs:item.parties_info?.vs} </Text>
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
                <Text style={this.state.lawyerData && this.state.lawyerData.length > 0 ? '' : styles.noItems}> {this.state.lawyerData && this.state.lawyerData.length > 0 ? '' : 'No Case Found.'}</Text>
            )
          })()}
            {this.state.ypMsg && this.state.ypMsg.length > 0 && this.state.ypMsg.map((item,key)=> {
              return (  (() => {
                if (item.messageText  === null || item.messageText ===""){
                  return null;
                }
                return (
                  <View style={styles.pmsg} key={key}>
            <HTMLView 
            value={item.messageText}
            stylesheet={styles}
          />
          </View>
          )  })()
          )
        })
        } 
          {this.state.loading  &&
            <TouchableOpacity style={styles.CaseResultDate}>
              {this.state.previousResultData && this.state.previousResultData.length > 0  &&                 
                    <View  key={1}>
                      <Text style={styles.get_date}>Case Results of Previous Day ({this.state.previousResultData[0].datetime ? moment(this.state.previousResultData[0].datetime).format(dateFormat) : ""})</Text>
                    </View> }
                {this.state.previousResultData && this.state.previousResultData.length > 0  && 
                      <View  key={1}>
                        <Text style={styles.last_datetime}>(Based on available results in Bangladesh Supreme Court’s website as on {this.state.previousResultData[0].datetime ? moment(this.state.previousResultData[0].datetime).format(dateTimeFormat) : ""})</Text>
                      </View>}
            </TouchableOpacity>
            }
              {this.state.previousResultData && this.state.previousResultData.length > 0 && this.state.previousResultData.map((itemPrevResult, key)=> {
                return (
                    <View  style={[styles.hddataResult]} key={key}>
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
               {this.state.preloader == true &&
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop:-200 }}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={{fontWeight:'bold',fontSize:25, color:'#fff', marginTop:15 }}>Please Wait... </Text>
          </View>
        }
          {this.state.loading  &&  this.state.preloader == false &&
            <Text style={this.state.previousResultData && this.state.previousResultData.length > 0 ? '': styles.noItems}>{this.state.previousResultData && this.state.previousResultData.length > 0 ? '' : 'No Result Found.'}</Text>
          }
<View style={{marginBottom:80, flexDirection:'row' }}>
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
   width:'80%'
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
    textAlign: 'center',
    width:'100%'
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