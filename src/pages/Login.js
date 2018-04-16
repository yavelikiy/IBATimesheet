import React, { Component } from 'react';
 
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView, 
  Switch,
  Alert,
  Modal,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
  AsyncStorage,
  DeviceEventEmitter,
  Platform
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import WLClientRN from '../wrappers/WLClientRN'
import {Icon, Button, Content, Form, Label, Input, Header, Item, Footer, Text as BaseText} from 'native-base';

import Container from '../components/Container';
import KeyboardHandler from '../components/KeyboardHandler';
//import Button from '../components/Button';
//import Label from '../components/Label';
import BlueActivityIndicator from '../components/BlueActivityIndicator';

//import autobind from 'autobind-decorator';

//import WLClientRN from '../wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from '../wrappers/SecurityCheckChallengeHandlerRN'
import GlobalStyle from '../styles/GlobalStyle'
//import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'
//var WLResourceRequestRN = require('NativeModules').WLResourceRequestRN;

export default class Login extends Component {
  constructor(props) {
          super(props);
          this.state = {
            username: "",
            password: "",
            error: " ",
            isLoading: false,
            useDebug: false,
            callsLogin: 0,
        };  
          //this.registerChallengeHandler();
      }

    static navigationOptions= { 
      headerVisible: false,
      headerStyle: GlobalStyle.globalBackgroundDark,
      headerTitleStyle: GlobalStyle.actionBarHeader,
    };


    componentDidMount() {
      AsyncStorage.getItem("username").then((value) => {
        this.setState({"username": value});

      }).done();
      AsyncStorage.getItem("password").then((value) => {
        this.setState({"password": value});

      }).done();
      if(this.state.username !== null && this.state.password !== null)
        this.state.savePassword = true;
      else{
        this.state.savePassword = false;
        this.setState({"username": ""});
        this.setState({"password": ""});
      }
    }


  navTimesheets(){
		this.props.navigation.navigate('Timesheets');
	}

  componentWillMount () {
    //add all listeners when component mount
    WLClientRN.registerChallengeHandler();
    this.addListeners();
  }

  componentWillUnmount () {
    //remove all listeners when component unmount
    this.removeListeners();
  }

   
	pressForget() {
		Alert.alert('Admins: A Trasko, U Liberau');
	}

