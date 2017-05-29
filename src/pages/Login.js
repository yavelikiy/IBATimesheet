import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView, 
  Switch,
  Alert,
  NativeModules,
  NativeEventEmitter,
  AsyncStorage,
  DeviceEventEmitter
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';

//import autobind from 'autobind-decorator';

//import WLClientRN from '../wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from '../wrappers/SecurityCheckChallengeHandlerRN'
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
        };  
          //this.registerChallengeHandler();
      }

    static navigationOptions= { 
      headerVisible: false,
      headerStyle: { backgroundColor: '#0066B3' },
      headerTitleStyle: { color: '#FFF' },
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
      else
        this.state.savePassword = false;
    }


  navTimesheets(){
		this.props.navigation.navigate('Timesheets');
	}

  componentWillMount () {
    //add all listeners when component mount
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
    if(this.state.username === '' || this.state.password === ''){
      this.setState({error : 'Username & password cannot be empty.', password:''});
      return;
    }
    //Save password to local storage
    if(this.state.savePassword){
      AsyncStorage.multiSet([['username', this.state.username],['password', this.state.password]]);
    }else{
      AsyncStorage.multiRemove(['username', 'password']);
    }
    this.setState({error : 'Verifying credentials...', isLoading: true});
    // Try to login with specified credentials
		SecurityCheckChallengeHandlerRN.login({ 'username': this.state.username.trim(), 'password': this.state.password.trim() });
	}

  render() {
    return (
        <ScrollView 
          style={styles.scroll}
          keyboardShouldPersistTaps='always'
        >
          <Container>
            <Text style={styles.error} >{this.state.error}</Text>
          </Container>
          <Container>
            <Label text="Username" />
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              editable={!this.state.isLoading}
              placeholder="APetrov@gomel.iba.by"                
              selectTextOnFocus={true}
              onSubmitEditing={(event) => { 
                this.refs.SecondInput.focus(); 
              }}
              underlineColorAndroid="#29648A"
              onChange={(event) => this.setState({ username: event.nativeEvent.text }) }
              style={styles.textInput}
              value={this.state.username}
            />
          </Container>
          <Container>
            <Label text="Lotus internet password" />
            <TextInput
              ref="SecondInput"
              secureTextEntry={true}
              underlineColorAndroid="#29648A"    
              editable={!this.state.isLoading}     
              selectTextOnFocus={true}
              onChange={(event) => this.setState({ password: event.nativeEvent.text }) }
              style={styles.textInput}
              value={this.state.password}
            />
            <View style={styles.savePasswordContainer}>
              <Text style={styles.savePasswordLabel}>Save credentials</Text>
              <Switch 
                onValueChange={(value) => this.setState({savePassword: value})}
                onTintColor="#4492c4" 
                thumbTintColor="#0066B3"
                style={styles.savePasswordSwitch} 
                value={this.state.savePassword} /> 
            </View>
            <View style={styles.savePasswordContainer}>
              <Text style={styles.savePasswordLabel}>Use debug values</Text>
              <Switch 
                onValueChange={(value) => this.setState({useDebug: value})}
                onTintColor="#4492c4" 
                thumbTintColor="#0066B3"
                style={styles.savePasswordSwitch} 
                value={this.state.useDebug} /> 
            </View>
          </Container>
          <Container>
            <Button 
                label="Sign In"
                autoFocus={true}
                disabled={this.state.isLoading}
                styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                onPress={() => this.pressSignIn()} />
          </Container>
        </ScrollView>
    );
  }
  // fix navigation and insert this
          // <Container>
          //   <Button 
          //     label="Forgot Login/Pass"
          //     styles={{ label: styles.forgotPasswordLabel}} 
          //     onPress={() => this.pressForget()} />
          // </Container>

  addListeners() {
        var that = this;       
        //need to login
        this.challengeEventModuleSubscription  = DeviceEventEmitter.addListener(
            'LOGIN_REQUIRED', function (e) {
              that.setState({error : 'Username and/or password are incorrect.', password:'', isLoading: false});
            }
        );
        //login faild. Show message
        this.failureEventModuleSubscription  = DeviceEventEmitter.addListener(
            'LOGIN_FAILED', function (e) {
              alert('Login faild');
              that.setState({error : 'Username and/or password are incorrect.', password:'', isLoading: false});
            }
        );
        //Login succes. Redirect to Timesheets page. 
        this.successEventModuleSubscription  = DeviceEventEmitter.addListener(
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
    this.successEventModuleSubscription.remove();
  }    
}

const styles = StyleSheet.create({
   scroll: {
      backgroundColor: '#AAABB8',
      padding: 30,
      flexDirection: 'column'
	},
	forgotPasswordLabel: {
	    color: '#0066B3',
	    fontSize: 14,
      margin: 0,
	},
	forgotPasswordButton: {
      backgroundColor: '#29648A',
      marginTop: 10,
	},
	textInput: {
	    height: 80,
	    fontSize: 22,
	    backgroundColor: '#FFF',
      borderRadius: 4,
	},
	buttonWhiteText: {
	    fontSize: 20,
	    color: '#FFF',
	},
  primaryButton: {
      backgroundColor: '#0066B3',
      borderRadius: 4,
  },
	error: {
		marginBottom: 5,
	    fontSize: 16,
	    textAlign: 'center',
	    color: '#25274D'
	},
  savePasswordContainer: {
      flexDirection: 'row'

  },
  savePasswordSwitch: {
    alignSelf: 'flex-end',
    marginTop: 5, 
  },
  savePasswordLabel: {
    alignSelf: 'flex-start',
    marginTop: 10, 
  }
});