import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  NativeModules,
  NativeEventEmitter
} from 'react-native';

import Container from '../components/Container';
import Button from '../components/Button';

import GridView from 'react-native-grid-view';
//import autobind from 'autobind-decorator';
import { NavigationActions } from 'react-navigation'

import WLClientRN from '../wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from '../wrappers/SecurityCheckChallengeHandlerRN'
import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'

var TIMESHEETS_PER_ROW = 2;
var _DEBUG = true;
var TIMESHEET_LIST_REQUEST = "/adapters/timesheetAdapter/statuses";

class TimesheetsGridItem extends Component{
	render(){
		const {navigate} = this.props.navigation;
		return(
			<View style={styles.timesheet}>
			    <Button 
			        label={this.props.timesheet.title}
			        styles={{button: styles.timesheetButton, label: styles.label}} 
			        onPress={() => navigate('Timesheet',{timesheetTitle : this.props.timesheet.title})}
			         />
			</View>
		);
	}
}
// cannot get navigate function. need to bind appropriately
//	

export default class Timesheets extends Component {
	constructor(props) {
	        super(props);
		    this.state = {
		      dataSource: null,
	          loaded: false,
	          message: ''
		    }
        	this.registerChallengeHandler();
        	this.obtainAccessToken();
    }


    registerChallengeHandler() {
        WLClientRN.registerChallengeHandler();
    }

    obtainAccessToken() {
    	SecurityCheckChallengeHandlerRN.obtainAccessToken();
    } 

    
	  render() {
	  	if (!this.state.loaded) {
	     return this.renderLoadingView();
	    }
	    var response = [{"title":"Integration Services", "owner":"Anastasiya Khobnia"},{"title":"Park Keeping", "owner":"Anastasiya Khobnia"},{"title":"Rockwell Automation", "owner":"Anastasiya Khobnia"}];
	    return (
	        	<GridView
			        items={response}
			        itemsPerRow={TIMESHEETS_PER_ROW}
			        renderItem={(item) => this.renderItem(item)}
			        style={styles.listView}
			      />
	    );
	  }

  componentDidMount() {
    this.fetchData();
  }
    
    
  fetchData() {
  	this.handleResponse(null);
    //this.getTimesheetListAsPromise();
  }

  async getTimesheetListAsPromise() {
    //SecurityCheckChallengeHandlerRN.cancel();
    var error = "";
    //this.setState({ loaded: true, message: '' });
    try {
      var result
      result = await WLResourceRequestRN.asyncRequestWithURL(TIMESHEET_LIST_REQUEST, WLResourceRequestRN.GET);
      this.handleResponse(JSON.parse(result))
    } catch (e) {
      error = e;
    }
    this.setState({ loaded: false, message: error ? "Failed to retrieve entry - " + error.message : ""});
  }

  handleResponse(response) {
    response = [{"title":"Integration Services", "owner":"Anastasiya Khobnia"},{"title":"Park Keeping", "owner":"Anastasiya Khobnia"},{"title":"Rockwell Automation", "owner":"Anastasiya Khobnia"}];
    this.setState({ loaded: true, message: '', dataSource: `${response}`});       
  }

  renderLoadingView() {
    return (
      <View>
        <Text>Loading data...</Text>
        <Text>{this.state.message}</Text>
      </View>
    );
  }

  renderItem(item) {
    return <TimesheetsGridItem timesheet={item} navigation={this.props.navigation}/>
  }

  	
  navTimesheet(title){
    this.props.navigation.navigate('Timesheet', {timesheetTitle : "title"});
  }

  navigateToLogin(){
    const resetAction = NavigationActions.reset({
      index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Login'})
        ]
    });
    this.props.navigation.dispatch(resetAction);
  }



  addListeners() {
    var that = this;       
    const challengeEventModuleSubscription  = challengeEventModule.addListener(
      'LOGIN_REQURIED', function (challenge) {
      	if(_DEBUG)
          alert("Login REQURIED");
        that.navigateToLogin();
      }
    );
    const failureEventModuleSubscription  = challengeEventModule.addListener(
      'LOGIN_FAILED', function (challenge) {
      	if(_DEBUG)
          alert("Login Failed");
        that.navigateToLogin();
      }
    );
    const successEventModuleSubscription  = challengeEventModule.addListener(
      'LOGIN_SUCCESS', function (challenge) {
      	if(_DEBUG)
          alert("Login Success");
      }
    );
    const logoutEventModuleSubscription  = challengeEventModule.addListener(
      'LOGOUT_SUCESS', function (challenge) {
      	if(_DEBUG)
          alert("Logout Success");
        that.navigateToLogin();
      }
    );
  }    
}
const challengeEventModule = new NativeEventEmitter(NativeModules.SecurityCheckChallengeHandlerEventEmitter);

const styles = StyleSheet.create({
	timesheet: {
		height: 60,
		flex: 1,
		alignItems: 'flex-start', 
		margin: 2,
	},
	timesheetButton: {
	    backgroundColor: '#3B5699',
	    width: 170
	},
	listView: {
	  paddingTop: 20,
	  backgroundColor: '#F5FCFF',
	},
});