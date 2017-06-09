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
            	timesheet: this.props.navigation.state.params.timesheet,
            	isEditable: this.props.navigation.state.params.isEditable,
	        };   
			    this.getHTML = this.getHTML.bind(this);
					this.setFocusHandlers = this.setFocusHandlers.bind(this);
	        //this.registerChallengeHandler();
	    }

   
  handleDateSelect(date, timeType) {
  	//this.props.navigation.navigate('TimesheetTimeValuePicker', {selected : `${timeType}`, timeTypes: `${timeTypes}`});
  }


	            

  render() {
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
