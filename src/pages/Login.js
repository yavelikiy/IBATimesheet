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

export default class Login extends Component {

  press() {
  	Alert.alert('Button has been pressed!');
  }

  render() {
    return (
        <ScrollView style={styles.scroll}>
        	<Container>
			    <Button 
			        label="Forgot Login/Pass"
			        styles={{button: styles.alignRight, label: styles.label}} 
			        onPress={this.press.bind(this)} />
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