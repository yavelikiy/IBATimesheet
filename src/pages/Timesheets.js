import React, { Component } from 'react';
 
import {
  StyleSheet,
  TextInput,
  ScrollView,
  I18nManager,
  Text,
  Alert,
  TouchableHighlight,
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
  RefreshControl,
  Platform
} from 'react-native';


import Swiper from 'react-native-swiper';

import { DeckSwiper, Card, CardItem, Thumbnail, Left, Body, Icon, View, Container, Image, Button, List, ListItem, Right, Header, Content, Footer, Text as BaseText } from 'native-base';

//import Container from '../components/Container';
//import Button from '../components/Button';
import TimesheetButtonOthers from '../components/TimesheetButtonOthers';
import BlueActivityIndicator from '../components/BlueActivityIndicator';

import { NavigationActions } from 'react-navigation'

import WLClientRN from '../wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from '../wrappers/SecurityCheckChallengeHandlerRN'
import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'

import GlobalStyle from '../styles/GlobalStyle'

const _DEBUG = false;
//var TIMESHEET_LIST_REQUEST = "/adapters/timesheetAdapter/statuses";
const TIMESHEET_LIST_REQUEST = "/adapters/timesheetAdapter/timesheets/my";

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
			    onPress={() => navigate(
            'Timesheet',{
              timesheetTitle : this.props.timesheet.project.name, 
              timesheet: this.props.timesheet,            
              updateTimesheets: () => {
                this.props.navigation.state.params.Timesheets._onRefresh();
              }
            })}
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
				onPress={() => navigate(
          'Timesheet',{
            timesheetTitle : this.props.timesheet.project.name, 
            timesheet: this.props.timesheet,            
            updateTimesheets: () => {
              this._onRefresh();
            }
          })}
			/>
		);
	}
}

export default class Timesheets extends Component {
	constructor(props) {
      super(props);
      const { params } = this.props.navigation.state;
      this.props.navigation.setParams({Timesheets: this});
      var isloggedIn = false;
      const today = new Date();
      today.setMonth(today.getMonth() - 2);
	    this.state = {
	        dataSource: [],
          firstDate: today,
          currentIndex : 2,
          loaded: false,
          processCount: 0,
          message: '',
          refreshing: false,
          loggedIn: isloggedIn,
          useDebug: typeof(params) != "undefined" && typeof(params.useDebug) != "undefined" ? params.useDebug : false,
	    }

      if(!isloggedIn){
        this.registerChallengeHandler();
        if(Platform.OS == 'android')
          this.obtainAccessToken();
        else
          this.navigateToLogin();
      }
    }

    static navigationOptions = { 
        title: 'My Timesheets',
        headerStyle: GlobalStyle.globalBackgroundDark,
        headerTitleStyle: [GlobalStyle.actionBarHeader],
        headerRight: <View style={{padding:4}}><Button underlayColor="#ccc" transparent iconRight onPress={() => {SecurityCheckChallengeHandlerRN.logout();}}>
                        <BaseText style={{color: '#F2CA27'}}>Logout</BaseText>
                        <Icon name="log-out"  style={{color: '#F2CA27'}}/>
                    </Button></View>,
    }
      //  headerRight: <TouchableHighlight underlayColor="#ccc" style={GlobalStyle.barButton} onPress={() => {SecurityCheckChallengeHandlerRN.logout();}}>
      //                  <Text style={GlobalStyle.barButtonLabel}>Logout</Text>
      //              </TouchableHighlight>,


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