	pressSignIn() {
    if(this.state.username === '' || this.state.password === '' || this.state.username === null || this.state.password === null){
      this.setState({error : 'Username & password cannot be empty.', password:''});
      Alert.alert(
        'Error',
        'Username & password cannot be empty.'
      );
      return;
    }
    //Save password to local storage
    if(this.state.savePassword){
      AsyncStorage.multiSet([['username', this.state.username],['password', this.state.password]]);
    }else{
      AsyncStorage.multiRemove(['username', 'password']);
    }
    if(this.state.useDebug){
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ 
            routeName: 'Timesheets',
            params: {loggedIn:true, useDebug:this.state.useDebug}})
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }else{
      //this.refs["indicator"].start();
      this.setState({ isLoading: true, callsLogin: this.state.callsLogin+1});
      // Try to login with specified credentials
      SecurityCheckChallengeHandlerRN.login({ 'username': this.state.username.trim(), 'password': this.state.password.trim() });
    }
	}

  /*render2(){
    return (
      <Container style={{ backgroundColor: "#0066B3"}}>
        <Content style={{ padding: 20}}>
          <Form>
            <Item inlineLabel>
              <Label style={{ color: "#CCC"}}>Username</Label>
              <Input 
              autoCorrect={false}
              autoCapitalize="none"
              editable={!this.state.isLoading}             
              selectTextOnFocus={true}
              onSubmitEditing={(event) => { 
                this.refs.SecondInput.focus(); 
              }}
              underlineColorAndroid="#29648A"
              onChange={(event) => this.setState({ username: event.nativeEvent.text }) }
              style={GlobalStyle.textInput}
              value={this.state.username}/>
            </Item>
            <Item inlineLabel>
              <Label>Password</Label>
              <Input 
              ref="SecondInput"
              secureTextEntry={true}
              underlineColorAndroid="#29648A"    
              editable={!this.state.isLoading}     
              selectTextOnFocus={true}
              onChange={(event) => this.setState({ password: event.nativeEvent.text }) }
              style={GlobalStyle.textInput}
              value={this.state.password}/>
            </Item>
          </Form>
            <Button 
                iconLeft
                block
                autoFocus={true}
                disabled={this.state.isLoading}
                underlayColor="#ccc" 
                style={{backgroundColor: '#FFAB00'}}  
                onPress={() => this.pressSignIn()}>
                <BaseText style={{fontSize: 20, color: '#004274',}} >Sign In</BaseText>
                <Icon name="log-in" style={{fontSize: 40, color: '#004274',}}/>
              </Button>
        </Content>
      </Container>
    );
  }*/

              // onSubmitEditing={(event) => { 
              //   this.refs.pass.focus(); 
              // }}

  render() {
    return (
        <KeyboardHandler 
          ref='kh' offset={0}
          style={[ GlobalStyle.globalBackgroundDark , styles.container]}
          keyboardShouldPersistTaps='always'
        >
          
        {/*<--Modal 
          animationType={"fade"} 
          transparent={true} 
          visible={this.state.isLoading} 
          onRequestClose={() => {}}
        >
          <TouchableOpacity 
            style={GlobalStyle.activityModalOuter} 
            onPress={() => this.setState({isLoading: false})}
            activeOpacity={0}
            focusedOpacity={0}
          >
            <BlueActivityIndicator ref="indicator" animating={true}/>
          </TouchableOpacity>
        </Modal>*/}
          <Container>
            <Item stackedLabel>
              <Label style={{ color: "#fff1d0"}}>Username</Label>
              <Input 
              autoCorrect={false}
              autoCapitalize="none"
              editable={!this.state.isLoading}             
              selectTextOnFocus={true}
              underlineColorAndroid="#fff1d0"
              onChange={(event) => this.setState({ username: event.nativeEvent.text }) }
              ref='username'
              onFocus={()=>this.refs.kh.inputFocused(this,'username')}
              style={{ color: "#fff" }}
              value={this.state.username}/>
            </Item>
          </Container>
          <Container>            
            <Item stackedLabel error={false}>
              <Label style={{ color: "#fff1d0"}}>Password</Label>
              <Input 
              ref="pass"
              secureTextEntry={true}
              underlineColorAndroid="#fff1d0"    
              editable={!this.state.isLoading}     
              selectTextOnFocus={true}
              onChange={(event) => this.setState({ password: event.nativeEvent.text }) }
              style={{ color: "#fff" }}
              value={this.state.password}/>
            </Item>
            <View style={styles.savePasswordContainer}>
              <Text style={GlobalStyle.lightSwitchLabel}>Save credentials</Text>
              <Switch 
                onValueChange={(value) => this.setState({savePassword: value})}
                onTintColor="#eee" 
                thumbTintColor="#fff1d0"
                style={GlobalStyle.lightSwitch} 
                value={this.state.savePassword} /> 
            </View>
          </Container>
          <Container>
            <Button 
                block
                iconLeft
                large
                autoFocus={true}
                disabled={this.state.isLoading}
                underlayColor="#ccc" 
                style={{backgroundColor: '#ffc808', padding:4}}  
                onPress={() => this.pressSignIn()}>
                <Icon name="log-in" style={{fontSize: 40, color: '#004274',}}/>
                <BaseText style={{fontSize: 20, color: '#004274',}} >Sign In</BaseText>
              </Button>
          </Container>
        </KeyboardHandler>
    );
  }

            // <Button 
            //     label="Sign In"
            //     autoFocus={true}
            //     disabled={this.state.isLoading}
            //     styles={{button: GlobalStyle.colorButton, label: GlobalStyle.colorButtonText}} 
            //     onPress={() => this.pressSignIn()}>
            //   </Button>

            // <View style={styles.savePasswordContainer}>
            //   <Text style={styles.savePasswordLabel}>Use debug values</Text>
            //   <Switch 
            //     onValueChange={(value) => this.setState({useDebug: value})}
            //     onTintColor="#FFE177" 
            //     thumbTintColor="#FFF"
            //     style={styles.savePasswordSwitch} 
            //     value={this.state.useDebug} /> 
            // </View>
  // fix navigation and insert this
          // <Container>
          //   <Button 
          //     label="Forgot Login/Pass"
          //     styles={{ label: styles.forgotPasswordLabel}} 
          //     onPress={() => this.pressForget()} />
          // </Container>

  addListeners() {
    var that = this; 
    var emitter;
    const {SecurityCheckChallengeHandlerEventEmitter} = NativeModules;
    emitter = new NativeEventEmitter(NativeModules.SecurityCheckChallengeHandlerEventEmitter);
    if( Platform.OS === 'android'){
      emitter = DeviceEventEmitter;
    }     
    //need to login
    this.challengeEventModuleSubscription  = emitter.addListener(
        'LOGIN_REQUIRED', function (e) {
          that.setState({error : 'Username and/or password are incorrect.', password:'', isLoading: false});
          Alert.alert(
            'Login required',
            'Username and/or password are incorrect.'+
            JSON.stringify(e),
          );
        }
    );
    //login faild. Show message
    this.failureEventModuleSubscription  = emitter.addListener(
        'LOGIN_FAILED', function (e) {
          that.setState({error : 'Login failed. '+e, password:'', isLoading: false});
          Alert.alert(
           'Login failed {'+that.state.callsLogin+'}',
           JSON.stringify(e),
          );
          that.setState({isLoading: false});
        }
    );
    //login faild. Show message
    this.connectionEventModuleSubscription  = emitter.addListener(
        'CONNECTION_ERROR', function (e) {
          that.setState({error : 'Login failed. '+e.errorMsg, password:'', isLoading: false});
          Alert.alert(
            'Error',
            e.errorMsg
          );
        }
    );
    //Login succes. Redirect to Timesheets page. 
    this.successEventModuleSubscription  = emitter.addListener(
        'LOGIN_SUCCESS', function (e) {
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ 
                      routeName: 'Timesheets',
                      params: {loggedIn:true, useDebug:that.state.useDebug}})
                  ]
                });
                that.props.navigation.dispatch(resetAction);
        }
    );
  }

  removeListeners(){
    this.challengeEventModuleSubscription.remove();
    this.failureEventModuleSubscription.remove();
    this.connectionEventModuleSubscription.remove();
    this.successEventModuleSubscription.remove();
  }    
}

const styles = StyleSheet.create({
  container: {
      padding: 30,
      flexDirection: 'column'
	},
  savePasswordContainer: {
      flexDirection: 'row'

  },
});