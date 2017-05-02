import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  NativeModules,
  Navigator
} from 'react-native';

import Container from '../components/Container';
import Button from '../components/Calendar';
import Label from '../components/Label';

export default class Timesheet extends Component {
	constructor(props) {
	        super(props);
	        // get date from timesheet props
	        this.state = {
	            message: '123',
            	date: new Date()
	        };   
	        //this.registerChallengeHandler();
	    }

   
    handleDateSelect(date) {
        alert(`clicked: ${this.state.date.toString()}`);
    }

    render() {
        return (
            <Calendar
                date={this.state.date}
                onDateSelect={(date) => this.handleDateSelect(date)} />
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