      const {navigate} = this.props.navigation;
      return (
      <View style={{flex: 1}}>
            { Platform.OS === 'android' && !this.state.refreshing  && 
              <View style={{alignItems:'center',backgroundColor:"#05668d",}}>
                  <Text style={GlobalStyle.notificationText}>Pull to update</Text>
              </View>
            }
            { Platform.OS === 'android' && this.state.refreshing  && 
              <View style={{alignItems:'center',backgroundColor:"#028090",}}>
                  <Text style={GlobalStyle.notificationText}>Updating</Text>
              </View>
            }
        <Swiper       style={GlobalStyle.globalBackground}
                      showsButtons
                      loop={false}
                      activeDotColor={'#f0c808'}
                      index={this.state.currentIndex}
                      onIndexChanged={(index) => { this.setState({currentIndex: index}); this._onRefresh(this.getCurrentYear(index), this.getCurrentMonth(index) ) } }
                    >
                {  this.getMonthTimesheetsContainerFull(0)} 
                {  this.getMonthTimesheetsContainerFull(1)} 
                {  this.getMonthTimesheetsContainerFull(2)} 
                {  this.getMonthTimesheetsContainerFull(3)}  
                {  this.getMonthTimesheetsContainerFull(4)}  
          
        </Swiper>
        {Platform.OS == 'android' &&
        <View style={{backgroundColor:'#00000000', height:82, position: 'absolute', bottom: 2, right: 2}}>
          <Right small>
            <Button rounded style={{backgroundColor:'#e15554', width: 80, height:80}} underlayColor="#fff"  onPress={() => this.pressCreate()}>
              <Icon name='create' style={{fontSize:20}}/>
            </Button>
          </Right>
          </View>
        }
        {Platform.OS == 'ios' &&
        <Button block style={{backgroundColor:'#e15554', margin:4}} underlayColor="#fff"  onPress={() => this.pressCreate()}>
          <BaseText style={{color: '#fff'}}>New timesheet</BaseText>
          <Icon name='create'/>
        </Button>
        }
      </View>
    );
  }

    render2() {

      const {navigate} = this.props.navigation;
      return (
      <Container style={GlobalStyle.globalBackground}>
        <Content refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._onRefresh()} />}>
          
            <View>
              <View style={{flex:1,backgroundColor:"#f0c808", flexDirection:'row'}}>
                <View>
                  <Button transparent dark light={!this.isBeforeMonthEnabled()} style={{padding:8}} onPress={() => this.pressMonthBefore()}>
                    <Icon name='arrow-back' style={{fontSize:24}}/>
                  </Button>
                </View>
                <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
                  <Text style={{color:'#004274'}}>{this.getCurrentMonth()+" / "+this.getCurrentYear()}</Text>
                </View>
                <View>  
                  <Button transparent dark light={!this.isAfterMonthEnabled()} style={{padding:8}} onPress={() => this.pressMonthAfter()} >
                    <Icon name='arrow-forward' style={{fontSize:24}}/>
                  </Button>
                </View>
              </View>
            </View> 
              {  this.getMonthTimesheetsContainer(2)}  

        </Content>
        {Platform.OS == 'android' &&
        <View style={{backgroundColor:'#00000000', height:82, position: 'absolute', bottom: 2, right: 2}}>
          <Right small>
            <Button rounded style={{backgroundColor:'#e15554', width: 80, height:80}} underlayColor="#fff"  onPress={() => this.pressCreate()}>
              <Icon name='create' style={{fontSize:20}}/>
            </Button>
          </Right>
        </View>
        }
        {Platform.OS == 'ios' &&
        <View style={{backgroundColor:'#00000000'}}>
            <Button style={{backgroundColor:'#e15554'}} underlayColor="#fff"  onPress={() => this.pressCreate()}>
              <Icon name='create' />
            </Button>
        </View>
        }
      </Container>
    );
  }




  getMonthTimesheetsContainer(index){
      const {navigate} = this.props.navigation;
      return (
        <View>
          { (this.state.dataSource != null && this.state.dataSource.length != 0) && !this.state.refreshing && this.state.currentIndex === index  && 
              <List 
                style={{flex:1}}
                dataArray={this.state.dataSource}
                renderRow={(item) =>
                  <ListItem style={{backgroundColor:'#F9F9F9',padding:0, marginLeft:0}} onPress={() => navigate(
                                                                    'Timesheet',{
                                                                      timesheetTitle : item.project.name, 
                                                                      timesheet: item,    
                                                                      useDebug: this.state.useDebug,
                                                                      date: new Date(this.getCurrentYear(), this.getCurrentMonth(), 1),        
                                                                      updateTimesheets: () => {
                                                                        this.props.navigation.state.params.Timesheets._onRefresh();
                                                                      }
                                                                    })}>
                      <Body><BaseText style={{fontFamily:'Helvetica Neue', color:"#555"}}>{item.project.name}</BaseText></Body>
                      {item.status !== 'draft' &&
                      <Right><BaseText note style={{fontFamily:'Helvetica Neue',color:'#e15554'}}>{item.status}</BaseText></Right>
                      }
                      {item.status === 'draft' &&
                      <Right><BaseText note style={{fontFamily:'Helvetica Neue'}}>{item.status}</BaseText></Right>
                      }
                  </ListItem>
                }>
              </List>
          }
          { (this.state.dataSource == null || this.state.dataSource.length == 0) && !this.state.refreshing  && 
              <View style={{alignItems:'center',flex:1}}>
                <Text>You don't have timesheets.</Text>
              </View>
         }
        </View>
        );
    }

  getMonthTimesheetsContainerFull(index){
      const {navigate} = this.props.navigation;
      var color;
      if(index == 2)
        color = {backgroundColor : '#777777'};
      return (
              <Content refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._onRefresh()} />}>
                <View style={{flex:1,backgroundColor:"#f0c808", flexDirection:'row'}}>
                  <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
                    <Text style={{color:'#004274'}}>{ "\n"+this.getMonthName(index)+" "+this.getCurrentYear()+"\n"}</Text>
                  </View>
                </View> 
                {  this.getMonthTimesheetsContainer(index)}  
              </Content>
        );
    }
	   

   _onRefresh(year, month) {  
     //var procLeft = this.state.processCount + 1;
     //this.setState({refreshing: true, processCount: procLeft,}); 
   	 //this.fetchData(year, month); 
   }

  componentWillMount(){
    this.addListeners();
  }

  componentWillUnmount(){
  	this.removeListeners();
  }

  componentDidMount() {
     var procLeft = this.state.processCount + 1;
    this.setState({refreshing: true, processCount: procLeft,}); 
    this.fetchData();
  }
  
  // get month starting with 0
  getCurrentMonth(i){
    var m = this.state.firstDate.getMonth();
    if(i === 'undefined' || i == null)
      i = this.state.currentIndex;
    return (m + i ) % 12;
  } 

  getCurrentYear(i){
    var m = this.state.firstDate.getMonth();
    var y = this.state.firstDate.getFullYear();
    if(i === 'undefined' || i == null)
      i = this.state.currentIndex;
    return (m + i > 11) ? (y + 1) : y;

  } 

  getMonthName(i){
    var m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    i = this.getCurrentMonth(i);
    return m[i];
  }
    
  fetchData(year, month) {
  	//REMOVE THIS
  	if(this.state.useDebug){
	  	var data = [{"id":"296AE7429510E51D432581150057A97F","employee":{"fullName":"Светлаков Сергей Вадимович","notesAddr":null},"yearMonth":{"year":2017,"month":"MAY","leapYear":false,"monthValue":5},"project":{"name":"MAD"},"tables":[{"code":"П","day":1},{"code":"8ч","day":2},{"code":"8ч","day":3},{"code":"8ч","day":4},{"code":"8ч","day":5},{"code":"8ч","day":6},{"code":"В","day":7},{"code":"В","day":8},{"code":"П","day":9},{"code":"8ч","day":10},{"code":"8ч","day":11},{"code":"8ч","day":12},{"code":"В","day":13},{"code":"В","day":14},{"code":"8ч","day":15},{"code":"8ч","day":16},{"code":"8ч","day":17},{"code":"8ч","day":18},{"code":"8ч","day":19},{"code":"В","day":20},{"code":"В","day":21},{"code":"8ч","day":22},{"code":"8ч","day":23},{"code":"8ч","day":24},{"code":"8ч","day":25},{"code":"8ч","day":26},{"code":"В","day":27},{"code":"В","day":28},{"code":"8ч","day":29},{"code":"8ч","day":30},{"code":"8ч","day":30}],"attributes":null,"status":"draft","comment":null,"report":null},{"id":"296AE7429510E51D432581150057A97F","employee":{"fullName":"Светлаков Сергей Вадимович","notesAddr":null},"yearMonth":{"year":2017,"month":"MAY","leapYear":false,"monthValue":5},"project":{"name":"Обучение 2Dept"},"tables":[{"code":"8ч","day":19},{"code":"8ч","day":15},{"code":"8ч","day":24},{"code":"8ч","day":26},{"code":"В","day":28},{"code":"8ч","day":6},{"code":"8ч","day":30},{"code":"8ч","day":12},{"code":"В","day":21},{"code":"8ч","day":22},{"code":"В","day":20},{"code":"8ч","day":3},{"code":"8ч","day":5},{"code":"8ч","day":25},{"code":"8ч","day":11},{"code":"В","day":13},{"code":"8ч","day":4},{"code":"8ч","day":2},{"code":"П","day":9},{"code":"8ч","day":10},{"code":"8ч","day":23},{"code":"В","day":27},{"code":"8ч","day":18},{"code":"П","day":1},{"code":"В","day":8},{"code":"8ч","day":29},{"code":"8ч","day":16},{"code":"В","day":14},{"code":"В","day":7},{"code":"8ч","day":17},{"code":"8ч","day":31}],"attributes":null,"status":"draft","comment":null,"report":null},{"id":"296AE7429510E51D432581150057A97F","employee":{"fullName":"Светлаков Сергей Вадимович","notesAddr":null},"yearMonth":{"year":2017,"month":"MAY","leapYear":false,"monthValue":5},"project":{"name":"Integration Services"},"tables":[{"code":"8ч","day":19},{"code":"8ч","day":15},{"code":"8ч","day":24},{"code":"8ч","day":26},{"code":"В","day":28},{"code":"8ч","day":6},{"code":"8ч","day":30},{"code":"8ч","day":31},{"code":"8ч","day":12},{"code":"В","day":21},{"code":"8ч","day":22},{"code":"В","day":20},{"code":"8ч","day":3},{"code":"8ч","day":5},{"code":"8ч","day":25},{"code":"8ч","day":11},{"code":"В","day":13},{"code":"8ч","day":4},{"code":"8ч","day":2},{"code":"П","day":9},{"code":"8ч","day":10},{"code":"8ч","day":23},{"code":"В","day":27},{"code":"8ч","day":18},{"code":"П","day":1},{"code":"В","day":8},{"code":"8ч","day":29},{"code":"8ч","day":16},{"code":"В","day":14},{"code":"В","day":7},{"code":"8ч","day":17}],"attributes":null,"status":"draft","comment":null,"report":null}];
	  	this.handleResponse(data);
  	}else{
    	this.getTimesheetListAsPromise(year, month);
    }
  }

  async getTimesheetListAsPromise(year, month) {
    var error = "";
    if(year === 'undefined' || year == null || month === 'undefined' || month == null){
      year = this.getCurrentYear();
      month = this.getCurrentMonth() + 1; 
    }else{
      //because it shoud be in [1..12]
      month++;
    }

    try {
      var result
      //alert("?year="+year+"&month="+month);
      result = await WLResourceRequestRN.asyncRequestWithURL(TIMESHEET_LIST_REQUEST+"?year="+year+"&month="+month, WLResourceRequestRN.GET);
      var emptyArray = '[]';
      if(result === null || result === '[null]')
        result = emptyArray;
      this.handleResponse(JSON.parse(result));
    } catch (e) {
      error = e;
      var procLeft = this.state.processCount - 1;
      var refresh = procLeft > 0;
      this.setState({ loaded: false, message: error ? "Failed to retrieve entry - " + error : "", refreshing: refresh, processCount: procLeft, dataSource : []});
      if(error.message.indexOf('JSON') > -1)
        alert(error.message+"\nRecived JSON:\n"+result);
      else
        alert("Failed to retrieve entry - " + error.message);
    }
  }

  handleResponse(response) {
    //if(_DEBUG)
    //   alert(JSON.stringify(response));
    //for(var i = 0, size = response.length; i < size ; i++){
    //   response[i].id = i;
    //}
    var procLeft = this.state.processCount - 1;
    var refresh = procLeft > 0;
    this.setState({ loaded: true, message: '', dataSource: response, refreshing: refresh, processCount: procLeft, });       
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
    return <TimesheetsGridItem timesheet={item} key={item.id} navigation={this.props.navigation} isMy={true}/>
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
      updateTimesheets: () => {
        this._onRefresh();
      }
    };
    this.props.navigation.navigate('CreateTimesheet', params);
  }

  pressMonthBefore(){
    if(!this.isBeforeMonthEnabled())
      return;
    var i = this.state.currentIndex - 1;
    this.setState({currentIndex : i});
    this._onRefresh(this.getCurrentYear(i), this.getCurrentMonth(i));
  }

  pressMonthAfter(){
    if(!this.isAfterMonthEnabled())
      return;
    var i = this.state.currentIndex + 1;
    this.setState({currentIndex : i});
    this._onRefresh(this.getCurrentYear(i), this.getCurrentMonth(i));
  }

  isAfterMonthEnabled(){
    return this.state.currentIndex < 4;
  }

  isBeforeMonthEnabled(){
    return this.state.currentIndex > 0;
  }

  addListeners() {
    var that = this;  
    var emitter;
    const {SecurityCheckChallengeHandlerEventEmitter} = NativeModules;
    emitter = new NativeEventEmitter(NativeModules.SecurityCheckChallengeHandlerEventEmitter);
    if( Platform.OS === 'android'){
      emitter = DeviceEventEmitter;
    }     
    this.challengeEventModuleSubscription  = emitter.addListener(
      'LOGIN_REQUIRED', function (challenge) {
        that.props.navigation.dispatch({type:'Navigation/RESET', actions:[{type:'Navigation/NAVIGATE', routeName:'Login'}], index:0});
      }
    );
    this.logoutEventModuleSubscription  = emitter.addListener(
      'LOGOUT_SUCCESS', function (challenge) {
      	//if(_DEBUG)
        //  alert("Logout Success");
        that.props.navigation.dispatch({type:'Navigation/RESET', actions:[{type:'Navigation/NAVIGATE', routeName:'Login'}], index:0});
      }
    );
    this.logoutFailEventModuleSubscription  = emitter.addListener(
      'LOGOUT_FAILURE', function (challenge) {
      	//if(_DEBUG)
        //  alert("Logout Success");
        that.props.navigation.dispatch({type:'Navigation/RESET', actions:[{type:'Navigation/NAVIGATE', routeName:'Login'}], index:0});
      }
    );
  }    


  removeListeners(){
    this.challengeEventModuleSubscription.remove();
    this.logoutEventModuleSubscription.remove();
    this.logoutFailEventModuleSubscription.remove();
  }    
}
const challengeEventModule = new NativeEventEmitter(NativeModules.SecurityCheckChallengeHandlerRN);

