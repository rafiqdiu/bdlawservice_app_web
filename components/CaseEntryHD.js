import {Picker} from '@react-native-picker/picker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import React, {useEffect,createRef, useState} from 'react';
import {BASE_URL_SIDDIQUE_ADMIN} from './BaseUrl';
import TopBar from './TopBar';
import {
  Platform,
  Dimensions,
  TouchableOpacity,
  Keyboard, 
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import * as yup from 'yup';
import { responsiveHeight,responsiveWidth } from 'react-native-responsive-dimensions';
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get('window').width;
const registerSchema = yup.object({  //register validation schema
  case_no: yup.string().matches(/^[0-9]+$/, "Must be only digits").required('Case No. is required'), 
    year: yup
    .string().matches(/^[0-9]+$/, "Must be only digits")
    .required('Year is required')
    .min(4, 'Must be exactly 4 digits')
    .max(4, 'Must be exactly 4 digits'),
    types_name: yup.string().required('Case Type is required'), 
  Pr_Name: yup
    .string()
    .required('Petitioner / Respondent is required'),
});
const otpSchema = yup.object({
  OtpKey: yup
    .string()
    .required('Otp is required')
    .length(4, 'Otp must be  4 charaters'),
});
function CaseEntryHD() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const [showRule, setShowRule] = useState(false);
  const [userId, setUser_id] = useState(null);
  const [lawyerName, setLawyerName] = useState(null);
  const [mySuperStoreHd, setMySuperStoreHd] = useState(null);
  
  
  const [DId, setDevice_id] = useState(null);
  const [DInfo, setDevice_info] = useState(null);
  const [types, setTypes] = useState([]);
  const [district, setDistrict] = useState([]);
  const [select_date, setselectdate] = useState(null);
  const [totalCases, setTotalCases] = useState([]);
  const formikElement = createRef(null); 
  const [cases, setCases] = useState({
    type:'',
    case_no:'',
    year:'',
    pr:'',
    remarks:'',  
});
  const filterdistrictResults = division_id =>
  setDistrict(_district =>
    alldistrict.filter(dist => dist.division_id === division_id),
  );
const filtercourtResults = district_id =>
  setCourt(_court =>
    allCourt.filter(dist => dist.geo_district_id === district_id),
  );
const [type_id, setCaseTypeId] = useState(null);
const [pr_id, setPrId] = useState(null);
const [Rule, setRuleId] = useState(null);
const [type_name, setCaseTypeName] = useState(null);
const [is_remarks_permission, setIsRemarksPermission] = useState(0);
const [district_id, setDistrictId] = useState(null);
const serializeErrors = (errors) => {
  return Object.values(errors).join(" ");
};
const _fetchTypeData = async () => {
  try {
    let url = `${BASE_URL_SIDDIQUE_ADMIN}/public/api/casetype`;
    let response = await axios.post(url).then(res => res.data);
    return response;
  } catch (err) {
    console.log('Error', err);
  }
};
const _fetchDistrictData = async (data) => {
  try {let dataToSend = {
    division_id: data,
    };
  let formBody = [];
  for (let key in dataToSend) {
    let encodedKey = encodeURIComponent(key);
    let encodedValue = encodeURIComponent(dataToSend[key]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
    let url = `/DivisionToDistrict`;
    let response = await axios.post(url, formBody).then(res => res.data);
    return response;
  } catch (err) {
    console.log('Error', err);
  }
};
const showDatePicker = () => {
  setDatePickerVisibility(true);
};
const hideDatePicker = () => {
  setDatePickerVisibility(false);
};
const handleConfirm = (val) => {
  setselectdate(  val );
  hideDatePicker();
};
const [visible, setVisible] = React.useState(false)
const onDismiss = React.useCallback(() => {
  setVisible(false)
}, [setVisible])
const [date, setDate] = React.useState();
const onChangeSingle = React.useCallback(
  (params) => {
    setVisible(false) 
    setDate(params.date)
  },
  [setVisible, setDate]
)
const pastDate = new Date(new Date().setDate(new Date().getDate() - 500000));
const futureDate = new Date(new Date().setDate(new Date().getDate() + 500000));
const locale = 'en-GB';
  const UType = [
    {label: 'Advocate', value: '1'},
    {label: 'Organisation', value: '2'},
  ];
  const updateUType = (handleChange, value) => {
    handleChange(value);
  };
  useFocusEffect(
    React.useCallback(() => {
      _loadInitialState()
      .then(lawyer_code => {
        {setTimeout(
          async () => {
            try {
              const value = await AsyncStorage.getItem('MySuperStoreHd'+lawyer_code);
              if (value !== null) {
                setTotalCases(JSON.parse(value));
              }
            } catch (error) {
            }
          }
         ), 500} 
         setMySuperStoreHd('MySuperStoreHd'+lawyer_code);
      })
      .catch(err => console.log(err));
    
    }, [])
  );  
  useEffect(() => { 
    window.history.pushState(null, null, document.URL);  //handle user register form submit
    _loadInitialState()
      .then(lawyer_code => {
        checkRemarkPermissions(lawyer_code).then(result => {
          if(result)
          {
            setIsRemarksPermission(result.code);
          }
        })
        .catch(err => console.log(err));

        // lawyerInfo(lawyer_code).then(result => {
        //   if(result)
        //   {
        //     setLawyerName(result.lawyer_name);
        //   }
        // })
        // .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    _fetchTypeData()
      // eslint-disable-next-line no-shadow
      .then(type => {
        setTypes(type);
      })
      .catch(err => console.log(err));
  }, []);
  const checkRemarkPermissions = async (lawyer_code) => {
    let url= `${BASE_URL_SIDDIQUE_ADMIN}/public/api/getRemarkPermission?lawyer_code=${lawyer_code}`; 
    try {
     const result = await axios.post(url).then(res => res.data);
    return result; 
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled');
      } 
    }
  };
  const lawyerInfo = async (lawyer_code) => {
    let url= `${BASE_URL_SIDDIQUE_ADMIN}/public/api/lawyerinfo?lawyerCode=${lawyer_code}`; 
    try {
     const result = await axios.post(url).then(res => res.data);
    return result; 
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled');
      } 
    }
  };

  const getDstrictsdata = (data) => { _fetchDistrictData(data)
    .then(district => {   // eslint-disable-next-line no-shadow
      setDistrict(district);
    })
    .catch(err => console.log(err));
  }
  const _removeData = async () => {
    try {
      await AsyncStorage.removeItem(mySuperStoreHd);
    } catch (error) {
    }
  };
  const _storeData = async (value) => {
    try {
      await AsyncStorage.setItem(
        mySuperStoreHd,
        JSON.stringify(value),
      );
    } catch (error) {
    }
  };
  const  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem(mySuperStoreHd);
      if (value !== null) {
       return JSON.parse(value);
      }
    } catch (error) {
    }
  };
  const handleAddCases = (values, actions) => {
    setIsSubmitting(true);
    const {     
      type,
      case_no,
      year,
      pr,
      remarks,     
    } = values;    
    const itemcart = {
      lawyer_code:userId,
      case_type:type_id,
      case_type_text:type_name,
      case_no,
      year,
      pr:pr_id,
      entry_user:1,
      case_no_plus:Rule?Rule:null,
      remarks,
      currentTime: Date.now()          
    };
    //console.log(itemcart);
    const isDuplicate = totalCases.some(function (item, idx) {
      if (item.lawyer_code === itemcart.lawyer_code && item.case_type === itemcart.case_type && item.case_no === itemcart.case_no && item.year === itemcart.year)
   { return true }
   else { return false }
    });
    duplicateCaseCheck(itemcart).then(result => {
      //console.log(result);
      if(result.code === 100) 
      { if(result.request){alert("Entry of this case is already done in your Entry Requsition Slip ")}
        else
        alert("Entry of this case is already done in your total case list")}
      else{
      if(isDuplicate) {alert("Already added this case")}
      else{
      setTotalCases([ ...totalCases, itemcart ]); 
      _storeData([ ...totalCases, itemcart ]);
      //console.log(itemcart);
      }
    }
    })
    .catch(err => console.log(err));
  };
  const handleRemoveCase = (removeItem) => {
    
    const temp = [...totalCases];
    //temp.reverse().splice(removeItem, 1); // Comment By Rafique  // removing the element using splice
    for(var i in temp){
        if(temp[i].currentTime==removeItem){
          temp.splice(i,1);
            break;
        }
    }
    setTotalCases(temp);     // updating the list
    _storeData(temp);
  };


const  _loadInitialState = async () => {
  try {
    const value = await AsyncStorage.getItem("userCode"); 
    const lawyerName = await AsyncStorage.getItem("lawyerName");
    const Adaccess = await AsyncStorage.getItem("Adaccess"); 
    setLawyerName(lawyerName); 
    if (value !== null) {
      setUser_id(value);
    }
    if (value !== null) {
      return value;
    }
  } catch (error) {
    return error;
  }
};
const updateType = (handleChange, value) => {
  handleChange(value);
};
const updatePr = (handleChange, value) => {
  handleChange(value);
};
  //async register user
  const totalCasesSubmit = async data => {
    let url= `${BASE_URL_SIDDIQUE_ADMIN}/public/api/savehdnewcase`; 
    let formBody= { allcase : totalCases};
    try {
     const result = await axios.post(url, formBody).then(res => res.data);
     if (result.code===200){
      alert("Case entry request submitted successfully. You will get a notification before next date cause list search. Thank you -Siddique Enterprise, Contact: 01760 200 200 ");
      setTotalCases([ ]); 
      _removeData();
      navigation.navigate("EntryCaseList", {param: 1} );
     }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled');
      } 
    }
  };
  const duplicateCaseCheck = async (parram) => {
    let url= `${BASE_URL_SIDDIQUE_ADMIN}/public/api/savehdnewcaseAddcheck`;
    let formBody= { itemcart : JSON.stringify(parram) };
    try {
     const result = await axios.post(url, formBody).then(res => res.data);
    return result;    
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request cancelled');
      } 
    }
  };
  return (
    <View style={{marginBottom:0,height:responsiveHeight(100)}}>
       <TopBar lawyer_id={userId} lawyer_name={lawyerName} ></TopBar>
        {/* <View style={{backgroundColor:'#007bff', alignItems: "center", padding:5, width:'100%'}}>
          <View style={styles.LawyerInfo}>
            <Text style={styles.LawyerInfoText}>
              General Code : {userId}
            </Text>
            <Text style={styles.LawyerInfoText}>{lawyerName}</Text>
          </View>
        </View> */}
        <View  style={{height:windowHeight-80, }} >
      <ScrollView>
      <View style={{ marginBottom:150, marginTop:10}}>
        <KeyboardAvoidingView enabled>
          <View
            style={{ 
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Formik
             enableReinitialize
              initialValues={{
                type: '',               
                case_no: '',
                year: '',
                pr: '',
                remarks: '',
                types_name:type_id,
                Pr_Name:''  
              }}
              innerRef={formikElement}
              validationSchema={registerSchema}
              onSubmit={(values, actions) => {
                actions.resetForm();
                Keyboard.dismiss();     
                setRuleId('');              
                setPrId(0);
                handleAddCases(values, actions);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <>
                <View style={{alignItems: 'center', marginTop:10}}>
                  <View style={styles.webMobile}>
                    <View style={styles.FormGroup}>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={type_id}
                        style={{
                          ...styles.picker,color:type_id?'#333':'#aaa',
                        }}
                        itemStyle={{ fontWeight:'bold' }}
                        onValueChange={(itemValue, itemIndex) => {
                        updateType(handleChange("types_name"), itemValue);
                        setCaseTypeId(itemValue); setPrId(0);
                        const case_type_name  = types[itemIndex-1]?.type_name;
                        setCaseTypeName(case_type_name);
                       if(itemValue==='15'||itemValue==='20'){setShowRule(true)}
                       else{setShowRule(false)}
                        }}
                        mode="dropdown"
                      >
                        <Picker.Item style={{fontSize:18}} label="            Select Case type" value="" />
                        {types.map((item, index) => {
                          return (
                            <Picker.Item
                              label={item.type_name}
                              value={item.id}
                              key={index}
                            />
                          );
                        })} 
                      </Picker>                     
                      </View>
                      {touched.types_name && errors.types_name ? (
                    <Text style={{color:'red'}}>{errors.types_name}</Text>
                      ) : null}
                    </View>
                   {showRule?
                    <View style={styles.FormGroup}>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={Rule}
                        style={{
                          ...styles.picker,color:Rule?'#333':'#aaa',
                        }}
                        onValueChange={(itemValue, itemIndex) => {
                          setRuleId(itemValue);
                        }}
                        mode="dropdown"
                      >
                       <Picker.Item label="Select Case No. Plus" value="" />
                        <Picker.Item label="(Con)" value="(Con)" />
                        <Picker.Item label="(Con-A)" value="(Con-A)" />
                        <Picker.Item label="(F)" value="(F)" />
                        <Picker.Item label="(F.M)" value="(F.M)" />
                        <Picker.Item label="(R)" value="(R)" />
                        <Picker.Item label="(S)" value="(S)" />
                        <Picker.Item label="(Vio)" value="(Vio)" />
                      </Picker>
                      </View>
                    </View>
                    :null}
                  </View>
                  <View style={styles.webMobile}>
                 <View style={{flexDirection:'row'}}>
                    <View style={styles.FormGroup}>
                      <TextInput
                       placeholderTextColor="#aaa"
                       style={styles.inputstyle22}
                        value={values.case_no}
                        keyboardType="phone-pad"
                        onChangeText={handleChange('case_no')}
                        onBlur={handleBlur('case_no')}
                        placeholder={'Case No.'}
                      />
                      {touched.case_no && errors.case_no ? (
                    <Text style={{color:'red'}}>{errors.case_no}</Text>
                      ) : null}
                    </View>
                    <View><Text style={{marginVertical:8, fontSize:22 }}>/</Text></View>
              <View style={styles.FormGroup}>
                  <TextInput
                   placeholderTextColor="#aaa"
                   style={styles.inputstyle22}
                    value={values.year}
                    keyboardType="phone-pad"
                    onChangeText={handleChange('year')}
                    onBlur={handleBlur('year')}
                    placeholder={'Year'}
                  />
                  {touched.year && errors.year ? (
                <Text style={{color:'red'}}>{errors.year}</Text>
                  ) : null}
                </View>
                </View>  
                <View style={styles.FormGroup}>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={pr_id}
                        style={{
                          ...styles.picker,color:pr_id?'#333':'#aaa',
                        }}
                        onValueChange={(itemValue, itemIndex) => {
                          setPrId(itemValue);
                          updatePr(handleChange("Pr_Name"), itemValue);
                          Keyboard.dismiss();
                        }}
                        mode="dropdown"
                      >
                        <Picker.Item style={{fontSize:18}} label="Select Petitioner / Respondent " value="" />
                        <Picker.Item label="Petitioner" value="1" />
                        <Picker.Item label="Respondent" value="2" />
                      </Picker>                     
                      </View>
                      {touched.Pr_Name && errors.Pr_Name ? (
                    <Text style={{color:'red'}}>{errors.Pr_Name}</Text>
                      ) : null}
                    </View>
              {is_remarks_permission && is_remarks_permission==100 ? (
                <View style={styles.FormGroup}>
                  <TextInput
                   placeholderTextColor="#aaa"
                   style={styles.inputstyle}
                    value={values.remarks}
                    onChangeText={handleChange('remarks')}
                    onBlur={handleBlur('remarks')}
                    placeholder={'Remarks'}
                  />
                  {touched.remarks && errors.remarks ? (
                <Text>{errors.remarks}</Text>
                  ) : null}
                </View>
              ) : null}
                  </View>
                  <View style={{ marginTop: 0, paddingHorizontal: 10}}>
                    <TouchableOpacity
                       style={{
                        padding:10 ,
                        borderRadius: 6,
                        backgroundColor: '#7fc3fa',
                        width: 100,
                        alignSelf:'center',
                        marginBottom:10,
                        marginLeft:0
                      }}
                      onPress={handleSubmit}
                    ><Text  style={{
                      color: '#fff',
                      fontSize: 16,
                      textTransform: 'capitalize',
                      textAlign: 'center',
                      width: '100%'
                    }}>Add</Text></TouchableOpacity></View>
                </View>
                </>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>       
        {totalCases && totalCases.length > 0 && totalCases.sort((a, b) => a.currentTime - b.currentTime).reverse().map((item, key) => (
           <View  style={[styles.hddata]} key={key+1}>
                    <View style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Serial No.</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription1}> {totalCases.length-(key)}</Text>
                      <Pressable style={styles.textDescription2} onPress={() => handleRemoveCase(item.currentTime)} >
                    <Text style={styles.text}>Remove</Text>
                  </Pressable>
                    </View>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Case Type </Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.case_type_text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Case No.</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.case_no}{(item.case_type ==='15'|| item.case_type ==='20')?item.case_no_plus:null}/{item.year}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>P/R</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.pr==1 ? 'Petitioner' : ''} {item.pr==2 ? 'Respondent' : ''}</Text>
                    </TouchableOpacity>  
                    {is_remarks_permission && is_remarks_permission==100 ? (  
                    <TouchableOpacity style={{ flexDirection: "row", padding: 0 }}>
                      <Text style={styles.textTile}>Remarks</Text>
                      <Text style={styles.textTilecln}>:</Text>
                      <Text style={styles.textDescription}>{item.remarks}</Text>
                    </TouchableOpacity>   
                    ) : null}
                </View>
        ))} 
        {totalCases && totalCases.length > 0 ?           
           <View style={{ marginTop: 20, paddingHorizontal: 10}}>
                    <TouchableOpacity
                       style={{
                        padding: 10,
                        borderRadius: 6,
                        backgroundColor: '#5cb85c',
                        width: 100,
                        marginBottom:30,
                        alignSelf:'center'
                      }}
                      onPress={totalCasesSubmit}
                    ><Text  style={{
                      color: '#fff',
                      fontSize: 16,
                      textTransform: 'capitalize',
                      textAlign: 'center',
                      width: '100%'
                    }}>Submit</Text></TouchableOpacity></View>:null}
                    </View>
      </ScrollView>
      </View>
    </View>
  );
}
export default CaseEntryHD;
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
    //borderBottomLeftRadius:30,
    //borderBottomRightRadius:30

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
    color: "#031163",
    fontWeight:'bold',
    textAlign: 'center',
    width:'100%'
  },
  // LawyerInfo: {
  //   padding: 5,
  //   borderWidth: 1,
  //   borderColor: "white",
  //   borderRadius: 6,
  //   marginBottom:0,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width:'90%'
  // },
  // LawyerInfoText: {
  //   fontSize: 16,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   color: "white",
  //   textAlign: 'center',
  //   width:'100%'
  // },
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
    width:'50%'
  },
  textDescription2:{
    width:80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:2,
    paddingHorizontal: 2,
    borderRadius: 8,
    elevation: 3,
    marginLeft:-20,
    backgroundColor: 'red',

  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  inputstyle: {
    height: 41,
    marginBottom: 0,
    marginRight:2,
    marginLeft:4,
    color: '#000',
    width: 333,
    borderWidth: 1,
    borderColor: '#334',
    backgroundColor:'#fff',
    borderRadius:3,  
    paddingHorizontal: 10,
    fontSize: 18,
  },
  inputstyle22: {
    height: 41,
    marginBottom: 0,
    marginRight:2,
    marginLeft:4,
    color: '#000',
    width: 150,
    borderWidth: 1,
    borderColor: '#334',
    backgroundColor:'#fff',
    borderRadius:3,  
    paddingHorizontal: 10,
    fontSize: 18,
   
  },
  FormGroup: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22BDDE',
    borderWidth: 1,
    borderColor: '#fff',
    height: 43,
    borderRadius: 2,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  inputs1: {
    borderColor: '#fff',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#22BDDE',
    width: 270,
  },
  
  inputs: {
    borderColor: '#fff',
    borderWidth: 1,
    padding: 12,
    borderRadius: 2,
    fontSize: 13,
    backgroundColor: '#22BDDE',
    width: 300,
  },
  webMobile: {
    flexDirection:
      Platform.OS === 'web' && windowWidth >= 600 ? 'row' : 'column',
  },
  checkBoxLebel: {
    marginTop: Platform.OS === 'web' && windowWidth >= 600 ? 19 : 0,
    color: '#fff',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'skyblue',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  picker: {  
    borderWidth: 0, 
    marginTop:10,
     color: '#000',
     width: 333,
     fontSize: 16,
     fontWeight:'bold',
     backgroundColor:'transparent'
   },
  pickerWrapper: {
    borderColor: '#111',
    backgroundColor:'#fff',
    borderWidth: 1,
    height:41,
   /// paddingTop:-10,
    borderRadius: 4,
    paddingTop:-5,
   
    backgroundColor: '#fff',
  }
});