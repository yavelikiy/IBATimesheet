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
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';

import Label from '../components/Label';
import BlueActivityIndicator from '../components/BlueActivityIndicator';
import { NavigationActions } from 'react-navigation'

import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'


const PROJECT_LIST_REQUEST = "/adapters/timesheetAdapter/projects/my";
const PROFILE_REQUEST = "/adapters/timesheetAdapter/profiles/my";
const TIMESHEET_CREATE_REQUEST = "/adapters/timesheetAdapter/timesheets";
const DEFAULT_PROJECT = "-- select one --";

const styles = StyleSheet.create({
	container: {
	    justifyContent: 'center',
	  	backgroundColor: '#AAABB8',
	    padding: 30,
	    flexDirection: 'column',
	    flex: 1
	},
	label: {
	    color: '#0d8898',
	    fontSize: 20
	},
	row: {
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
    },
    picker:{
	    backgroundColor: '#29648A',
	    borderRadius: 4,
	    marginBottom: 4,
    },
    pickerHalfSized:{
	    backgroundColor: '#29648A',
	    borderRadius: 4,
	    flex: 1
    },
    pickerText:{
	    color: '#FFF',

    }
});

export default class CreateTimesheet extends Component {
	constructor(props) {
        super(props);
    //     const { params } = this.props.navigation.state;
				// const {setParams} = this.props.navigation;

    //     // this.setState({
    //     // 	user : params.user,
    //     // 	users : params.users,
    //     // 	projects : params.projects,
    //     // 	project : null,
    //     // 	date : new Date()
    //     // });

    //     var curDate = new Date();
    //     var m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //     this.state = {
    //     	user : DEFAULT_PROJECT,
    //     	users : [{ fullName : DEFAULT_PROJECT}],
    //     	projects : [{name: DEFAULT_PROJECT}],
    //     	months : m,
    //     	project : DEFAULT_PROJECT,
    //     	date : new Date(),
    //     	month : m[curDate.getMonth()],
    //     	year : curDate.getFullYear(),
    //     	message: 'error here',
	   //      useDebug: typeof(params) != "undefined" && typeof(params.useDebug) != "undefined" ? params.useDebug : false,
	   //      isLoading : true,
    //     };

    //     setParams({project:null, month: m[curDate.getMonth()], year:curDate.getFullYear(), months: m});
    }

	static navigationOptions = ({ navigation }) => ({ 
        title: 'Create Timesheet',
        headerStyle: { backgroundColor: '#0066B3' },
        headerTitleStyle: { color: '#FFF' },
        headerRight: <TouchableHighlight 
    					style={styles.barButton} 
    					onPress={() => {
        						if(navigation.state.params.project === null) {
        							alert('Select a project, please.');
        						}
        						else{
        							var month = (navigation.state.params.months.indexOf(navigation.state.params.month)+1);
        							var textMonth = month > 9 ? ""+month : "0"+month; 
        							var user = navigation.state.params.user;
        							var project = navigation.state.params.project;
	        						var timesheet = {
	        							yearMonth: navigation.state.params.year+"-"+textMonth, 
	        							project: {name: project}, 
	        							employee:{fullName: user}
	        						};
	        						alert(JSON.stringify(timesheet));
	        						CreateTimesheet.sendCreateTimesheetRequest(JSON.stringify(timesheet));
								}
    						}
    					}
        			>
                        <Text style={styles.barButtonLabel}>Create</Text>
                    </TouchableHighlight>,
    });



    static async sendCreateTimesheetRequest(timesheet){
    	var error = "";
	    //this.setState({ loaded: true, message: '' });
	    try {
	      var result
	      result = await WLResourceRequestRN.asyncRequestWithURLBody(TIMESHEET_CREATE_REQUEST, WLResourceRequestRN.POST, timesheet);
	      alert(JSON.stringify(result));
	    } catch (e) {
	      error = e;
	      alert("Failed to retrieve entry - " + error.message);
	    }
    }

    init(){
    	// Создаётся объект promise
		let promiseProfile = new Promise((resolve, reject) => {
		      var result
		      result = WLResourceRequestRN.asyncRequestWithURL(PROFILE_REQUEST, WLResourceRequestRN.GET);
		      resolve(result);
		});

		let promiseProjects = new Promise((resolve, reject) => {
			  var year = this.state.year;
			  var month = this.getMonthByName(null);
		      var result
		      result = WLResourceRequestRN.asyncRequestWithURL(PROJECT_LIST_REQUEST+"?year="+year+"&month="+month, WLResourceRequestRN.GET);
		      resolve(result);
		});

		// promise.then навешивает обработчики на успешный результат или ошибку
		promiseProfile
		  .then( response => {
		      this.handleProfileResponse(JSON.parse(response));
		      return promiseProjects;
		  })
		  .then( response => {
		      this.handleProjectListResponse(JSON.parse(response));
  				this.setState({isLoading : false});
		  })
		  .catch(error => {
		    alert(error); // Error: Not Found
		  });
    }



