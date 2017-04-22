import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  NativeModules
} from 'react-native';

import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';

export default class Timesheet extends Component {
	static navigationOptions = ({ navigation }) => ({
	    title: '${navigation.state.params.timesheetTitle}',
	});
	
	constructor(props) {
	        super(props);
	        this.state = {
	            message: '123'
	        };   
	        //this.registerChallengeHandler();
	    }

  
  render() {
  	// Need a parent props!
  	const { navigate } = this.props.navigation;
    return (
        <ScrollView style={styles.scroll}>
			<Container>
			    <Label text="Timesheet" />
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