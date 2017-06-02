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
  NativeEventEmitter,
  DeviceEventEmitter,
  RefreshControl
} from 'react-native';

import Container from '../components/Container';
import Button from '../components/Button';
import TimesheetButtonOthers from '../components/TimesheetButtonOthers';
import BlueActivityIndicator from '../components/BlueActivityIndicator';

import GridView from 'react-native-grid-view';
//import autobind from 'autobind-decorator';
import { NavigationActions } from 'react-navigation'

import WLClientRN from '../wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from '../wrappers/SecurityCheckChallengeHandlerRN'
import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'

var TIMESHEETS_PER_ROW = 2;
var _DEBUG = false;
//var TIMESHEET_LIST_REQUEST = "/adapters/timesheetAdapter/statuses";
var TIMESHEET_LIST_REQUEST = "/adapters/timesheetAdapter/timesheets/my";

const styles = StyleSheet.create({
	timesheet: {
		height: 60,
		flex:2,
		padding: 4,
	},
	timesheetButton: {
	    backgroundColor: '#29648A',
	    flex: 1,
	    height: 40,
	    margin:4,
	    borderRadius: 4,
	},
	timesheetButtonLabel: {
	    fontSize: 16,
	    color: '#FFF',
	},
	listView: {
	  paddingTop: 20,
	  backgroundColor: '#AAABB8'
	},
	circle: {	    
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#25274D',
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
	    justifyContent: 'center',
		width: 66,
	    height: 66,
	    borderRadius: 66/2,
	    backgroundColor: '#464866',
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
	},
    barButton: {
        backgroundColor: "#464866",
	    borderRadius: 4,
        margin: 4,
        padding: 10
    },
    barButtonLabel: {
        color: "#FFF",
        fontSize: 16,      
    }
});

class TimesheetsGridItem extends Component{
	render(){
		return(
			<View style={styles.timesheet}>
				{ this.props.isMy ? this.getMyTimesheetButton() : this.getOthersTimesheetButton()}			
			</View>
		);
	}

	// showing the button for my timesheets
	getMyTimesheetButton(){
		const {navigate} = this.props.navigation;
		return (
			<Button 
			    label={this.props.timesheet.project.name}
			    styles={{button: styles.timesheetButton, label: styles.timesheetButtonLabel}} 
			    onPress={() => navigate('Timesheet',{timesheetTitle : this.props.timesheet.project.name, timesheet: this.props.timesheet })}
			/>
		);
	}

	// showing button for others timesheets
	// using owner name
	getOthersTimesheetButton(){
		const {navigate} = this.props.navigation;
		return(
			<TimesheetButtonOthers
				owner="Хобня Анастасия Валентиновна"
				project={this.props.timesheet.project.name}
				onPress={() => navigate('Timesheet',{timesheetTitle : this.props.timesheet.project.name, timesheet: this.props.timesheet })}
			/>
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
	          refreshing: false,
	          loggedIn: typeof(params) != "undefined" && typeof(params.loggedIn) != "undefined" ? params.loggedIn : false,
	          useDebug: typeof(params) != "undefined" && typeof(params.useDebug) != "undefined" ? params.useDebug : false,
		    }
        	this.registerChallengeHandler();
        	//this.obtainAccessToken();
    }

    static navigationOptions = { 
        title: 'My Timesheets',
        headerStyle: { backgroundColor: '#0066B3' },
        headerTitleStyle: { color: '#FFF' },
        headerRight: <TouchableHighlight style={styles.barButton} onPress={() => {SecurityCheckChallengeHandlerRN.logout();}}>
                        <Text style={styles.barButtonLabel}>Logout</Text>
                    </TouchableHighlight>,
    }


    registerChallengeHandler() {
        WLClientRN.registerChallengeHandler();
    }

    obtainAccessToken() {
    	SecurityCheckChallengeHandlerRN.obtainAccessToken();
    } 

