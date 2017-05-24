import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  Picker,
  NativeModules,
  Navigator
} from 'react-native';

import Label from '../components/Label';
import DatePicker from '../components/DatePicker';

export default class CreateTimesheet extends Component {
	constructor(props) {
	        super(props);
	        const { params } = this.props.navigation.state;

	        // this.setState({
	        // 	user : params.currentUserName,
	        // 	userID : params.currentUserID,
	        // 	users : params.users,
	        // 	projects : params.projects,
	        // 	project : null,
	        // 	projectID : null,
	        // 	date : new Date()
	        // });

	        this.setState({
	        	user : "Хобня",
	        	userID : "Хобня",
	        	users : ["Хобня", "Светлаков"],
	        	projects : ["MAD","IS"],
	        	project : "MAD",
	        	projectID : null,
	        	date : new Date()
	        });
	    }

    getAllUsernames(){
    	return <Picker.Item label="Хобня" value="Хобня" /> 
    }

    getAllProjects(){
    	var result = [];
    	for(var i=0; i<this.state.projects.length; i++){
    		result.push( <Picker.Item label={this.state.projects[i]} value={this.state.projects[i]} />) ;
    	}
    	return result;
    }

    render() {
        return (
            <View>
            	<Label text="Username" />
	            <Picker 
	            	selectedValue="Хобня" 
	            	onValueChange={(u) => this.setState({userID: u})}
	            > 
	            	{this.getAllUsernames()}	
	            </Picker>
            	<Label text="Project" />
	            <Picker 
	            	selectedValue={this.state.project == null ? "" : this.state.project} 
	            	onValueChange={(p) => this.setState({projectID: p})}
	            > 
	            	{this.getAllProjects()}	
	            </Picker>
            </View>
        );
    }
}

/*	            <DatePicker
					style={{width: 200}}
					date={this.state.date}
					mode="date"
					placeholder="placeholder"
					format="YYYY-MM-DD"
					minDate="2017-05-01"
					maxDate="2100-06-01"
					confirmBtnText="Confirm"
					cancelBtnText="Cancel"
					iconSource={require('../assets/google_calendar.png')}
					onDateChange={(date) => {this.setState({date: date});}}
				/>*/

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