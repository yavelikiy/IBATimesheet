import React, { Component } from 'react';
 
import {
  StyleSheet,
  BackAndroid,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  Picker,
  Modal,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';
import {Icon, Button, Label, Text as BaseText} from 'native-base';

//import Label from '../components/Label';
import BlueActivityIndicator from '../components/BlueActivityIndicator';
import LeftBarButton from '../components/LeftBarButton';
import { NavigationActions } from 'react-navigation'

import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'
import GlobalStyle from '../styles/GlobalStyle'


const PROJECT_LIST_REQUEST = "/adapters/timesheetAdapter/projects/my";
const PROFILE_REQUEST = "/adapters/timesheetAdapter/profiles/my";
const TIMESHEET_CREATE_REQUEST = "/adapters/timesheetAdapter/timesheets";
const DEFAULT_PROJECT = "-- select one --";

const styles = StyleSheet.create({
	container: {
	    justifyContent: 'center',
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
    backgroundColor: "#CCB400",
    alignItems: 'center',
    borderRadius: 4,
    margin: 4,
    padding: 10,
    width:100
  },
  barButtonLabel: {
      color: '#004274',
      fontSize: 16,      
  },
  picker:{
    backgroundColor: '#29648A',
    borderRadius: 4,
    marginBottom: 4,
  },
  pickerText:{
    color: '#FFF',

  },
  modalOuter:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor:'rgba(255, 255, 255, 0.6)',
    padding: 20,
  },
  textLabel: {
        fontSize: 20,
        fontFamily: 'Roboto',
        marginBottom: 10,
        color: '#004274'
    }
});

export default class CreateTimesheet extends Component {
	constructor(props) {
        super(props);
        this.updateTimesheets = this.props.navigation.state.params.updateTimesheets;
    }

	static navigationOptions = ({ navigation }) => ({ 
        title: 'Create Timesheet',
        headerStyle: GlobalStyle.globalBackgroundDark,
        headerTitleStyle: [GlobalStyle.actionBarHeader,{marginLeft:0}],
        headerLeft: <LeftBarButton onPress={() => {navigation.state.params.updateTimesheets(); navigation.goBack()} } />,
        headerRight:<View style={{padding:4}}><Button underlayColor="#ccc" transparent iconRight onPress={() => {
                    if(navigation.state.params.project === null) {
                      alert('Select a project, please.');
                    }
                    else{
                      var month = navigation.state.params.that.state.date.getMonth() + navigation.state.params.that.state.period + 1;
                      var year = navigation.state.params.that.state.date.getFullYear();
                      if(month > 12){
                        month -= 12;
                        year++;
                      }
                      var textMonth = month > 9 ? "" + month : "0"+month; 
                      var user = navigation.state.params.user;
                      var project = navigation.state.params.project;
                      var timesheet = {
                        yearMonth: year+"-"+textMonth, 
                        project: {name: project}, 
                        employee:{fullName: user}
                      };
                      //alert(JSON.stringify(timesheet));
                      navigation.state.params.that.setState({isLoading: true});
                      CreateTimesheet.sendCreateTimesheetRequest(JSON.stringify(timesheet), navigation);
                }
                }
              }>
                        <BaseText style={{color: '#F2CA27', marginRight:4}}>Create</BaseText>
                        <Icon name="create"  style={{color: '#F2CA27'}}/>
                    </Button></View>,
    });

   // headerRight: <TouchableHighlight 
   //            style={GlobalStyle.barButton} 
   //            onPress={() => {
   //                  if(navigation.state.params.project === null) {
   //                    alert('Select a project, please.');
   //                  }
   //                  else{
   //                    var month = (navigation.state.params.months.indexOf(navigation.state.params.month)+1);
   //                    var textMonth = month > 9 ? ""+month : "0"+month; 
   //                    var user = navigation.state.params.user;
   //                    var project = navigation.state.params.project;
   //                    var timesheet = {
   //                      yearMonth: navigation.state.params.year+"-"+textMonth, 
   //                      project: {name: project}, 
   //                      employee:{fullName: user}
   //                    };
   //                    //alert(JSON.stringify(timesheet));
   //                    CreateTimesheet.sendCreateTimesheetRequest(JSON.stringify(timesheet), navigation);
   //              }
   //              }
   //            }
   //            >
   //                      <Text style={GlobalStyle.barButtonLabel}>Create</Text>
   //                  </TouchableHighlight>,



    static async sendCreateTimesheetRequest(timesheet, navigation){
    	var error = "";
	    //this.setState({ loaded: true, message: '' });
	    try {
	      var result
	      result = await WLResourceRequestRN.asyncRequestWithURLBody(TIMESHEET_CREATE_REQUEST, WLResourceRequestRN.POST, timesheet);
        navigation.state.params.updateTimesheets();
        navigation.goBack();
	      //alert(JSON.stringify(result));
	    } catch (e) {
	      error = e;
	      alert("Failed to retrieve entry - " + error.message);
        navigation.state.params.that.setState({isLoading: false});
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
			  var month = this.state.date.getMonth() + this.state.period + 1;
			  var year = this.state.date.getFullYear();
        if(month > 12){
          month -= 12;
          year++;
        }
	      var result
        //alert(PROJECT_LIST_REQUEST+"?year="+year+"&month="+month);
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
    		result.push( <Picker.Item key={i} label={this.state.users[i].fullName} value={this.state.users[i].fullName} />) ;
    	}
    	return result;
    }