    getAllUsernames(){
    	var result = [];
    	for(var i=0; i<this.state.users.length; i++){
    		result.push( <Picker.Item label={this.state.users[i].fullName} value={this.state.users[i].fullName} />) ;
    	}
    	return result;
    }

    getAllProjects(){
    	var result = [];
    	for(var i=0; i<this.state.projects.length; i++){
    		result.push( <Picker.Item label={this.state.projects[i].name} value={this.state.projects[i].name} />) ;
    	}
    	return result;
    }

    createTimesheet(){
    	alert('call to MFP');
    }



    getAllMonths(){
    	var result = [];
    	//var iMonth = (new Date()).getMonth();
    	var iMonth = 0;
    	for(var i=0; i<12; i++){
    		result.push( <Picker.Item label={this.state.months[iMonth]} value={this.state.months[iMonth]} />) ;
    		if(iMonth==11)
    			iMonth=0;
    		else
    			iMonth++;
    	}
    	return result;
    }

    getAllYears(){
    	var result = [];
    	var year = (new Date()).getFullYear();
    	for(var i=0; i<4; i++){
    		result.push( <Picker.Item label={year+i+""} value={year+i} />) ;
    	}
    	return result;
    }

    render() {
        return (
            <View style={styles.container}>
            	{ this.state.isLoading && <BlueActivityIndicator ref="indicator" animating={this.state.isLoading}/> }
            	{ !this.state.isLoading && <BlueActivityIndicator ref="indicator" animating={this.state.isLoading}/> }
            	<Label text="Username" />
            	<View 
	            	style={styles.picker}
	           	>
		            <Picker 
	            		style={styles.pickerText}
		            	selectedValue={this.state.user}
              			enabled={!this.state.isLoading}
		            	onValueChange={(u) => this.changeUser(u)}
		            > 
		            	{this.getAllUsernames()}	
		            </Picker>
		        </View>
	            <Label text="Period" />
	            <View style={styles.row}>
	            	<View 
	            		style={styles.picker}
	           		>
			            <Picker 
		            		style={styles.pickerText}
			            	selectedValue={this.state.month}
              				enabled={!this.state.isLoading}
			            	onValueChange={(m) => this.changeMonth(m)}
			            > 
			            	{this.getAllMonths()}	
			            </Picker>
		        	</View>
		            <View 
	            		style={styles.picker}
	           		>
			            <Picker 
		            		style={styles.pickerText}
			            	selectedValue={this.state.year}
              				enabled={!this.state.isLoading}
			            	onValueChange={(y) => this.changeYear(y)}
			            > 
			            	{this.getAllYears()}	
			            </Picker>
		        	</View>
		        </View>
            	<Label text="Project" />
            	<View 
	            	style={styles.picker}
	           	>
		            <Picker 
		            	style={styles.pickerText}
		            	selectedValue={this.state.project} 
              			enabled={!this.state.isLoading}
		            	onValueChange={(p) => this.changeProject(p)}
		            > 
		            	{this.getAllProjects()}	
		            </Picker>
		        </View>
            </View>
        );
    }

  componentWillMount(){
  			const { params } = this.props.navigation.state;
				const {setParams} = this.props.navigation;

        // this.setState({
        // 	user : params.user,
        // 	users : params.users,
        // 	projects : params.projects,
        // 	project : null,
        // 	date : new Date()
        // });

        var curDate = new Date();
        var m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.state = {
        	user : DEFAULT_PROJECT,
        	users : [{ fullName : DEFAULT_PROJECT}],
        	projects : [{name: DEFAULT_PROJECT}],
        	months : m,
        	project : DEFAULT_PROJECT,
        	date : new Date(),
        	month : m[curDate.getMonth()],
        	year : curDate.getFullYear(),
        	message: 'error here',
	        useDebug: typeof(params) != "undefined" && typeof(params.useDebug) != "undefined" ? params.useDebug : false,
	        isLoading : true,
        };
        setParams({project:null, month: m[curDate.getMonth()], year:curDate.getFullYear(), months: m});
    this.addListeners();
  }

  componentWillUnmount(){
  	this.removeListeners();
  }

