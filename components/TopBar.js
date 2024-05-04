import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet,Platform,Dimensions, TouchableOpacity, Animated } from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  responsiveWidth
} from "react-native-responsive-dimensions";


//const Colors1 = ThemeTwo;
const TopBar = (props) => {
 
  const lawyerId = props.lawyer_id; 
  const lawyerName = props.lawyer_name; 
  

  return (
   
    <View style={styles.hederTopnew}>
    {/* <Text style={styles.titleTextOnes}>New Case Entry </Text> */}
      {/* <View style={{flexDirection:'row' }}>
          <View style={styles.LawyerInfoLeft}></View> */}
              <View style={styles.LawyerInfo}>
                  <Text style={[styles.LawyerInfoText]}>
                    General Code : {lawyerId}
                  </Text>
                  <Text style={styles.LawyerInfoText}>{lawyerName?.length>38?`${lawyerName.substring(0, 38)}...`:lawyerName}</Text>
                </View>
            {/* <View style={styles.LawyerInfoRight}></View> 
        </View> */}    
  </View>
     
    
  );
};

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
    backgroundColor:'#fff',
  // backgroundColor:'#80c6f1',
    // width:responsiveWidth(100),
    //marginTop:28,
   alignItems: "center",
   justifyContent: "center",
    height:40,
    width:responsiveWidth(100),
   // zIndex:99999
   // borderBottomLeftRadius:30,
  //  borderBottomRightRadius:30

  },
  LawyerInfo: {   
    // borderWidth: 1,
    // borderColor: "rgba(190, 255, 255, 0.82)",
    // borderRadius:6 ,
   // margintop:30,
    alignItems: "center",
    justifyContent: "center",
  //  width:'100%',
    // elevation:20,
   // height:43,
  //  paddingTop:8,
    // backgroundColor:'rgba(167, 224, 250, 0.82)'
   // backgroundColor:'#80c6f1'
  },
  LawyerInfoText: {   
    fontSize: 16,
    lineHeight:18,
    alignItems: "center",
    justifyContent: "center",
    color: "#031163",
    fontWeight:'bold',
    textAlign: 'center',
    width:'100%'
  },
});

export default TopBar;
