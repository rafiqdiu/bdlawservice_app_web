import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet,Image,TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE, BASE_URL_SIDDIQUE_ADMIN} from './BaseUrl';
const CODE_LENGTH = new Array(6).fill(0);
export default class Otp extends Component{
  input = React.createRef();
  state = {
    value: "",
    focused: true,
  };
  handleClick = () => {
    this.input.current.focus();
  };
  handleFocus = () => {
    this.setState({ focused: true });
  };
  handleBlur = () => {
    this.setState({
      focused: true,
    });
  };
  handleKeyPress = e => {
    if (e.nativeEvent.key === "Backspace") {
      this.setState(state => {
        return {
          value: state.value.slice(0, state.value.length - 1),
        };
      });
    }
  };
  handleChange = value => {
    this.setState(state => {
      if (state.value.length >= CODE_LENGTH.length) return null;
      return {
        value: (state.value + value).slice(0, CODE_LENGTH.length),
      };
    });
  };
  saveData = () =>
  {
    this.setState({ loading: true, disabled: false }, () =>
      {
          fetch(`${BASE_URL_SIDDIQUE}/public/api/opt_verify`,
          {
              method: 'POST',
              headers: 
              {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(
              {
                value: this.state.value
              })
          }).then((response) => response.json()).then((responseJson) =>
          {
            if (responseJson == "Thanks for your Registration!") {
              alert(responseJson);
              this._loadsetItme() // returns promise, so process in chain
              .then(value => {
                if (value !== null) {
                  this.props.navigation.navigate("Login");
                }
              });
            }
            else{
                 alert(responseJson);
              }
          }).catch((error) =>
          {
              console.error(error);
              this.setState({ loading: false, disabled: false });
          });
      });
  }
  _loadsetItme= async () => {
    try {
      const value = await AsyncStorage.setItem('userCode',this.state.userCode);
      if (value != null){
        return value
      }
    } catch (error) {
      return error
    }
  }
  render() {
    const { value, focused } = this.state;
    const values = value.split("");
    const selectedIndex =
      values.length < CODE_LENGTH.length ? values.length : CODE_LENGTH.length - 1;
    const hideInput = !(values.length < CODE_LENGTH.length);
    return (
      <View style={styles.container}>
        <Image source={{uri: `${BASE_URL_SIDDIQUE}/assets/img/sel_logo.png`}}  style={{width: 80, height: 80}} />
        <Text style={styles.titleText}>Please verify your OTP.</Text>
        <TouchableWithoutFeedback onPress={this.handleClick}>
          <View style={styles.wrap}>
            <TextInput
              value=""
              ref={this.input}
              onChangeText={this.handleChange}
              onKeyPress={this.handleKeyPress}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              // autoFocus={true}
              underlineColorAndroid='transparent'
              keyboardType = "number-pad"
              selectionColor={"black"}
              style={[
                styles.input,
                {
                  left: selectedIndex * 32,
                  opacity: hideInput ? 0 : 1,
                },
              ]}
            />
            {CODE_LENGTH.map((v, index) => {
              const selected = values.length === index;
              const filled =
                values.length === CODE_LENGTH.length && index === CODE_LENGTH.length - 1;
              const removeBorder = index === CODE_LENGTH.length - 1 ? styles.noBorder : undefined;
              return (
                <View style={[styles.display, removeBorder]} key={index}>
                  <Text style={styles.text}>{values[index] || ""}</Text>
                  {(selected || filled) && focused && <View style={styles.shadows} />}
                </View>
              );
            })}
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity disabled = { this.state.disabled } activeOpacity = { 0.8 } style ={styles.button} onPress = { this.saveData }>
           <Text style ={styles.buttonText}>Send</Text>
          </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0373BB',
    paddingTop:12,
  },
  wrap: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    position: "relative",
    flexDirection: "row",
  },
  input: {
    position: "absolute",
    fontSize: 42,
    textAlign: "center",
    backgroundColor: "transparent",
    width: 42,
    top: 0,
    bottom: 0,
  },
  display: {
    borderRightWidth: 1,
    borderRightColor: "rgba(0, 0, 0, 0.2)",
    width: 50,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    color:'#000',  
  },
  text: {
    fontSize: 32,
  },
  noBorder: {
    borderRightWidth: 0,
  },
  shadows: {
    position: "absolute",
    left: -4,
    top: -4,
    bottom: -4,
    right: -4,
    borderColor: "rgba(58, 151, 212, 0.28)",
    borderWidth: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#419641',
    width: 200,
    height: 40,
    padding: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText:{
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color:'white'
  },
  titleText:{
    fontSize: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10,
    color:'#fff'
  },
});