    getAllProjects(){
    	var result = [];
    	for(var i=0; i<this.state.projects.length; i++){
    		result.push( <Picker.Item key={i} label={this.state.projects[i].name} value={this.state.projects[i].name} />) ;
    	}
    	return result;
    }

    createTimesheet(){
    	//alert('call to MFP');
    }

    getAllPeriods(){
      var result = [];
      var year = this.state.date.getFullYear();
      var month = this.state.date.getMonth();

      for(var i=0; i<4; i++){
        result.push( <Picker.Item key={i} label={this.state.months[month] +' '+year} value={i} />) ;
        if(month < 11)
          month++;
        else{
          month = 0;
          year++;
        }

      }  
      return result;

    }

    render() {
        return (
            <View style={[styles.container, GlobalStyle.globalBackground]}>
              <Modal 
                animationType={"fade"} 
                transparent={true} 
                visible={this.state.isLoading} 
                onRequestClose={() => {}} 
              >
                <TouchableOpacity 
                  style={GlobalStyle.activityModalOuter} 
                  onPress={() => this.setState({isLoading: false})}
                  activeOpacity={0}
                  focusedOpacity={0}
                >
                  <BlueActivityIndicator ref="indicator" animating={true}/>
                </TouchableOpacity>
              </Modal>
              <Label style={{ marginBottom: 10, color: '#004274'}}>Username</Label>
            	<View 
	            	style={[GlobalStyle.picker, GlobalStyle.pickerBackgroundColor5]}
	           	>
		            <Picker 
	            		style={GlobalStyle.pickerText}
		            	selectedValue={this.state.user}
              		enabled={!this.state.isLoading}
		            	onValueChange={(u) => this.changeUser(u)}
		            > 
		            	{this.getAllUsernames()}	
		            </Picker>
		        </View>
	            <Label style={{ marginBottom: 10, color: '#004274'}}>Period</Label>
	            <View style={styles.row}>
	            	<View 
	            		style={[GlobalStyle.picker, GlobalStyle.pickerBackgroundColor5]}
	           		>
			            <Picker 
		            		style={GlobalStyle.pickerText}
			            	selectedValue={this.state.period}
              			enabled={!this.state.isLoading}
			            	onValueChange={(period, index) => this.changePeriod(period)}
			            > 
			            	{this.getAllPeriods()}	
			            </Picker>
		        	</View>
		        </View>
              <Label style={{ marginBottom: 10, color: '#004274'}}>Project</Label>
            	<View 
	            	style={[GlobalStyle.picker, GlobalStyle.pickerBackgroundColor5]}
	           	>
		            <Picker 
		            	style={GlobalStyle.pickerText}
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

        var firstDate = new Date();
        firstDate.setMonth(firstDate.getMonth() - 1);
        var m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.state = {
        	user : DEFAULT_PROJECT,
        	users : [{ fullName : DEFAULT_PROJECT}],
        	projects : [{name: DEFAULT_PROJECT}],
        	months : m,
        	project : DEFAULT_PROJECT,
        	date : firstDate,
          period: 1,
        	message: 'error here',
	        useDebug: typeof(params) != "undefined" && typeof(params.useDebug) != "undefined" ? params.useDebug : false,
	        isLoading : true,
        };
        setParams({project:null, month: firstDate.getMonth() + 1, year:firstDate.getFullYear(), months: m, that : this});
        this.addListeners();
  }

  componentWillUnmount(){
  	this.removeListeners();
  }

  componentDidMount() {
    this.init();
  }

  
  backHandler = () => {
    this.updateTimesheets();
    //return false;
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
    BackAndroid.addEventListener('hardwareBackPress', this.backHandler);     
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
    BackAndroid.removeEventListener('hardwareBackPress', this.backHandler);
  } 

  changePeriod(p){
    var month = this.state.date.getMonth()+ p + 1;
    var year = this.state.date.getFullYear();
    if(month > 12){
      month -= 12;
      year++;
    }
    this.setState({isLoading: true, period: p});
    const {setParams} = this.props.navigation;
    setParams({month: month, year: year});
    this.fetchProjectList( year, month);
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


  fetchProjectList(year, month) {
  	//REMOVE THIS
  	if(year === null)
  		year = this.state.date.getFullYear();
  	if(month === null)
  		month = this.state.date.getMonth() + 1; // in JS month codes are starting from 0. In backend - from 1

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
      //alert(PROJECT_LIST_REQUEST+"?year="+year+"&month="+month+":"+result);
      result = await WLResourceRequestRN.asyncRequestWithURL(PROJECT_LIST_REQUEST+"?year="+year+"&month="+month, WLResourceRequestRN.GET);
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
    //alert(JSON.stringify(response));
    this.setState({ message: '', users : users, user : response.fullName});       
  }
}
