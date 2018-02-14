import React, { Component } from 'react';
 
import {
  StyleSheet,
  BackAndroid,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  NativeModules,
  TouchableHighlight,
  Image,
} from 'react-native';

import Container from '../components/Container';
import Calendar from '../components/Calendar';
import Label from '../components/Label';
import LeftBarButton from '../components/LeftBarButton';
import RichTextEditor from '../components/RichTextEditor';
import RichTextToolbar from '../components/RichTextToolbar';
import GlobalStyle from '../styles/GlobalStyle'

import { NavigationActions } from 'react-navigation';
//import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';


export default class TimesheetComment extends Component {
	constructor(props) {
	        super(props);
	        // get date from timesheet props
	        this.state = {
	            message: '123',
            	date: new Date(),
            	comment: this.props.navigation.state.params.comment,
            	isEditable: this.props.navigation.state.params.isEditable,
	        };   
          this.updateTimesheetComment = this.props.navigation.state.params.updateTimesheetComment;
			    this.getHTML = this.getHTML.bind(this);
					this.setFocusHandlers = this.setFocusHandlers.bind(this);

          this.props.navigation.setParams({TimesheetComment: this});
	        //this.registerChallengeHandler();
	    }

  static navigationOptions = ({ navigation }) => ({ 
          title: 'Comment',
          headerStyle: { backgroundColor: '#0066B3' },
          headerTitleStyle: [GlobalStyle.actionBarHeader,{marginLeft:0}],
          headerLeft: <LeftBarButton onPress={() => {navigation.state.params.TimesheetComment.getHTML(); navigation.goBack()} } />,
      });
   
	            

  render() {
		var tollbarActions = ['bold','italic','unorderedList'];
		return(
			<View style={styles.container}>
				<RichTextEditor
        	ref={(r)=>this.richtext = r}
        	style={styles.richText}
        	initialContentHTML={this.props.navigation.state.params.comment}
          hiddenTitle={true}
        	initialTitleHTML="Comment"
        	isContentEditable={this.state.isEditable}
        	isTitleEditable={false}
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
  }

  async getHTML() {
    const contentHtml = await this.richtext.getContentHtml();
    this.updateTimesheetComment(contentHtml);
  }

  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      
    });
	}

  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', this.backHandler);
  }
  componentWillUnmount(){
    BackAndroid.removeEventListener('hardwareBackPress', this.backHandler);
  }
  
  backHandler = () => {
    this.getHTML();
    //return false;
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
