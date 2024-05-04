import "react-native-gesture-handler";
import React, { Component  } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  FlatList 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE, BASE_URL_SIDDIQUE_ADMIN} from './BaseUrl';
import {
  responsiveWidth, responsiveHeight
} from "react-native-responsive-dimensions";
import { AntDesign } from '@expo/vector-icons';
export default class RunningCourtDetails extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      jsonData: "",
      resultData: [],
      lawyerCode: "",
      lawyer_name: "",
      mobile: "",
      address: "",
      phone: "",
      show: false,
      value: "",
      mode: "date",
      displayFormat: "DD-MM-YYYY",
      sFormat: "YYYY-MM-DD",
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
      maxDate:'',
      isNetConnected:'',
      courtLink:'',
      alldata:[],
      param: this.props.route.params.param,
      judg_name: this.props.route.params.judg,
      date_t: this.props.route.params.date_t,
      court_N: this.props.route.params.court_N,
      Running_case: this.props.route.params.Running,
      court_id:this.props.route.params.court_id,
      bench_id:this.props.route.params.bench_id,
      court_sl:this.props.route.params.court_sl,
      isNetConnected:'',
      dataSourceCords:[],
      ref:'',
      wahtfor_id: '0',
      fadeAnimation: new Animated.Value(0),
      arrow:'->',
      htmlTest:[],
      refreshing: true,
      EndLoader: 1,
    };
  }
  showDateTimePicker = () => {
    this.setState({ show: true });
  };
  hideDateTimePicker = () => {
    this.setState({ show: false });
  };
  handleDatePicked = (value) => {
    this.setState({ value: value });
    this.hideDateTimePicker();
  };
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
  update_case_result_list() {
    if (this._isMounted) {
        this.setState({ loader: true});
        this.setState({ nullbody: true});
      axios
        .post(
          `${BASE_URL_BDLAW}/public/api/update_case_for_apps_court_wise`,{
            court_id:this.state.court_id,
            search_date: moment(this.state.date_t).format(this.state.sFormat),
            Running_case: this.state.Running_case,
            bench_id:this.state.bench_id 
          }
        )
        .then((res) => {
          this.componentDidMount();
          this.setState({ EndLoader: 1});          
        }).catch((error) => {
          console.log(error);
        });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    window.history.pushState(null, null, document.URL);
    this.setState({ resultData: [] });
    this.setState({ previousDate: [] });
    this.setState({ previousDatTime: [] });
    this.setState({ previousResultData: [] });
    this.setState({ alldata: [] });
    this.setState({ htmlTest: [] });
    this.setState({ dataSourceCords: [] });
}
  componentDidMount() {
    this._isMounted = true;
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
    }).start();
    if (this._isMounted) {
      axios
      .get(
        `${BASE_URL_SIDDIQUE}/public/api/getCaseResultMaxDate`
      )
      .then((resData) => {
        this.setState({ maxDate: resData.data });
      }).catch((error) => {
        console.log(error);
      });
    }
    NetInfo.fetch().then(state => {
      this.setState({ isNetConnected: state.isConnected });
    });
   const { sFormat } = this.state;
    this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          if (this._isMounted) {
            this.setState({ loader: true});
            this.setState({ nullbody: true});
                        axios
                          .post(
                            `${BASE_URL_SIDDIQUE}/public/api/getHDRunningResult`,{
                            court_id:this.state.court_id,
                            date: moment(this.state.date_t).format(sFormat),
                            Running_case: this.state.Running_case,
                            bench_id:this.state.bench_id    
                            }
                          )
                          .then((res) => {
                            let newDirectory = Object.values(res.data.alldata.reduce((acc, item) => {
                              if (!acc[item.what_for]) acc[item.what_for] = {
                                what_for: item.what_for,
                                  job: []
                              };
                              acc[item.what_for].job.push(item);
                              return acc;
                            }, {}))
                          let resultData = this.state.court_id+this.state.date_t+this.state.bench_id;
                          this.setState({
                              htmlTest: newDirectory,
                              loading: true,
                              loader: false,
                              nullbody: false
                            });
              });
          }
        }
      });
  }
  getItemLayout(data, index) {
    return { length: styles.listItem.height, offset: styles.listItem.height * index, index };
  }
  onEndReached = () => {
    this.setState({ EndLoader: 0});
    if (!this.onEndReachedCalledDuringMomentum) {     
        this.onEndReachedCalledDuringMomentum = true;
    }
}
onMomentumScrollBegin = () => { this.onEndReachedCalledDuringMomentum = false; }
  render() {
    const { alldata, displayFormat, wahtfor_id, source, htmlTest } = this.state;
    const ListFooterComponent = (
      <View style={styles.listFooter}>
        <ActivityIndicator animating={true} size="large" color="#00ff00" />
      </View>
    )
    return (
      <View style={styles.container}> 
        <TouchableOpacity style={styles.LawyerInfo} disabled={true}>
         {(() => {
                  if ( this.state.court_N.includes('Blank List') || this.state.court_N.includes('Lawazima Court') ){
                    return (
                      <Text style={styles.LawyerInfoText}>
                         Court No. {this.state.court_N},{"\n"} Date: {moment(this.state.date_t).format(displayFormat)}
                      </Text>   
                    )
                  }
                  else{
                    return (
                      <Text style={styles.LawyerInfoText}>
                           Court No. {this.state.court_N}, Date: {moment(this.state.date_t).format(displayFormat)} 
                      </Text>  
                    )
                  }               
                }
          )()}
          <Text style={styles.LawyerInfoText}>
            {this.state.judg_name.replace(/\s\s+/g, ' ')} 
          </Text>
          {this.state.loader == true && (() => {
                  if (   moment(new Date()).format(displayFormat) == moment(this.state.maxDate).format(displayFormat)){
                    return (
                      <TouchableOpacity style={styles.buttonRefresh} >
                       <Text style={styles.buttonTextRefresh}><Text style={styles.buttonTextResult}>For Latest Result<AntDesign name="arrowright" size={14} color="black" /></Text> Refresh</Text>
                     </TouchableOpacity>  
                  )
                  }
                  else{
                    return null;
                  }              
                })()
            }
            {this.state.loader == false && (() => {
                  if (   moment(new Date()).format(displayFormat) == moment(this.state.maxDate).format(displayFormat)){
                    return (
                      <TouchableOpacity style={styles.buttonRefresh} onPress={() =>this.update_case_result_list() } >
                       <Text style={styles.buttonTextRefresh}><Text style={styles.buttonTextResult}>For Latest Result<AntDesign name="arrowright" size={14} color="black" /></Text> Refresh</Text>
                     </TouchableOpacity>  
                  )
                  }
                  else{
                    return null;
                  }             
                })()
            }
        </TouchableOpacity>
        <SafeAreaView style={styles.container}>
                {this.state.loader == true &&
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop:-300 }}>
                    <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                 }
                  {this.state.nullbody  == false &&   
                    <ScrollView keyboardShouldPersistTaps="always" scrollIndicatorInsets={{ right: 1 }} >
                        <View style={styles.container_border}>
                        {this.state.htmlTest.length >0 && 
                            <View style={styles.hddatamain}>
                          <ScrollView horizontal={true}>
                                <FlatList
                                        data={htmlTest}
                                        onScroll={this.handleScroll}
                                        keyExtractor={(item) => item.what_for.toString()}
                                        showsVerticalScrollIndicator={false}
                                        bounces={false}
                                        numColumns={1}
                                        renderItem={({ item, index }) => (
                                          <View	key={index} >
                                              <View style={{ flexDirection: "row"}}>
                                                <TouchableOpacity style={{ flexDirection: "row", padding: 0}}>
                                                  <Text style={styles.texth}>
                                                    {item.what_for.replace(/<[^>]*>/g, '').replace(/\s\s+/g, ' ')}
                                                  </Text>
                                                </TouchableOpacity> 
                                              </View>
                                              {
                                                item.job.map(item => (
                                                  <View	key={item.sl} >
                                                      <View  style={ (item.sl == item.running || item.sl == this.state.Running_case) ? styles.selectClass : styles.hddata }  >
                                                        <TouchableOpacity disabled={true} style={{ flexDirection: "row", padding: 0}}>
                                                            <Text style={styles.textTile}>Serial</Text>
                                                            <Text style={styles.textTilecln}>:</Text>
                                                            <Text style={styles.textDescription}>{item.sl}  {(item.sl == item.running || item.sl == this.state.Running_case) ? <View><Image source={{uri: 'https://reactnative.bdlawservice.com/public/uploads/anim2.gif'}}  style={{width: 29, height: 15, marginTop:-10,  marginLeft:100}} /></View> : ""}  </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity disabled={true} style={{ flexDirection: "row", padding: 0}}>
                                                            <Text style={styles.textTile}>Case No.</Text>
                                                            <Text style={styles.textTilecln}>:</Text>
                                                          <Text style={styles.textDescription}>{item.case_number.replace(/<[^>]*>/g, '').replace(/\s\s+/g, '')}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity disabled={true} style={{ flexDirection: "row", padding: 0}}>
                                                            <Text style={styles.textTile}>Parties</Text>
                                                            <Text style={styles.textTilecln}>:</Text>
                                                            <Text style={styles.textDescription}>{item.parties}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity disabled={true} style={{ flexDirection: "row", padding: 0}}>
                                                            <Text style={styles.textTile}>Result</Text>
                                                            <Text style={styles.textTilecln}>:</Text>
                                                            <Text style={styles.textDescription}>{item.result}</Text>
                                                          </TouchableOpacity>
                                                    </View>
                                                  </View>
                                                ))
                                              }
                                        </View>
                                          )}
                                        ItemSeparatorComponent={this.ItemSeparatorComponent}
                                        ListEmptyComponent={this.ListEmptyComponent}
                                        removeClippedSubviews={true}
                                        initialNumToRender={1}
                                        maxToRenderPerBatch={1}
                                        onEndReachedThreshold={0.1}
                                        onMomentumScrollBegin={this.onMomentumScrollBegin}
                                        onEndReached={this.onEndReached}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.handleRefresh}
                                        updateCellsBatchingPeriod={10}
                                        ListFooterComponent={() => (this.state.EndLoader && this.state.htmlTest.length > 0) ? ListFooterComponent : null}
                                        windowSize={10}
                                />
                        </ScrollView>
                              </View>
                          }
                          { !this.state.EndLoader &&  this.state.htmlTest.length >0 && (() => {
                              return ( 
                            <View style={styles.hddatamaintwo}> 
                                <Text style={{textAlign:"center", fontSize: 20}}>
                                    End.
                                </Text>     
                              </View>             
                          )})()
                          }
                        { this.state.htmlTest.length == 0 && (() => {
                              return ( 
                            <View style={styles.hddatamaintwo}> 
                                <Text style={{textAlign:"center", fontSize: 20}}>
                                  No List Found.
                                </Text>     
                              </View>            
                          )})()
                          }
                      </View>
                      <View style={{marginBottom:40}}></View>
                  </ScrollView>
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
const classStyles = { 
  screen: {
    marginTop: 18,
  },
  header: {
    fontSize: 30,
    color: "#FFF",
    marginTop: 10,
    padding: 2,
    backgroundColor: "#C2185B",
    textAlign: "center",
  },
  row: {
    marginHorizontal: 15,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  rowText: {
    fontSize: 18,
  },
  "hddatah": {
      flexDirection: "row",
      marginTop:2,
      backgroundColor: "#FFF",
      width:responsiveWidth(93),
    },
    "selectClass": {	
        marginTop:4,
        borderWidth: 4,
        borderRadius: 4,
        fontSize: 18,
        padding:4,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: '#dcffe4',
        width:responsiveWidth(92.7),
      },
    "TouchClass": {
      flexDirection: "row",
      padding: 0,
    },
    "hddata": {
      padding: 5,
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 6,
      marginTop:5,
      marginBottom:0,
      marginLeft:1,
      marginRight:1,
      backgroundColor: "#FFFFBD",
      width:responsiveWidth(92.7),
    },
    "texth":{
     fontSize: 18,
     alignItems: "center",
     textAlign: "center",
     justifyContent: "center",
     flexDirection: "row",
     width:responsiveWidth(90),
   },
   "textTile":{
     fontSize: 14,
     width:responsiveWidth(17),
   },
   "CaseTypeNoTile":{
     fontSize: 14,
     alignItems: "center",
     justifyContent: "center",
     width:99,
   },
   "textTilecln":{
     fontSize: 16,
     width:8,
   },
   "textDescription":{
     paddingTop:3,
     fontSize: 13,
     width:responsiveWidth(70),
   },
   "textParties":{
     fontSize: 8,
     paddingTop:8,
   },
   "titleText": {
     fontSize: 30,
     alignItems: "center",
     justifyContent: "center",
   },
   "LawyerInfo": {
     padding: 5,
     borderWidth: 1,
     borderColor: "white",
     borderRadius: 6,
     alignItems: "center",
     marginTop:5,
   },
   "LawyerInfoText": {
     fontSize: 16,
     alignItems: "center",
     justifyContent: "center",
     textAlign:"center",
     color: "white",
   },
};
const tagsStyles = {
  h1: {
    color: '#6728C7',
    textAlign: 'center',
    marginBottom: 10
  },
  img: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20
  },
  p: {
    textAlign: "justify",
    width:responsiveWidth(92),
  },
   li: {
    textAlign: "justify",
    width:responsiveWidth(92),
  },
  br: {
    textAlign: "justify",
    width:responsiveWidth(92),
    marginBottom:5
  }
}
const styles = StyleSheet.create({
  listFooter: {
    paddingVertical: 1,
    marginTop:4,
  },
  Court_SL_style: {	
    color: "#ffff00",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0373BB",
  },
  buttonRefresh: {
    backgroundColor: "#FFFFBD",
    height: 26,
    paddingTop: 0,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 6,
    marginTop: 3,
    marginRight:15,
    alignItems: "center",
    alignSelf: 'flex-end', 
    flexDirection:'row',
    width:230
  },
  buttonTextRefresh: {
    fontSize: 17,
    color: "#000",
    textAlign: 'center',
    width:'100%'
  },
  buttonTextResult: {
    color:"#000",
    borderRadius: 6,
    width:'100%'
  },
    selectClass: {	
      marginTop:4,
      borderWidth: 4,
      borderRadius: 4,
      fontSize: 18,
      padding:4,
      borderColor: 'rgba(0,0,0,0.2)',
      backgroundColor: '#dcffe4',
      width:responsiveWidth(93.3),
    },
  container_border:{
    borderRadius: 4,
    width:responsiveWidth(99),
    borderWidth: 4,
    borderColor: "#ff8566",
  },
  hddatamain: {
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginBottom:0,
    backgroundColor: "#FFF",
    width:responsiveWidth(96.6),
    height:responsiveHeight(70)
  },
  hddatamaintwo: {
    padding: 15,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:3,
    marginBottom:3,
    backgroundColor: "#FFF",
    width:responsiveWidth(96.6),
  },
  hddatah: {
    marginTop:2,
    backgroundColor: "#FFF",
    width:responsiveWidth(93),
  },
  texth:{
    fontSize: 18,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    flexDirection: "row",
    width:responsiveWidth(90),
  },
  textTile:{
    fontSize: 14,
     width:responsiveWidth(17),
  },
  CaseTypeNoTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:99,
  },
  textTilecln:{
    fontSize: 16,
     width:8,
  },
  textDescription:{
    paddingTop:3,
    fontSize: 13,
    width:responsiveWidth(70),
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
    alignItems: "center",
    marginTop:5,
    width:'97%'
  },
  LawyerInfoText_SL: {
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
    textAlign:"center",
    color: "white",
  },
  LawyerInfoText: {
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    textAlign:"center",
    color: "white",
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
    marginLeft:1,
    marginRight:1,
    backgroundColor: "#FFFFBD",
    width:responsiveWidth(93),
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
});