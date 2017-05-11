import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  TouchableHighlight,
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
//var TIMESHEET_LIST_REQUEST = "/adapters/timesheetAdapter/statuses";
var TIMESHEET_LIST_REQUEST = "/adapters/timesheetAdapter/timesheets/my";

class TimesheetsGridItem extends Component{
	render(){
		const {navigate} = this.props.navigation;
		return(
			<View style={styles.timesheet}>
			    <Button 
			        label={this.props.timesheet.project.name}
			        styles={{button: styles.timesheetButton, label: styles.label}} 
			        onPress={() => navigate('Timesheet',{timesheetTitle : this.props.timesheet.project.name, timesheetData: this.props.timesheet })}
			         />
			</View>
		);
	}
}

// class TimesheetsGridItem extends Component{
// 	render(){
// 		const {navigate} = this.props.navigation;
// 		return(
// 			<View style={styles.timesheet}>
// 			    <Button 
// 			        label={this.props.timesheet.title}
// 			        styles={{button: styles.timesheetButton, label: styles.label}} 
// 			        onPress={() => navigate('Timesheet',{timesheetTitle : this.props.timesheet.title})}
// 			         />
// 			</View>
// 		);
// 	}
// }
// cannot get navigate function. need to bind appropriately
//	

export default class Timesheets extends Component {
	constructor(props) {
	        super(props);
	        const { params } = this.props.navigation.state;
		    this.state = {
		      dataSource: null,
	          loaded: false,
	          message: '',
	          loggedIn: typeof(params) != "undefined" && typeof(params.loggedIn) != "undefined" ? params.loggedIn : false,
		    }
        	this.registerChallengeHandler();
        	//this.obtainAccessToken();
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
	    return (
	    	<View style={styles.outerContainer}>
	    			<GridView
			        items={this.state.dataSource}
			        itemsPerRow={TIMESHEETS_PER_ROW}
			        renderItem={(item) => this.renderItem(item)}
			        style={styles.listView}
			      />
			      <View style={styles.circleContainer}>
			      	<TouchableHighlight style={styles.circle}>
			            <Text style={styles.circleText}>+</Text>
			        </TouchableHighlight>
			      </View>
			</View>
	    );
	  }
	        

  componentDidMount() {
    this.addListeners();
    if(!this.state.loggedIn)
    	this.navigateToLogin();
    else
    	this.fetchData();
  }
    
    
  fetchData() {
  	//is.handleResponse(null);
    this.getTimesheetListAsPromise();
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
      this.setState({ loaded: false, message: error ? "Failed to retrieve entry - " + error.message : ""});
    }
  }

  handleResponse(response) {
  	var timesheetsList = [];
  	for(var i in response)
	{
	     var project_name = response[i].project.name;
	     var project_owner = response[i].employee.fullName;
	     var project_id = response[i].id;

	     var project_month = response[i].yearMonth.month;

	    timesheetsList.push({ 
        "title" : project_name,
        "id"  : project_id
    	});
	}
  	if(_DEBUG)
       alert(JSON.stringify(timesheetsList));
    this.setState({ loaded: true, message: '', dataSource: response});       
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
      	//if(_DEBUG)
        //  alert("Login Success - Timesheeets");
      }
    );
    const logoutEventModuleSubscription  = challengeEventModule.addListener(
      'LOGOUT_SUCCESS', function (challenge) {
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
	  backgroundColor: '#F5FCFF'
	},
	circle: {	    
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: 'red',
		width: 62,
	    height: 62,
	    borderRadius: 62/2,
	    shadowColor: "#000000",
	    shadowOpacity: 0.8,
	    shadowRadius: 2,
	    shadowOffset: {
	      height: 4,
	      width: -4
	    },
	},
	circleContainer: {
		width: 70,
	    height: 70,
	    borderRadius: 70/2,
	    backgroundColor: 'white',
		position: 'absolute',
	    bottom: 10,
	    right: 10,
	},
	circleText: {
	    fontSize: 40,
	    color: 'white'
	},
	outerContainer:{
		flex: 1,		
	}
});