  componentDidMount() {
    this.init();
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
    this.challengeEventModuleSubscription  = DeviceEventEmitter.addListener(
      'LOGIN_REQURIED', function (challenge) {
      	Alert.alert(
					'Login required',
					'Log in, please.'
				);
        that.navigateToLogin();
      }
    );
  }    


  removeListeners(){
    this.challengeEventModuleSubscription.remove();
  } 

  changeMonth(m){
  	this.setState({month: m, isLoading: true}); 
    const {setParams} = this.props.navigation;
    setParams({month: m});
  	this.fetchProjectList(null, m);
  }

  changeProject(p){
  	this.setState({project: p}); 
    const {setParams} = this.props.navigation;
    if(p === DEFAULT_PROJECT)
    	setParams({project: null});
    else
    	setParams({project: p});
  }

  changeUser(u){
  	this.setState({user: u}); 
    const {setParams} = this.props.navigation;
    setParams({user: u});
  }

  changeYear(y){
  	this.setState({year: y, isLoading: true}); 
    const {setParams} = this.props.navigation;
    setParams({year: y});
  	this.fetchProjectList(y, null);
  }

  getMonthByName(month){
  	if(month === null)
  		return (this.state.months.indexOf(this.state.month)+1);
  	else
  		return (this.state.months.indexOf(month)+1);
  }

  fetchProjectList(year, month) {
  	//REMOVE THIS
  	if(year === null)
  		year = this.state.year;
  	if(month === null)
  		month = (this.state.months.indexOf(this.state.month)+1);
  	else
  		month = (this.state.months.indexOf(month)+1);

  	if(this.state.useDebug){
	  	var data = [{"name": "MAD"},{"name": "Обучение 2nd Dept"}];
	  	this.handleProjectListResponse(data);
	}else{
    	this.getProjectListAsPromise(year, month);
    }
  }

  fetchProfileData(){
  	if(this.state.useDebug){
	  	var data = [{"fullName": "Светлаков Сергей", notesAddr: null}];
	  	this.handleProfileResponse(data);
	}else{
    	this.getProfileAsPromise();
    }
  }

  async getProjectListAsPromise(year, month) {
    var error = "";
    //this.setState({ loaded: true, message: '' });
    try {
      var result
      result = await WLResourceRequestRN.asyncRequestWithURL(PROJECT_LIST_REQUEST+"?year="+year+"&month="+month, WLResourceRequestRN.GET);
      //alert(PROJECT_LIST_REQUEST+"?year="+year+"&month="+month+":"+result);
      this.handleProjectListResponse(JSON.parse(result));
    } catch (e) {
      error = e;
      alert("Failed to retrieve entry - " + error.message : "");
    }
    this.setState({isLoading: false});
  }


  async getProfileAsPromise() {
    var error = "";
    //this.setState({ loaded: true, message: '' });
    try {
      var result
      result = await WLResourceRequestRN.asyncRequestWithURL(PROFILE_REQUEST, WLResourceRequestRN.GET);
      this.handleProfileResponse(JSON.parse(result));
    } catch (e) {
      error = e;
      alert("Failed to retrieve entry - " + error.message : "");
    }
    this.setState({isLoading: false});
  }

  // async postProjectAsPromise(timesheet) {
  // 	timesheet = {yearMonth:"2017-06", project: {name: "MAD"}, employee:{fullName: "Светлаков Сергей Вадимович"}};
  //   var error = "";
  //   //this.setState({ loaded: true, message: '' });
  //   try {
  //     var result
  //     result = await WLResourceRequestRN.asyncRequestWithURLBody(PROJECT_CREATE_REQUEST, WLResourceRequestRN.POST, timesheet);
  //     this.handleResponse(JSON.parse(result));
  //     alert(result);
  //   } catch (e) {
  //     error = e;
  //     alert("Failed to retrieve entry - " + error.message : "");
  //   }
  // }

  handleProjectListResponse(response) {
 	//if(_DEBUG)
    //   alert(JSON.stringify(timesheetsList));
    response.unshift({name : DEFAULT_PROJECT});
    this.setState({ message: '', projects : response});       
  }

  handleProfileResponse(response) {
 	//if(_DEBUG)
 	// isn't array now
    //alert(JSON.stringify(response));
    var users = [];
    users.push(response);
    this.setState({ message: '', users : users, user : response.fullName});       
  }

  handleCreateTimesheetResponse(response) {
 	//if(_DEBUG)
 	// isn't array now
    alert(JSON.stringify(response));
    this.setState({ message: '', users : users, user : response.fullName});       
  }
}
