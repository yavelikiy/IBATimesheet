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
import RichTextEditor from '../components/RichTextEditor';
import RichTextToolbar from '../components/RichTextToolbar';
//import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';

export default class Timesheet extends Component {
	constructor(props) {
	        super(props);
	        // get date from timesheet props
	        this.state = {
	            message: '123',
            	date: new Date(),
            	isCalendarFocused : true,
            	timesheet: this.props.navigation.state.params.timesheet,
            	isEditable: false,
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
  			<View style={[styles.container, {backgroundColor : '#AAABB8'}]}>
  				<Calendar
            date={this.state.date}
            timesheet={this.props.navigation.state.params.timesheet}
            onDateSelect={(date) => this.handleDateSelect(date)} />
          <Label text="Comment" />
          <TextInput
              underlineColorAndroid="#29648A"    
              onChange={(event) => this.setParams({ password: event.nativeEvent.text }) }
              onFocus={() => this.setState({isCalendarFocused : false})}
              style={styles.textInput}
              value={this.getPureComment()} />
				</View>
  			);
  	}
  	else{
  		var tollbarActions = ['bold','italic','SET_TEXT_COLOR', 'SET_BACKGROUND_COLOR', 'h3', 'unorderedList'];
  		return(
  			<View style={styles.container}>
  				<RichTextEditor
          	ref={(r)=>this.richtext = r}
          	style={styles.richText}
          	initialContentHTML={this.props.navigation.state.params.timesheet.comment}
          	initialTitleHTML="Comment"
          	isContentEditable={this.state.isEditable}
          	isTitleEditable={this.state.isEditable}
          	editorInitializedCallback={() => this.onEditorInitialized()}
	      	/>
	      	{ this.state.isEditable && 
	      		<RichTextToolbar
		        	getEditor={() => this.richtext}
		        	actions ={tollbarActions}
			    	/>
		    	}
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
	label: {
    color: '#0d8898',
    fontSize: 20
	},
	alignRight: {
	  alignSelf: 'flex-end'
	},
	textInput: {
	  height: 60,
	  fontSize: 18,
	  backgroundColor: '#FFF',
    borderRadius: 4,
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
    padding: 5
	},
});