    logout(){
    	SecurityCheckChallengeHandlerRN.logout();
    	this.navigateToLogin();
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
			        refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._onRefresh()} />}
			      />
			      <View style={styles.circleContainer}>
			      	<TouchableHighlight style={styles.circle} onPress={() => this.pressCreate()}>
			            <Text style={styles.circleText}>+</Text>
			        </TouchableHighlight>
			      </View>
			</View>
	    );
	  }
	   

   _onRefresh() { 
   	 this.setState({refreshing: true}); 
   	 this.fetchData(); 
   }

  componentWillMount(){
    this.addListeners();
  }

  componentWillUnmount(){
  	this.removeListeners();
  }

  componentDidMount() {
    if(!this.state.loggedIn)
    	this.navigateToLogin();
    else
    	this.fetchData();
  }
    
    
  fetchData() {
  	//REMOVE THIS
  	if(this.state.useDebug){
	  	var data = [{"id":"296AE7429510E51D432581150057A97F","employee":{"fullName":"Светлаков Сергей Вадимович","notesAddr":null},"yearMonth":{"year":2017,"month":"MAY","leapYear":false,"monthValue":5},"project":{"name":"MAD"},"tables":[{"code":"П","day":1},{"code":"8ч","day":2},{"code":"8ч","day":3},{"code":"8ч","day":4},{"code":"8ч","day":5},{"code":"8ч","day":6},{"code":"В","day":7},{"code":"В","day":8},{"code":"П","day":9},{"code":"8ч","day":10},{"code":"8ч","day":11},{"code":"8ч","day":12},{"code":"В","day":13},{"code":"В","day":14},{"code":"8ч","day":15},{"code":"8ч","day":16},{"code":"8ч","day":17},{"code":"8ч","day":18},{"code":"8ч","day":19},{"code":"В","day":20},{"code":"В","day":21},{"code":"8ч","day":22},{"code":"8ч","day":23},{"code":"8ч","day":24},{"code":"8ч","day":25},{"code":"8ч","day":26},{"code":"В","day":27},{"code":"В","day":28},{"code":"8ч","day":29},{"code":"8ч","day":30},{"code":"8ч","day":30}],"attributes":null,"status":"draft","comment":null,"report":null},{"id":"296AE7429510E51D432581150057A97F","employee":{"fullName":"Светлаков Сергей Вадимович","notesAddr":null},"yearMonth":{"year":2017,"month":"MAY","leapYear":false,"monthValue":5},"project":{"name":"Обучение 2Dept"},"tables":[{"code":"8ч","day":19},{"code":"8ч","day":15},{"code":"8ч","day":24},{"code":"8ч","day":26},{"code":"В","day":28},{"code":"8ч","day":6},{"code":"8ч","day":30},{"code":"8ч","day":12},{"code":"В","day":21},{"code":"8ч","day":22},{"code":"В","day":20},{"code":"8ч","day":3},{"code":"8ч","day":5},{"code":"8ч","day":25},{"code":"8ч","day":11},{"code":"В","day":13},{"code":"8ч","day":4},{"code":"8ч","day":2},{"code":"П","day":9},{"code":"8ч","day":10},{"code":"8ч","day":23},{"code":"В","day":27},{"code":"8ч","day":18},{"code":"П","day":1},{"code":"В","day":8},{"code":"8ч","day":29},{"code":"8ч","day":16},{"code":"В","day":14},{"code":"В","day":7},{"code":"8ч","day":17},{"code":"8ч","day":31}],"attributes":null,"status":"draft","comment":null,"report":null},{"id":"296AE7429510E51D432581150057A97F","employee":{"fullName":"Светлаков Сергей Вадимович","notesAddr":null},"yearMonth":{"year":2017,"month":"MAY","leapYear":false,"monthValue":5},"project":{"name":"Integration Services"},"tables":[{"code":"8ч","day":19},{"code":"8ч","day":15},{"code":"8ч","day":24},{"code":"8ч","day":26},{"code":"В","day":28},{"code":"8ч","day":6},{"code":"8ч","day":30},{"code":"8ч","day":31},{"code":"8ч","day":12},{"code":"В","day":21},{"code":"8ч","day":22},{"code":"В","day":20},{"code":"8ч","day":3},{"code":"8ч","day":5},{"code":"8ч","day":25},{"code":"8ч","day":11},{"code":"В","day":13},{"code":"8ч","day":4},{"code":"8ч","day":2},{"code":"П","day":9},{"code":"8ч","day":10},{"code":"8ч","day":23},{"code":"В","day":27},{"code":"8ч","day":18},{"code":"П","day":1},{"code":"В","day":8},{"code":"8ч","day":29},{"code":"8ч","day":16},{"code":"В","day":14},{"code":"В","day":7},{"code":"8ч","day":17}],"attributes":null,"status":"draft","comment":null,"report":null}];
	  	this.handleResponse(data);
  	}else{
    	this.getTimesheetListAsPromise();
    }
  }

  async getTimesheetListAsPromise() {
    var error = "";
    //this.setState({ loaded: true, message: '' });
    try {
      var result
      result = await WLResourceRequestRN.asyncRequestWithURL(TIMESHEET_LIST_REQUEST, WLResourceRequestRN.GET);
      this.handleResponse(JSON.parse(result));
      if(_DEBUG)
      	alert(result);
    } catch (e) {
      error = e;
      this.setState({ loaded: false, message: error ? "Failed to retrieve entry - " + error.message : "", refreshing: false});
      alert("Failed to retrieve entry - " + error.message);
    }
  }

  handleResponse(response) {
 	if(_DEBUG)
       alert(JSON.stringify(timesheetsList));
    this.setState({ loaded: true, message: '', dataSource: response, refreshing: false});       
  }

  renderLoadingView() {
    return (
      <View style={{backgroundColor: '#AAABB8'}}>
        <Text>Loading data...</Text>
        <Text>{this.state.message}</Text>
      </View>
    );
  }

  renderItem(item) {
    return <TimesheetsGridItem timesheet={item} navigation={this.props.navigation} isMy={true}/>
  }

  	
  navTimesheet(title){
    this.props.navigation.navigate('Timesheet', {timesheetTitle : "title", useDebug : this.state.useDebug});
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

  pressCreate(){
  	var params = {
  		user: "Хобня",
  		useDebug: this.state.useDebug,
  	};
    this.props.navigation.navigate('CreateTimesheet', params);
  }

  addListeners() {
    var that = this;       
    this.challengeEventModuleSubscription  = DeviceEventEmitter.addListener(
      'LOGIN_REQURIED', function (challenge) {
      	if(_DEBUG)
          alert("Login REQURIED");
        that.navigateToLogin();
      }
    );
    this.logoutEventModuleSubscription  = DeviceEventEmitter.addListener(
      'LOGOUT_SUCCESS', function (challenge) {
      	//if(_DEBUG)
        //  alert("Logout Success");
        that.navigateToLogin();
      }
    );
  }    


  removeListeners(){
    this.challengeEventModuleSubscription.remove();
    this.logoutEventModuleSubscription.remove();
  }    
}
const challengeEventModule = new NativeEventEmitter(NativeModules.SecurityCheckChallengeHandlerEventEmitter);

