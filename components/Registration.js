import React, { Component } from 'react';
import { Alert, Button, Text, TouchableOpacity, TextInput, View, StyleSheet,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL_BDLAW, BASE_URL_SIDDIQUE, BASE_URL_SIDDIQUE_ADMIN} from './BaseUrl';
export default class Registration extends Component{
  constructor()
  {
      super();
      this.state = { 
        username: '',
        usernameError: '', 
        name: '', 
        nameError: '', 
        mobile_no: '', 
        mobile_noError: '', 
        loading: false, 
        disabled: false 
      }
  }  
  Validator(){
    if(this.state.username==""){
      this.setState({usernameError:"Username/ User Code is Required"})
    }
    else{
      this.setState({usernameError:""})
    }
    if(this.state.name==""){
      this.setState({nameError:"Full Name is Required"})
    }
    else{
      this.setState({nameError:""})
    }
    if(this.state.mobile_no==""){
      this.setState({mobile_noError:"Mobile Number is Required"})
    }
    else{
      this.setState({mobile_noError:""})
    }
  }
  saveData = () =>
    {
      if(this.state.name==""){  // Validation Start
        this.setState({nameError:"Full Name is Required"})
        return false;
      }
      else{
        this.setState({nameError:""})
      }
      if(this.state.mobile_no==""){
        this.setState({mobile_noError:"Mobile Number is Required"})
        return false;
      }
      else{
        this.setState({mobile_noError:""})
      }
      if(this.state.username==""){
        this.setState({usernameError:"Username/ User Code is Required"})
        return false;
      }
      else{
        this.setState({usernameError:""})
      }  // Validation End    
        this.setState({ loading: true, disabled: false }, () =>
        {
            fetch(`${BASE_URL_SIDDIQUE}/public/api/add_apps_user_info`,
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                    username: this.state.username,
					
                    name: this.state.name,

                    mobile_no: this.state.mobile_no
                })

            }).then((response) => response.json()).then((responseJson) =>
            {
              if(responseJson=="Success"){
                 this._loadsetItem() // returns promise, so process in chain
                  .then(value => {
                    if (value !== null) {
                      this.props.navigation.navigate("Otp");
                    }
                  });
                this.setState({ loading: false, disabled: false });
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
    _loadsetItem= async () => {
      try {
        const value = await AsyncStorage.setItem('userCode',this.state.username);
        if (value !== null){
          return value
        }
      } catch (error) {
        return error
      }
    }
    render() {
        return (
          <View style={styles.container}>
          <Image source={{uri: `${BASE_URL_SIDDIQUE}/assets/img/sel_logo.png`}}  style={{width: 80, height: 80}} />
          <Text style={styles.titleText}>BDLAWSERVICE.COM</Text>
          <TextInput
            value={this.state.name}
            onBlur={() => this.Validator()}
            onChangeText={(name) => this.setState({ name })}
            autoFocus={true}
            placeholder='Full Name' 
            placeholderTextColor = 'white'
            style={styles.input}
            selectionColor={"white"}
          />
           {this.state.nameError !=""  &&
              <Text style={styles.errorColor}>{this.state.nameError}</Text>
            }
          <TextInput
            value={this.state.mobile_no}
            onBlur={() => this.Validator()}
            onChangeText={(mobile_no) => this.setState({ mobile_no })}
            placeholder='Mobile No.'
            placeholderTextColor = 'white'
            keyboardType = "number-pad"
            style={styles.input}
            selectionColor={"white"}
          />
           {this.state.mobile_noError !=""  &&
              <Text style={styles.errorColor}>{this.state.mobile_noError}</Text>
            }
          <TextInput
            value={this.state.username}
            onBlur={() => this.Validator()}
            onChangeText={(username) => this.setState({ username })}
            placeholder='User Code'
            placeholderTextColor = 'white'
            keyboardType = "number-pad"
            style={styles.input}
            selectionColor={"white"}
          />
        {this.state.usernameError !=""  &&
          <Text style={styles.errorColor}>{this.state.usernameError}</Text>
        }
          <TouchableOpacity disabled = { this.state.disabled } activeOpacity = { 0.8 } style ={styles.button} onPress = { this.saveData }>
                    <Text style ={styles.buttonText}>Registration</Text>
          </TouchableOpacity>
            {/* <Button
                title="Go to Login"
                  onPress={() => this.props.navigation.navigate('Login')}
              /> */}
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
  titleText:{
    fontSize: 26,
    alignItems: 'center',
    justifyContent: 'center',
    color:'#fff',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#419641',
    width: 210,
    height: 44,
    padding: 6,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    marginTop:15,
  },
  buttonText:{
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color:'white'
  },
  input: {
    width: 210,
    fontSize: 20,
    height: 40,
    padding: 8,
    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 5,
    borderRadius: 10,
    color:'#fff'
  },
  errorColor: {
    color:'coral',
  },
});