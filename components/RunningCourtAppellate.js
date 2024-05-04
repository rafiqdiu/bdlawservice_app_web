import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import {BASE_URL_SIDDIQUE} from './BaseUrl';
export default class AppellateDivision extends Component {
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
      maxDate:'',
      isNetConnected:'',
      fadeAnimation: new Animated.Value(0)
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
  componentDidMount() {
    window.history.pushState(null, null, document.URL);
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
    }).start();
    NetInfo.fetch().then(state => {
      this.setState({ isNetConnected: state.isConnected });
    });
    this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          this.setState({ lawyerCode: value });
          this.setState({ loader: true});
          this.setState({ nullbody: true})
          axios
            .get(
               `${BASE_URL_SIDDIQUE}/public/api/getSupremeCourtData`
            )
            .then((res) => {
              this.setState({ lawyerData: res.data });
              this.setState({ loading: true});
              this.setState({ loader: false});
              this.setState({ nullbody: false})
            });
        }
      });
  }
  render() {
    const { label, value, show, mode, displayFormat, dateFormat, dateTimeFormat } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.LawyerInfo}>
          <Text style={styles.LawyerInfoText}>
          Running court List : Appellate Division Court Division
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
         <Text style={styles.LawyerInfoText}>
            Running Court List Date : 
         </Text>
       </View>
       {this.state.dateError !=""  &&
        <Text style={styles.errorColor}>{this.state.dateError}</Text>
        }
        <SafeAreaView style={styles.container}>
        {this.state.loader == true &&
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        }
          {this.state.nullbody  == false &&   
          <ScrollView style={{ marginBottom: 5 }}>
            {this.state.lawyerData.map((item)=> {
              return (
                <View style={[styles.hddata,{ flexDirection: "row"}]} key={item.sl}>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0}}>
                      <Text style={styles.textTile}>Serial</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{parseInt(item.sl)+1}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Honorable Judges Name</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.jud_name }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Court No.</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.court }</Text>
                    </TouchableOpacity>
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
              )
            })
            }
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
const styles = StyleSheet.create({
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
    width:100,
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
    width:'70%',
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