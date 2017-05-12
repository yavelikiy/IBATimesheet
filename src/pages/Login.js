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
  AsyncStorage
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
            username: "SSvetlakou@gomel.iba.by",
            password: "Passvv0rd4",
            error: ""
        };  
          //this.registerChallengeHandler();
      }


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
      this.addListeners();
    }


    navTimesheets(){
		this.props.navigation.navigate('Timesheets');
	}

   
	pressForget() {
		Alert.alert('Admins: A Trasko, U Liberau');
	}

	pressSignIn() {
		//remove on MF test
		//this.getMFBlogEnriesAsPromise();
		//this.navTimesheets();onSubmitPressed() {
    if(this.state.savePassword){
      AsyncStorage.multiSet([['username', this.state.username],['password', this.state.password]]);
    }else{
      AsyncStorage.multiRemove(['username', 'password']);
    }
		SecurityCheckChallengeHandlerRN.login({ 'username': this.state.username.trim(), 'password': this.state.password.trim() });
	}

  render() {
    return (
        <ScrollView style={styles.scroll}>
          <Container>
          <Button 
              label="Forgot Login/Pass"
              styles={{button: styles.alignRight, label: styles.label}} 
              onPress={() => this.pressForget()} />
      </Container>
      <Container>
          <Label text="Username" />
          <TextInput
          		autoFocus={true}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="APetrov@gomel.iba.by"
                onChange={(event) => this.setState({ username: event.nativeEvent.text }) }
              	style={styles.textInput}
              	value={this.state.username}
          />
      </Container>
      <Container>
          <Label text="Lotus internet password" />
          <TextInput
              secureTextEntry={true}
              onChange={(event) => this.setState({ password: event.nativeEvent.text }) }
              style={styles.textInput}
              value={this.state.password}
          />
           <Text>Save credentials</Text>
           <Switch onValueChange={(value) => this.setState({savePassword: value})} style={{marginBottom: 10}} value={this.state.savePassword} /> 
      </Container>
      <Container>
            <Button 
                label="Sign In"
                styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                onPress={() => this.pressSignIn()} />
        </Container>
        <Container>
        	<Text style={styles.error}>{this.props.message}</Text>
        </Container>
      </ScrollView>
    );
  }

  addListeners() {
        var that = this;       
        const challengeEventModuleSubscription  = challengeEventModule.addListener(
            'LOGIN_REQURIED', function (challenge) {
                    alert("Login REQURIED");
                    // set up message view
            }
        );
        const failureEventModuleSubscription  = failedEventModule.addListener(
            'LOGIN_FAILED', function (challenge) {
                    alert("Login Failed");
                    // set up message view
            }
        );
        const successEventModuleSubscription  = successEventModule.addListener(
            'LOGIN_SUCCESS', function (challenge) {
                    //alert("Login Success");
		                //that.props.navigation.goBack();
                    const resetAction = NavigationActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({ 
                          routeName: 'Timesheets',
                          params: {loggedIn:true}})
                      ]
                    });
                    that.props.navigation.dispatch(resetAction);
            }
        );
    }    
}
const challengeEventModule = new NativeEventEmitter(NativeModules.SecurityCheckChallengeHandlerEventEmitter);
const successEventModule = new NativeEventEmitter(NativeModules.SecurityCheckChallengeHandlerEventEmitter);
const failedEventModule = new NativeEventEmitter(NativeModules.SecurityCheckChallengeHandlerEventEmitter);

const styles = StyleSheet.create({
   scroll: {
      backgroundColor: '#E1D7D8',
      padding: 30,
      flexDirection: 'column'
	},
	label: {
	    color: '#0d8898',
	    fontSize: 18
	},
	alignRight: {
	    alignSelf: 'flex-end'
	},
	textInput: {
	    height: 80,
	    fontSize: 30,
	    backgroundColor: '#FFF'
	},
	buttonWhiteText: {
	    fontSize: 20,
	    color: '#FFF',
	},
	primaryButton: {
	    backgroundColor: '#3B5699'
	},
	footer: {
	   marginTop: 100
	},
	error: {
		marginBottom: 20,
	    fontSize: 16,
	    textAlign: 'center',
	    color: 'red'
	},
});