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
import DatePicker from '../components/DatePicker';
import { NavigationActions } from 'react-navigation'

import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'


const PROJECT_LIST_REQUEST = "/adapters/timesheetAdapter/projects/my";
const PROJECT_CREATE_REQUEST = "/adapters/timesheetAdapter/projects/create";
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
        	user : "Хобня",
        	users : ["Хобня", "Светлаков"],
        	projects : [{name: DEFAULT_PROJECT}],
        	months : m,
        	project : DEFAULT_PROJECT,
        	date : new Date(),
        	month : m[curDate.getMonth()],
        	year : curDate.getFullYear(),
        	message: 'error here',
	        useDebug: typeof(params) != "undefined" && typeof(params.useDebug) != "undefined" ? params.useDebug : false,
        };

        setParams({project:null, month: m[curDate.getMonth()], year:curDate.getFullYear()});
    }

	static navigationOptions = ({ navigation }) => ({ 
        title: 'Create Timesheet',
        headerStyle: { backgroundColor: '#0066B3' },
        headerTitleStyle: { color: '#FFF' },
        headerRight: <TouchableHighlight style={styles.barButton} onPress={() => {if(navigation.state.params.project === null) alert('Select a project, please.');}}>
                        <Text style={styles.barButtonLabel}>Create</Text>
                    </TouchableHighlight>,
    });


    static postProject(params){

    }



    getAllUsernames(){
    	var result = [];
    	for(var i=0; i<this.state.users.length; i++){
    		result.push( <Picker.Item label={this.state.users[i]} value={this.state.users[i]} />) ;
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
            	<Label text="Username" />
            	<View 
	            	style={styles.picker}
	           	>
		            <Picker 
	            		style={styles.pickerText}
		            	selectedValue={this.state.user}
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
		            	onValueChange={(p) => this.changeProject(p)}
		            > 
		            	{this.getAllProjects()}	
		            </Picker>
		        </View>
            </View>
        );
    }

  componentWillMount(){
    this.addListeners();
  }

  componentWillUnmount(){
  	this.removeListeners();
  }

  componentDidMount() {
    this.fetchData(null,null);
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
      	if(_DEBUG)
          alert("Login REQURIED");
        that.navigateToLogin();
      }
    );
  }    


  removeListeners(){
    this.challengeEventModuleSubscription.remove();
  } 

  changeMonth(m){
  	this.setState({month: m}); 
    const {setParams} = this.props.navigation;
    setParams({month: m});
  	this.fetchData(null, m);
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
  	this.setState({year: y}); 
    const {setParams} = this.props.navigation;
    setParams({year: y});
  	this.fetchData(y, null);
  }

  fetchData(year, month) {
  	//REMOVE THIS
  	if(year === null)
  		year = this.state.year;
  	if(month === null)
  		month = (this.state.months.indexOf(this.state.month)+1);
  	else
  		month = (this.state.months.indexOf(month)+1);

  	if(this.state.useDebug){
	  	var data = [{"name": "MAD"},{"name": "Обучение 2nd Dept"}];
	  	this.handleResponse(data);
	}else{
    	this.getProjectListAsPromise(year, month);
    }
  }

  async getProjectListAsPromise(year, month) {
    var error = "";
    //this.setState({ loaded: true, message: '' });
    try {
      var result
      result = await WLResourceRequestRN.asyncRequestWithURL(PROJECT_LIST_REQUEST+"?year="+year+"&month"+month, WLResourceRequestRN.GET);
      this.handleResponse(JSON.parse(result));
      //if(_DEBUG)
      alert(result);
    } catch (e) {
      error = e;
      this.setState({ message: error ? "Failed to retrieve entry - " + error.message : ""});
    }
  }

  async postProjectAsPromise(year, month) {
    var error = "";
    //this.setState({ loaded: true, message: '' });
    try {
      var result
      result = await WLResourceRequestRN.asyncRequestWithURL(PROJECT_CREATE_REQUEST+"?year="+year+"&month"+month, WLResourceRequestRN.POST);
      this.handleResponse(JSON.parse(result));
      //if(_DEBUG)
      alert(result);
    } catch (e) {
      error = e;
      this.setState({ message: error ? "Failed to retrieve entry - " + error.message : ""});
    }
  }

  handleResponse(response) {
 	//if(_DEBUG)
    //   alert(JSON.stringify(timesheetsList));
    response.unshift({name : DEFAULT_PROJECT});
    this.setState({ message: '', projects : response});       
  }
}
