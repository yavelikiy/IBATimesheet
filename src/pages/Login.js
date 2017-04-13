import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';

import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';

var WLResourceRequestRN = require('NativeModules').WLResourceRequestRN;

export default class Login extends Component {
	constructor(props) {
	        super(props);
	        this.state = {
	            isLoading: false,
	            message: ''
	        };   
	        //this.registerChallengeHandler();
	    }

    async getMFBlogEnriesAsPromise() {
        //SecurityCheckChallengeHandlerRN.cancel("UserLogin");
        var error = "";
        this.setState({ isLoading: true, message: '' });
        try {
            var result
            result = await WLResourceRequestRN.asyncRequestWithURL("/adapters/MFBlogAdapter/getFeed", WLResourceRequestRN.GET);
            this.handleResponse(JSON.parse(result))
        } catch (e) {
            error = e;
        }
        this.setState({ isLoading: false, message: error ? "Failed to retrieve blog entries - " + error.message : ""});
    }

    getMFBlogEnriesAsCallback() {
        //SecurityCheckChallengeHandlerRN.cancel("UserLogin");
        var that = this;
        this.setState({ isLoading: true, message: '' });
        WLResourceRequestRN.requestWithURL("/adapters/MFBlogAdapter/getFeed", WLResourceRequestRN.GET,
            (error) => {
                //that.props.navigator.popToTop();
                that.setState({ isLoading: false, message: error.message });
            },
            (result) => {
                that.handleResponse(JSON.parse(result))
                that.setState({ isLoading: false, message: "" });
            });
    }	

    handleResponse(response) {
        /*this.setState({ isLoading: false, message: '' });
        var beComponent = {
            title: 'MF And ReactNative Demo',
            component: BlogEntries,
            passProps: { entries: response.feed.entry }
        };

        if (this.isLoginOnTop()) {
            this.props.navigator.replace(beComponent);
        } else {
            this.props.navigator.push(beComponent);
        }*/
        
    }

  pressForget() {
  	Alert.alert('Go to admins, please :)');
  }

  pressSignIn() {
  	Alert.alert('Navigate to sign in form..');
  	getMFBlogEnriesAsCallback();
  }

  render() {
    return (
        <ScrollView style={styles.scroll}>
        	<Container>
			    <Button 
			        label="Forgot Login/Pass"
			        styles={{button: styles.alignRight, label: styles.label}} 
			        onPress={this.pressForget.bind(this)} />
			</Container>
			<Container>
			    <Label text="Username or Email" />
			    <TextInput
			        style={styles.textInput}
			    />
			</Container>
			<Container>
			    <Label text="Password" />
			    <TextInput
			        secureTextEntry={true}
			        style={styles.textInput}
			    />
			</Container>
			<Container>
		        <Button 
		            label="Sign Up"
		            styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
		            onPress={this.press.bind(this)} />
		    </Container>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
	 scroll: {
	    backgroundColor: '#E1D7D8',
	    padding: 30,
	    flexDirection: 'column'
	},
	label: {
	    color: '#0d8898',
	    fontSize: 20
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
	}
});