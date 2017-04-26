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
import autobind from 'autobind-decorator';

import WLClientRN from '../wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from '../wrappers/SecurityCheckChallengeHandlerRN'
import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'

var TIMESHEETS_PER_ROW = 2;

class TimesheetsGridItem extends Component{
	render(){
		return(
			<View styles={styles.timesheet}>
			    <Button 
			        label={this.props.timesheet.title}
			        styles={{button: styles.timesheetButton, label: styles.label}} 
			         />
			</View>
		);
	}
}
// cannot get navigate function. need to bind appropriately
//	onPress={() => navigate({timesheetTitle : this.props.timesheet.title})}

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
	    return (
	        	<GridView
			        items={this.state.dataSource}
			        itemsPerRow={TIMESHEETS_PER_ROW}
			        renderItem={this.renderItem.bind(this)}
			        style={styles.listView}
			      />
	    );
	  }

	componentDidMount() {
		if(this.state.loggedIn){
	   		this.fetchData();
		}else{
        	this.props.navigation.navigate("Login");
		}
	}
    
    
	fetchData() {
	  	//testing grid
	  	// this.setState({
	   //         dataSource: [{"title":"Integration Services", "owner":"Anastasiya Khobnia"},{"title":"Park Keeping", "owner":"Anastasiya Khobnia"},{"title":"Rockwell Automation", "owner":"Anastasiya Khobnia"}],
	   //         loaded: true,
	   //       });
	    this.getMFBlogEnriesAsPromise();
 	 }

 	async getMFBlogEnriesAsPromise() {
        //SecurityCheckChallengeHandlerRN.cancel();
        var error = "";
        //this.setState({ loaded: true, message: '' });
        try {
            var result
            result = await WLResourceRequestRN.asyncRequestWithURL("/adapters/timesheetAdapter/statuses", WLResourceRequestRN.GET);
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
	         <Button 
			        label='IS'
			        styles={{button: styles.timesheetButton, label: styles.label}} 
			        onPress={() => this.navTimesheet.bind(this)} />
	      </View>
	    );
	  }

	renderItem(item) {
    	return <TimesheetsGridItem timesheet={item} />
  	}

  	
    navTimesheet(title){
		this.props.navigation.navigate('Timesheet', {timesheetTitle : "title"});
	}

    navigateToLogin(){
		this.props.navigation.navigate('Login');
	}



	addListeners() {
        var that = this;       
        const challengeEventModuleSubscription  = challengeEventModule.addListener(
            'LOGIN_REQURIED', function (challenge) {
                    alert("Login REQURIED");
                    that.navigateToLogin();
            }
        );
        const failureEventModuleSubscription  = challengeEventModule.addListener(
            'LOGIN_FAILED', function (challenge) {
                    alert("Login Failed");
                    that.navigateToLogin();
            }
        );
        const successEventModuleSubscription  = challengeEventModule.addListener(
            'LOGIN_SUCCESS', function (challenge) {
                    alert("Login Success");
            }
        );
        const logoutEventModuleSubscription  = challengeEventModule.addListener(
            'LOGOUT_SUCESS', function (challenge) {
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
	    backgroundColor: '#3B5699'
	},
	listView: {
	  paddingTop: 20,
	  backgroundColor: '#F5FCFF',
	},
});