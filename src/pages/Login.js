import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  NativeModules,
  NativeEventEmitter
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
         this.addListeners();
    }

    // async getMFBlogEnriesAsPromise() {
    //     //SecurityCheckChallengeHandlerRN.cancel("UserLogin");
    //     var error = "";
    //     this.setState({ isLoading: true, message: '' });
    //     try {
    //         var result
    //         result = await WLResourceRequestRN.asyncRequestWithURL("/adapters/timesheetAdapter/statuses", WLResourceRequestRN.GET);
    //         this.handleResponse(JSON.parse(result))
    //     } catch (e) {
    //         error = e;
    //     }
    //     this.setState({ isLoading: false, message: error ? "Failed to retrieve entry - " + error.message : ""});
    // }

    // getMFBlogEnriesAsCallback() {
    //     //SecurityCheckChallengeHandlerRN.cancel("UserLogin");
    //     var that = this;
    //     this.setState({ isLoading: true, message: '' });
    //     WLResourceRequestRN.requestWithURL("/adapters/timesheetAdapter/statuses", WLResourceRequestRN.GET,
    //         (error) => {
    //             //that.props.navigator.popToTop();
    //             that.setState({ isLoading: false, message: error.message });
    //         },
    //         (result) => {
    //             that.handleResponse(JSON.parse(result))
    //             //that.setState({ isLoading: false, message: "" });
    //         });
    // } 

    navTimesheets(){
		this.props.navigation.navigate('Timesheets');
	}

    handleResponse(response) {
  		// Alert.alert('Navigate to sign in form..'+response[0]);
    //     this.setState({ isLoading: false, message: '' });
    //     // var beComponent = {
    //     //     title: 'MF And ReactNative Demo',
    //     //     component: null,
    //     //     passProps: { entries: response.feed.entry }
    //     // };
         this.navTimesheets();
    //     /*if (this.isLoginOnTop()) {
    //         this.props.navigator.replace(beComponent);
    //     } else {
    //         this.props.navigator.push(beComponent);
    //     }*/
        
    }
	//@autobind
	pressForget() {
		Alert.alert('Admins: A Trasko, U Liberau');
	}

	//@autobind
	pressSignIn() {
		//remove on MF test
		//this.getMFBlogEnriesAsPromise();
		//this.navTimesheets();onSubmitPressed() {
		Alert.alert('Try to login');
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
                placeholder="APetrov"
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
        const failureEventModuleSubscription  = challengeEventModule.addListener(
            'LOGIN_FAILED', function (challenge) {
                    alert("Login Failed");
                    // set up message view
            }
        );
        const successEventModuleSubscription  = challengeEventModule.addListener(
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