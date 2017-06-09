import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
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
            	isEditable: false,
	        };   
	    }

   
  handleDateSelect(date, timeType) {
  	//this.props.navigation.navigate('TimesheetTimeValuePicker', {selected : `${timeType}`, timeTypes: `${timeTypes}`});
  }


	            

  render() {
    const {navigate} = this.props.navigation;
		return(
			<View style={[styles.container, {backgroundColor : '#AAABB8'}]}>
				<Calendar
          date={this.state.date}
          timesheet={this.props.navigation.state.params.timesheet}
          onDateSelect={(date) => this.handleDateSelect(date)} />
        <Label text="Comment" />
        <TouchableHighlight 
            underlayColor="#ccc"
            onPress={() => navigate('TimesheetComment',{timesheet: this.state.timesheet, isEditable: this.state.isEditable})} 
            style={styles.textButton}
        >   
            <View>
              <Text style={styles.text}>{this.getPureComment()}</Text>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.underline}></View>
              </View>
            </View>
        </TouchableHighlight>
			</View>
			);
    //#29648A
  }


  getPureComment(){
  	var comment = this.props.navigation.state.params.timesheet.comment.replace(/<(?:.|\n)*?>/gm, '');
    return comment.length > 34 ? comment.substring(0,32)+'..' : comment;
  }

}
const timeTypes = ["8", "7", "П", "В", "ОТ"];

const styles = StyleSheet.create({
	text: {
	  fontSize: 18,
    borderRadius: 4,
	},
  textButton: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 5,
  },
  underline:{
    flex: 1,
    height: 2,
    backgroundColor: '#29648A'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 5
	},
});
