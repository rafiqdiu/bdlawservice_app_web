import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
export default class AppellateAccess extends Component {
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
      value: "",
      mode: "date",
      displayFormat: "DD-MM-YYYY",
      dateFormat: "DD/MM/YYYY",
      dateTimeFormat: "DD/MM/YYYY - hh:mm a",
      label: "Date",
      loading: false,
      dateError: '',
      isDraft: "",
      currect_date:new Date(),
      previousDate:[],
      previousDatTime: [],
      previousResultData: [],
      loader: false,
      nullbody:true,
      maxDate:'',
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
  componentWillUnmount() {
    this._isMounted = false;
    this.setState({ lawyerData: [] });
    this.setState({ previousDate: [] });
    this.setState({ previousDatTime: [] });
    this.setState({ previousResultData: [] });
  }
  componentDidMount() {
    this._isMounted = true;
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
    }).start();
    NetInfo.fetch().then(state => {
      this.setState({ isNetConnected: state.isConnected });
    });
    const { label, value, show, mode, displayFormat,dateFormat } = this.state;
    this._loadInitialState() // returns promise, so process in chain
      .then((value) => {
        if (value !== null) {
          if (this._isMounted) {
          }
        }
      });
  }
  render() {
    const { label, value, show, mode, displayFormat, dateFormat, dateTimeFormat } = this.state;
    return (
      <View style={styles.container}>
    <View style={{alignItems:'center'}}>
      <View style={[styles.card, styles.shadowProp]}>
        <View>
          <Text style={styles.heading}>
          You are not Appellate Division search list user. If you want this service please contact with Siddique Enterprise Ltd.
          </Text>
        </View>
      </View>
      <View style={[styles.card1, styles.shadowProp]}>
        <View>
        <Text style={styles.headBody}>
        Address
          </Text>
          <Text style={styles.hBody}>
          Room No- 45 & 60 (Ground Floor),{'\n'}Supreme Court Bar Association Bhaban,{'\n'}Shahbagh, Dhaka, Bangladesh.{'\n'} Hotline: 01760 200 200
          </Text>
        </View>
      </View>
      </View>
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 13,
    textAlign:'center',
    color:'red'
  },
  headBody: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 13,
    color:'black',
    textAlign:'center',
    textDecorationLine:'underline'
  },
  hBody: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 13,
    color:'black',
    textAlign:'center'
  },
  card: {
    marginTop:0,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal:15,
    width: '95%',
    marginVertical: 10,
  },
  card1: {
    marginTop:20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal:15,
    width: '95%',
    marginVertical: 10,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  details: {
    padding: 5,
    borderWidth: .5,
    borderColor: "red",
    borderRadius: 6,
  },
  hddatamaintwo: {
    padding: 30,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    marginTop:5,
    marginBottom:0,
    backgroundColor: "#FFF",
    width:responsiveWidth(95),
  },
  textTile:{
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(28),
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
    width:responsiveWidth(60),
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
    width: 80,
    height: 36,
    padding: 3,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    marginTop: 4,
    marginLeft:10
  },
  buttonText: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  input: {
    width: 140,
    fontSize: 22,
    height: 36,
    paddingLeft: 10,
    borderWidth: 1,
    marginTop: 4,
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
    width:responsiveWidth(97),
    borderWidth: 4,
    borderColor: "#ff8566",
  },
  noItems: {
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
    textAlign:"center",
    color: "#FFF",
    paddingLeft:0,
    width:300,
    paddingTop:20,
    paddingBottom:400,
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