import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  FlatList, Switch,
  Dimensions
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE} from './BaseUrl';
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
import moment from "moment";
const windowHeight = Dimensions.get("window").height;
export default class RunningCourt extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      jsonData: "",
      lawyerData: [],
      DataDate:"",
      lawyerCode: "",
      lawyer_name: "",
      mobile: "",
      address: "",
      phone: "",
      show: false,
      sortlist: false,
      value: "",
      mode: "date",
      displayFormat: "DD-MM-YYYY",
      sFormat: "YYYY-MM-DD",
      dateFormat: "DD/MM/YYYY",
      dateTimeFormat: "DD/MM/YYYY - hh:mm a",
      label: "Date",
      loading: false,
      isDraft: "",
      currect_date:new Date(),
      showing_date:"",
      previousDate:[],
      previousDatTime: [],
      previousResultData: [],
      loader: false,
      nullbody:true,
      maxDate:'',
      clickMaxDate:'',
      fadeAnimation: new Animated.Value(0),
      scrollOffsetAnim: new Animated.Value(0),
      wholeHeight: 1,
      visibleHeight: 0,
      arrow:'->',
      refreshing: true,
      EndLoader: 1,
      selected_sl: 0,
    };
  }
  showDateTimePicker = () => {
    this.setState({ show: true });
  };
  hideDateTimePicker = () => {
    this.setState({ show: false });
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
  sortAlphaNum = (a, b) => {
    const reg = /[0-9]+/g;
    let v0 = a.court.replace(reg, v => v.padStart(10, '0'));
     let v1 = b.court.replace(reg, v => v.padStart(10, '0'));
     return v0.localeCompare(v1);
};
componentWillUnmount() {
    this._isMounted = false;
    this.setState({ lawyerData: [] });
    this.setState({ previousDate: [] });
    this.setState({ previousDatTime: [] });
    this.setState({ previousResultData: [] });
}
  componentDidMount() {
    this._isMounted = true;
    window.history.pushState(null, null, document.URL);
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
    const { label, value, show, mode, displayFormat,dateFormat,sFormat } = this.state;
    this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          if (this._isMounted) {
          this.setState({ lawyerCode: value });
          this.setState({ loader: true});
          this.setState({ nullbody: true});
          axios
            .post(
               `${BASE_URL_SIDDIQUE}/public/api/getSupremeCourtDataCache`,{
                search_date: moment(this.state.clickMaxDate ? this.state.clickMaxDate:this.state.currect_date).format(dateFormat),
                s_date: moment(this.state.clickMaxDate ? this.state.clickMaxDate:this.state.currect_date).format(sFormat)  
              }
            )
            .then((res) => {
                if(this.state.sortlist){
                this.setState({ lawyerData: res.data.link.sort(this.sortAlphaNum)});
                }else{
                  this.setState({ lawyerData: res.data.link });
                }
                  this.setState({ DataDate: res.data.date_to });
                  this.setState({ loading: true});
                  this.setState({ loader: false});
                  this.setState({ nullbody: false})
                  this.setState({ EndLoader: 1});
            }).catch((error) => {
              console.log(error);
            });
          } 
        }
      }).catch((error) => {
        console.log(error);
      });
  }
  update_sort_list() {
    const { sFormat } = this.state;
        if (this._isMounted) {
        this.setState(state => ({
          sortlist: !state.sortlist,
        }));
        this.getCaseListData();
      }
  }
  update_case_list() {
    const { sFormat } = this.state;
        if (this._isMounted) {
          this.setState({ loader: true});
          this.setState({ nullbody: true});
        axios
          .post(
             `${BASE_URL_BDLAW}/public/api/SupremeCourtUpdateCase`,{
              search_date: moment(this.state.clickMaxDate ? this.state.clickMaxDate:this.state.currect_date).format(sFormat)
            }
          )
          .then((res) => {
            this.getCaseListData();
          }).catch((error) => {
            console.log(error);
          });
      }
  }
  getCaseListData() {
    const { label, value, show, mode,maxDate, displayFormat,dateFormat,sFormat } = this.state;
    if (this._isMounted) {
      this.setState({ loader: true});
      this.setState({ nullbody: true});
      this.setState({ showing_date: maxDate});
     axios
      .post(
          `${BASE_URL_SIDDIQUE}/public/api/getSupremeCourtDataCache`,{
          search_date: moment(this.state.clickMaxDate ? this.state.clickMaxDate:this.state.currect_date).format(dateFormat),
          s_date: moment(this.state.clickMaxDate ? this.state.clickMaxDate:this.state.currect_date).format(sFormat)
        }
      )
      .then((res) => {
              if(this.state.sortlist){
                this.setState({ lawyerData: res.data.link.sort(this.sortAlphaNum)});
              }else{
                this.setState({ lawyerData: res.data.link });
              }
        this.setState({ DataDate: res.data.date_to });
        this.setState({ loading: true});
        this.setState({ loader: false});
        this.setState({ nullbody: false})
        this.setState({ EndLoader: 1});
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  GetMaxDateData() {
    const { label, value, show, mode,maxDate, displayFormat,dateFormat,sFormat } = this.state;
    if (this._isMounted) {
        this.setState({ loader: true});
        this.setState({ nullbody: true});
        this.setState({ clickMaxDate: maxDate});
        this.componentDidMount();
      }
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
    Click(key) {
        this.setState({ selected_sl: key });
    }
  render() {
    const { offset, limit, label, value, showing_date, clickMaxDate, show, mode, displayFormat, maxDate, sFormat, dateFormat, dateTimeFormat } = this.state;
    const ListFooterComponent = (
      <View style={styles.listFooter}>
        <ActivityIndicator animating={true} size="large" color="#00ff00" />
      </View>
    )
    return (
      <View style={styles.container}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: 2}}>
                <TextInput
                  value={clickMaxDate ? moment(clickMaxDate).format(displayFormat) :  moment(new Date()).format(displayFormat) }
                  pointerEvents="none"
                  showSoftInputOnFocus={false}
                  placeholder="dd-mm-yyyy"
                  placeholderTextColor="white"
                  style={styles.input}
                /> 
             { this.state.loader == true && (() => {
                  if (   moment(new Date()).format(sFormat) == maxDate){
                    return (
                      <TouchableOpacity style={styles.buttonRefresh} >
                        <Text style={styles.buttonTextRefresh}>Refresh</Text>
                      </TouchableOpacity>  
                  )
                  }
                  else{
                    return null;
                  }
                                  
                })()
                  }
              { this.state.loader == false && (() => {
                  if (   moment(new Date()).format(sFormat) == maxDate){
                    return (
                      <TouchableOpacity style={styles.buttonRefresh} onPress={() =>this.update_case_list() } >
                         <Text style={styles.buttonTextRefresh}>Refresh</Text>
                      </TouchableOpacity>  
                  )
                  }
                  else{
                    return null;
                  }
                                  
                })()
                  }
                {this.state.loader == true && (() => {
                  if ( maxDate > moment(new Date()).format(sFormat)){
                    return (
                      <TouchableOpacity style={styles.buttonNexDate}>
                        <Text style={styles.buttonTextRefresh}>Next Date</Text>
                      </TouchableOpacity>  
                  )
                  }
                  else{
                    return null;
                  }              
                })()
                  }
                {this.state.loader == false && (() => {
                  if ( maxDate > moment(new Date()).format(sFormat)){
                    return (
                      <TouchableOpacity style={styles.buttonNexDate} onPress={() =>this.GetMaxDateData() } >
                        <Text style={styles.buttonTextRefresh}>Next Date</Text>
                      </TouchableOpacity>  
                  )
                  }
                  else{
                    return null;
                  }                
                })()
                  }
              <View  style={{ flex:1, marginLeft:5,  flexDirection: 'row' }}>
                  <View style= {{marginRight:0 }}>
                  <Text style={{ color:'#fff', fontWeight:'bold',fontSize:14, marginTop:8     }}>Justice Wise</Text>
                      <Text style={{ color:'#FFDF00', fontWeight:'bold', fontSize:14,  }}>Court No. Wise</Text>
                  </View>
                  <View style= {{marginRight:10,marginLeft:-20,marginTop:4}}>
                      <Switch
                       style={{ transform: [{ rotate: '90deg'}], justifyContent: "flex-start", alignItems: "flex-start",  width: 70 }}
                          trackColor={{ false: '#FFDF00', true: '#f4f3f4' }}
                          thumbColor={this.state.sortlist ? '#FFDF00' : '#f4f3f4'}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={() =>this.update_sort_list() }
                          value={this.state.sortlist}
                        />
                  </View>
              </View> 
            </View> 
        <SafeAreaView style={styles.container}>  
        {this.state.loader == true &&
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop:-300 }}>
            <ActivityIndicator animating size="large" color="#00ff00" />
          </View>
        }
          {this.state.nullbody  == false &&   
        <ScrollView  scrollIndicatorInsets={{ right: 1 }} >
             <View style={styles.container_border}  >
             {this.state.lawyerData.length >0 &&   
             <View style={styles.hddatamain}>
            <ScrollView horizontal={true}>
                <FlatList
                        data={this.state.lawyerData}
                      onScroll={this.handleScroll}
                      keyExtractor={(item) => item.sl.toString()}
                      showsVerticalScrollIndicator={false}
                      bounces={false}
                      numColumns={1}
                      renderItem={({ item }) => (
                        <View key={item.sl} style={ (item.sl == this.state.selected_sl) ? styles.selectClass : styles.hddata }  >
                 {(() => {
                   if(this.state.sortlist){
                    return (<>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile1}>Court No.</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription1}>{item.court } </Text><Text style={{ width:80, paddingRight:20, textAlign:"center"}}>SL-{String(item.sl).padStart(2, '0')}</Text>
                    </TouchableOpacity>
                      <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Judges Name</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.jud_name.replace(/\s\s+/g, ' ') }</Text>
                    </TouchableOpacity>
                    </>
                    )
                  }
                  else{
                    return (<>
                      <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                            <Text style={styles.textTile}>Judges Name</Text>
                            <Text style={styles.textTilecln}>:</Text>
                            <Text style={styles.textDescription}>{item.jud_name.replace(/\s\s+/g, ' ') }</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                            <Text style={styles.textTile1}>Court No.</Text>
                            <Text style={styles.textTilecln}>:</Text>
                            <Text style={styles.textDescription1}>{item.court }</Text><Text style={{ width:80, paddingRight:20, textAlign:"center"}}>SL-{String(item.sl).padStart(2, '0')}</Text>
                          </TouchableOpacity>
                          </>
                    )
                  }               
                }
          )()}
                          <View style={{ flexDirection: "row", padding: 0   }}>
                          <View style={{ flexDirection: "column", width:responsiveWidth(42),alignContent:'flex-start' }}>
                          <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                            <Text style={styles.textTile}>Total cases</Text>
                            <Text style={styles.textTilecln}>:</Text>
                            <Text style={styles.textDescription}>{item.totalc }</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                            <Text style={styles.textTile}>Result given</Text>
                            <Text style={styles.textTilecln}>:</Text>
                            <Text style={styles.textDescription}>{item.given}</Text>
                          </TouchableOpacity> 
                          <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                            <Text style={styles.textTile}>Running now</Text>
                            <Text style={styles.textTilecln}>:</Text>
                            <Text style={styles.textDescription}>{item.Running}</Text>
                          </TouchableOpacity>  
                          </View>
                          <TouchableOpacity
                             onPress={() => this.props.navigation.navigate('RunningCourtDetails',{
                            param:item.r_link,
                            judg:item.jud_name,
                            date_t:item.date_t,
                            court_N:item.court,
                            Running:item.Running,
                            court_id:item.court_id,
                            bench_id:item.bench_id,
                            court_sl:item.sl,
                          },(this.Click.bind(this))(parseInt(item.sl)) )
                        }
                          >
                            <View style={styles.details}>
                                <Text style={{width:responsiveWidth(37), padding:20,}}> Court Page </Text>                            
                            </View>
                          </TouchableOpacity>
                        </View>      
                      </View>
                        )}
                      ItemSeparatorComponent={this.ItemSeparatorComponent}
                      ListEmptyComponent={this.ListEmptyComponent}
                      removeClippedSubviews={true}
                      initialNumToRender={16}
                      maxToRenderPerBatch={22}
                      onEndReachedThreshold={0.1}
                      onMomentumScrollBegin={this.onMomentumScrollBegin}
                      onEndReached={this.onEndReached}
                      refreshing={this.state.refreshing}
                      onRefresh={this.handleRefresh}
                      updateCellsBatchingPeriod={50}
                      ListFooterComponent={() => (this.state.EndLoader && this.state.lawyerData.length > 0) ? ListFooterComponent : null}
                      windowSize={10}
                    />
        </ScrollView>
     </View>
    }
          { !this.state.EndLoader &&  this.state.lawyerData.length >0 && (() => {
                 return ( 
               <View style={styles.hddatamaintwo}> 
                  <Text style={{textAlign:"center", fontSize: 20}}>
                      End.
                  </Text>     
                </View>   
                                
            )})()
            }
          { this.state.lawyerData.length ==0 && (() => {
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
                opacity: this.state.fadeAnimation,
              },
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
  listFooter: {
    paddingVertical: 1,
    marginTop:4,
  },
  selectClass: {	
     width:responsiveWidth(93.3),
    padding: 5,
    borderWidth: 2.5,
    borderColor: "red",
    borderRadius: 6,
    marginTop:5,
    marginBottom:0,
    backgroundColor: "#FFFFBD",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0373BB",
  },
  indicator: {
    backgroundColor: 'black',
    borderRadius: 3,
    width: 6,
  },
  details: {
    paddingHorizontal:5,
    paddingVertical:0,
    borderWidth: .5,
    borderColor: "red",
    borderRadius: 6,
    marginTop:5,
    marginLeft:20
  },
  hddatamain: {
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginBottom:0,
    backgroundColor: "#FFF",
    width:responsiveWidth(96.6),
    height:windowHeight-150
  },
  hddatamaintwo: {
    padding: 15,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:3,
    marginBottom:3,
    backgroundColor: "#FFF",
    width:responsiveWidth(96.7),
  },
  textTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:90,
    color:"#000"
  },
  textTile1:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:90,
    color:"#000"
  },
  textTiles:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:90,
    color:"red"
  },
  textTilecln:{
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    width:8,
    color:"#000"
  },
  textTileclns:{
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    width:8,
    color:"red",
  },
  textDescription:{
    paddingTop:2,
    fontSize: 13,
    width:'73%',
    color:"#000"
  },
  textDescription1:{
    paddingTop:2,
    fontSize: 13,
    width:'50%',
    color:"#000",
    marginRight:10
  },
  textDescriptions:{
    paddingTop:2,
    fontSize: 13,
    width:'74%',
    color:"red",
  },
  CaseTypeNoTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:99,
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
  },
  LawyerInfoText: {
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#419641",
    width: 120,
    height: 36,
    padding: 3,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    marginTop: 10,
    marginLeft:10
  },
  buttonRefresh: {
    alignItems: "center",
    backgroundColor: "#FFFFBD",
    width: 75,
    height: 36,
    paddingTop: 5,
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 3,
    borderWidth: 1,
    borderColor: "red",
    color:"#000",
    borderRadius: 6,
    marginTop: 10,
    marginLeft:10,
  },
  buttonNexDate: {
    alignItems: "center",
    backgroundColor: "#FFFFBD",
    width: 85,
    height: 36,
    paddingTop: 5,
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 3,
    borderWidth: 1,
    borderColor: "red",
    color:"#000",
    borderRadius: 6,
    marginTop: 10,
    marginLeft:10
  },
  buttonTextRefresh: {
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    width:'100%',
    textAlign:'center'
  },
  buttonText: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
  },
  input: {
    width: 135,
    fontSize: 22,
    height: 36,
    paddingLeft: 7,
    borderWidth: 1,
    marginTop: 10,
    borderColor: "white",
    color: "white",
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
    backgroundColor: "#FFFFBD",
    width:responsiveWidth(93.3),
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
  container_border:{
    borderRadius: 4,
    width:responsiveWidth(99),
    borderWidth: 4,
    borderColor: "#ff8566",
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