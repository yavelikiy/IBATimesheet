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
import Calendar from '../components/Calendar';
import Label from '../components/Label';
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';

export default class Timesheet extends Component {
	constructor(props) {
	        super(props);
	        // get date from timesheet props
	        this.state = {
	            message: '123',
            	date: new Date(),
            	isCalendarFocused : true,
	        };   
			    this.getHTML = this.getHTML.bind(this);
					this.setFocusHandlers = this.setFocusHandlers.bind(this);
	        //this.registerChallengeHandler();
	    }

   
  handleDateSelect(date, timeType) {
  	//this.props.navigation.navigate('TimesheetTimeValuePicker', {selected : `${timeType}`, timeTypes: `${timeTypes}`});
  }


	            

  render() {
    if(this.state.isCalendarFocused){
  		return(
  			<View style={styles.container}>
  				<Calendar
            date={this.state.date}
            timesheet={this.props.navigation.state.params.timesheet}
            onDateSelect={(date) => this.handleDateSelect(date)} />
          <TextInput onFocus={() => this.setState({isCalendarFocused : false})} >
          	{this.getPureComment()}
          </TextInput>
				</View>
  			);
  	}
  	else{
  		return(
  			<View style={styles.container}>
  				<RichTextEditor
          	ref={(r)=>this.richtext = r}
          	style={styles.richText}
          	initialContentHTML={this.props.navigation.state.params.timesheet.comment}
          	editorInitializedCallback={() => this.onEditorInitialized()}
	      	/>
	      	<RichTextToolbar
	        	getEditor={() => this.richtext}
		    	/>
				</View>
  			);
  	}
  }

  getPureComment(){
  	return this.props.navigation.state.params.timesheet.comment.replace(/<(?:.|\n)*?>/gm, '');
  }

  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  async getHTML() {
    //const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    //alert(titleHtml + ' ' + contentHtml)
  }

  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      
    });
	}
}
const timeTypes = ["8", "7", "П", "В", "ОТ"];

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
	},
	richText: {
		alignItems:'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 5
	},
});
