import React, { Component } from 'react';
 
import {
  StyleSheet,
  BackAndroid,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Alert,
  NativeModules,
  Navigator,
  Modal,
  ListView,
} from 'react-native';
import {Icon, Button, View as BaseView, Label, Item, Input} from 'native-base';

import Container from '../components/Container';
import Calendar from '../components/Calendar';
//import Label from '../components/Label';
import LeftBarButton from '../components/LeftBarButton';
import RichTextEditor from '../components/RichTextEditor';
import RichTextToolbar from '../components/RichTextToolbar';
import BlueActivityIndicator from '../components/BlueActivityIndicator';
import WLResourceRequestRN from '../wrappers/WLResourceRequestRN'
import GridView from 'react-native-grid-view';
import GlobalStyle from '../styles/GlobalStyle'

import Swiper from 'react-native-swiper';

const CODE_LIST_REQUEST = "/adapters/timesheetAdapter/codes?timesheetId=";
const PUT_TIMESHEET_REQUEST = "/adapters/timesheetAdapter/timesheets/";
const APPROVE_TIMESHEET_REQUEST = "/adapters/timesheetAdapter/timesheets/?/request-approval";

var BUTTONS = [
  { text: "Save timesheet", icon: "checkmark", iconColor: "#2c8ef4" },
  { text: "Request approval", icon: "send", iconColor: "#f42ced" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];

const styles = StyleSheet.create({
  modalOuter:{
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor:'rgba(255, 255, 255, 0.6)',
    padding: 20,
  },
  modalInner:{
    flex:4,
    width: 320,
    borderRadius: 4,
    backgroundColor: '#F7F7F7',
  },
  text: {
    fontSize: 18,
    borderRadius: 4,
  },
  textModal: {
    fontSize: 18,
    textAlign: 'center',
  },
  textButton: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 20,
    marginLeft:5,
    marginRight:5,
    borderBottomWidth: 1,
    borderBottomColor: '#29648A'

  },
  textButtonModal: {
    height: 60,
    width: 80,
    backgroundColor: '#F7F7F7',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  underline:{
    flex: 1,
    height: 1,
    backgroundColor: '#29648A'
  },
  underlineModal:{
    width: 70,
    height: 1,
    backgroundColor: '#29648A'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 5
  },
  containerRich: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 5
  },
  richText: {
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});


export default class Timesheet extends Component {
	constructor(props) {
    super(props);
    // get date from timesheet props
    this.state = {
        message: '123',
      	today: new Date(),
        date: this.props.navigation.state.params.date,
      	timesheet: this.props.navigation.state.params.timesheet,
      	//isEditable: true,
        timeTypes: ["8ч", "7ч", "6ч", "5ч", "4ч", "П", "В", "ОТ"],
        currentTimeType : null,
        currentDay: null,
        modalVisible: false,
        isLoading: true,
        isPreRequestApproval: false,
        useGrid : true,
        alreadySent : this.props.navigation.state.params.timesheet.status !== 'draft',
    };   

    this.props.navigation.setParams(
      { 
        saveTimesheet : () => this.saveTimesheet(),
        sendPopup : () => {this.setState({isPreRequestApproval:true})},
        requestApproval : () => this.requestApproval(),
        getHTML : () => this.getHTML(),
        alreadySent : this.props.navigation.state.params.timesheet.status !== 'draft',
    });

    //this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }



  static navigationOptions = ({ navigation }) => ({ 
        title: `${navigation.state.params.timesheetTitle}`,
        headerStyle: GlobalStyle.globalBackgroundDark,
        headerTitleStyle: [GlobalStyle.actionBarHeader,{marginLeft:0}],
          headerLeft: <LeftBarButton onPress={() => {navigation.state.params.updateTimesheets(); navigation.goBack()} } />,
          headerRight: 
              <View>
                {navigation.state.params.alreadySent &&
                    <Text style={{marginRight: 10, color:'#F2CA27'}}>{navigation.state.params.timesheet.status}</Text>
                }
                {!navigation.state.params.alreadySent &&
                  <BaseView style={{ flexDirection : 'row'}}>
                      <Button underlayColor="#ccc" transparent onPress={() => navigation.state.params.saveTimesheet()}>
                        <Icon name="checkmark" style={{color:'#FFF'}}/>
                      </Button>
                      <Button underlayColor="#ccc" transparent onPress={() => navigation.state.params.sendPopup()}>
                        <Icon name="send" style={{color:'#F2CA27'}} />
                      </Button>
                  </BaseView>
                }
            </View>
      });

  saveTimesheet(){
    this.setState({isLoading: true});  
    var t = this.props.navigation.state.params.timesheet;
    var new_t = {};
    new_t.tables = t.tables;
    new_t.comment = t.comment;
    new_t.richComment = t.richComment;
    this.putTimesheetAsPromise( new_t);
  }

  requestApproval(){
    this.setState({isLoading: true, isPreRequestApproval: false});  
    var t = this.props.navigation.state.params.timesheet;
    var new_t = {};
    new_t.tables = t.tables;
    new_t.comment = t.comment;
    new_t.richComment = t.richComment;
      // Создаётся объект promise
    let promiseSave = new Promise((resolve, reject) => {
          var result
          result = WLResourceRequestRN.asyncRequestWithURLBody(PUT_TIMESHEET_REQUEST+this.state.timesheet.id, WLResourceRequestRN.PUT, JSON.stringify(new_t));
          resolve(result);
    });

    let promiseRequestApproval = new Promise((resolve, reject) => {
          var result
          //alert(APPROVE_TIMESHEET_REQUEST.replace('?', this.state.timesheet.id ));
          result = WLResourceRequestRN.asyncRequestWithURLBody(APPROVE_TIMESHEET_REQUEST.replace('?', this.state.timesheet.id ), WLResourceRequestRN.POST, '{}');
          resolve(result);
    });

    // promise.then навешивает обработчики на успешный результат или ошибку
    promiseSave
      .then( response => {
          return promiseRequestApproval;
      })
      .then( response => {
          this.setState({isLoading : false});
          var ts = this.props.navigation.params.timesheet;
          ts.status = 'approval';
          this.props.navigation.setParams({alreadySent: true});
          alert('Approval has been requested.')
      })
      .catch(error => {
        this.setState({isLoading : false});
        alert(error); // Error: Not Found
      });
  }
   
  handleDateSelect(date, timeType) {
  	this.setState({modalVisible:true, currentDay: date});
  }

  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', this.backHandler);   
    this.getCodeListAsPromise();
  }

  componentWillUnmount(){
    BackAndroid.removeEventListener('hardwareBackPress', this.backHandler);
  }

         
  render() {
    const {navigate} = this.props.navigation;
    var tollbarActions = ['bold','italic','unorderedList'];
		return(
          <Swiper 

            loop={false}
            activeDotColor={'#f0c808'}
            style={[styles.container, GlobalStyle.globalBackground]}>     
            <View> 
              <Calendar
                date={this.state.date}
                today={this.state.today}
                timesheet={this.props.navigation.state.params.timesheet}
                onDateSelect={(date) => this.handleDateSelect(date)} />
               <Modal 
                animationType={"fade"} 
                transparent={true} 
                visible={this.state.modalVisible} 
                onRequestClose={() => {this.setState({modalVisible: false});}} 
              >
                <TouchableOpacity 
                  style={styles.modalOuter} 
                  onPress={() => this.setState({modalVisible: false})}
                  activeOpacity={0}
                  focusedOpacity={0}
                >
                {!this.state.useGrid &&
                  <ScrollView style={styles.modalInner}>
                  {this.getAllTypes()}
                  </ScrollView>
                }
                {this.state.useGrid &&
                  <GridView
                    items={this.state.timeTypes}
                    enableEmptySections={true}
                    itemsPerRow={4}
                    renderItem={(item) => <TouchableHighlight 
                                            underlayColor="#AAA"
                                            onPress={ this.changeTimeType.bind(this, item)}
                                            style={styles.textButtonModal}
                                          >
                                            <View>
                                              <Text style={styles.textModal}>
                                                {item}
                                              </Text>
                                              <View style={{flexDirection: 'row'}}>
                                                <View style={styles.underlineModal}></View>
                                              </View>
                                            </View>
                                          </TouchableHighlight>
                    }
                    style={styles.modalInner}
                  />
                }
                </TouchableOpacity>
              </Modal>
              <Modal 
                animationType={"fade"} 
                transparent={true} 
                visible={this.state.isLoading} 
                onRequestClose={() => {this.setState({isLoading:false})}} 
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
              <Modal 
                animationType={"fade"} 
                transparent={true} 
                visible={this.state.isPreRequestApproval} 
                onRequestClose={() => {}} 
              >
                <TouchableOpacity 
                  style={GlobalStyle.activityApprovalModalOuter} 
                  onPress={() => this.setState({isPreRequestApproval: false})}
                  activeOpacity={0}
                  focusedOpacity={0}
                >
                <View style={{alignItems: 'center', padding: 10, flex:2}}>
                  <View >
                    <Label style={{color: '#FFF'}}>Request an approval?</Label>
                  </View>
                  <View style={{flexDirection:'row', marginTop: 20}}>
                    <Button underlayColor="#ccc" large transparent style={{padding: 10, marginRight:2, backgroundColor:'#f0c808', flex:1}} onPress={() => this.requestApproval()}>
                      <Text style={{marginRight: 10, fontSize: 20, color: '#004274'}}>Send</Text>
                      <Icon name="send" style={{color:'#e15554'}} />
                    </Button>
                    <Button underlayColor="#ccc" large transparent style={{padding: 10, backgroundColor:'#f0c808', flex:1}} onPress={() => this.setState({isPreRequestApproval: false})}>
                      <Text style={{marginRight: 10, fontSize: 20, color: '#004274'}}>Cancel</Text>
                      <Icon name="close" style={{color:'#555'}} />
                    </Button>
                  </View>
                </View>
                </TouchableOpacity>
              </Modal>
            </View>
            <View style={styles.container}>
                <RichTextEditor
                  ref={(r)=>this.richtext = r}
                  style={styles.richText}
                  initialContentHTML={this.props.navigation.state.params.timesheet.comment}
                  //hiddenTitle={true}
                  initialTitleHTML="Comment"
                  isContentEditable={!this.state.alreadySent}
                  isTitleEditable={false}
                  editorInitializedCallback={() => this.onEditorInitialized()}
                />
                { !this.state.alreadySent && 
                  <RichTextToolbar
                    getEditor={() => this.richtext}
                    actions ={tollbarActions}
                  />
                }
            </View>
          </Swiper>

         
			);
  }

  render2() {
    const {navigate} = this.props.navigation;
    return(
        <View style={[styles.container, GlobalStyle.globalBackground]}>   
          <Swiper>     
            <Calendar
              date={this.state.date}
              today={this.state.today}
              timesheet={this.props.navigation.state.params.timesheet}
              onDateSelect={(date) => this.handleDateSelect(date)} />

            <Label style={{marginTop: 10, color: '#004274', padding: 5}}>Comment</Label>
            <TouchableHighlight 
                underlayColor="#EEE"
                onPress={() => navigate(
                  'TimesheetComment',
                  {
                    comment: this.state.timesheet.comment, 
                    isEditable: this.state.isEditable, 
                    updateTimesheetComment: (newTimesheetComment) => 
                      {
                        var newTimesheet = this.props.navigation.state.params.timesheet;
                        newTimesheet.comment = newTimesheetComment;
                        this.setState({timesheet: newTimesheet});
                        this.props.navigation.setParams({timesheet: newTimesheet});
                      }
                  }
                )} 
              style={styles.textButton}
            >
              <Text
                style={styles.text} 
                ellipsizeMode={"tail"}
                numberOfLines={1}
              >
                  {this.getPureComment()}
              </Text>
            </TouchableHighlight>
          </Swiper>

          <Modal 
            animationType={"fade"} 
            transparent={true} 
            visible={this.state.modalVisible} 
            onRequestClose={() => {this.setState({modalVisible: false});}} 
          >
            <TouchableOpacity 
              style={styles.modalOuter} 
              onPress={() => this.setState({modalVisible: false})}
              activeOpacity={0}
              focusedOpacity={0}
            >
            {!this.state.useGrid &&
              <ScrollView style={styles.modalInner}>
              {this.getAllTypes()}
              </ScrollView>
            }
            {this.state.useGrid &&
              <GridView
                items={this.state.timeTypes}
                enableEmptySections={true}
                itemsPerRow={4}
                renderItem={(item) => <TouchableHighlight 
                                        underlayColor="#AAA"
                                        onPress={ this.changeTimeType.bind(this, item)}
                                        style={styles.textButtonModal}
                                      >
                                        <View>
                                          <Text style={styles.textModal}>
                                            {item}
                                          </Text>
                                          <View style={{flexDirection: 'row'}}>
                                            <View style={styles.underlineModal}></View>
                                          </View>
                                        </View>
                                      </TouchableHighlight>
                }
                style={styles.modalInner}
              />
            }
            </TouchableOpacity>
          </Modal>
          <Modal 
            animationType={"fade"} 
            transparent={true} 
            visible={this.state.isLoading} 
            onRequestClose={() => {this.setState({isLoading:false})}} 
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
          <Modal 
            animationType={"fade"} 
            transparent={true} 
            visible={this.state.isPreRequestApproval} 
            onRequestClose={() => {}} 
          >
            <TouchableOpacity 
              style={GlobalStyle.activityApprovalModalOuter} 
              onPress={() => this.setState({isPreRequestApproval: false})}
              activeOpacity={0}
              focusedOpacity={0}
            >
            <View style={{alignItems: 'center', padding: 10, flex:2}}>
              <View >
                <Label style={{color: '#FFF'}}>Request an approval?</Label>
              </View>
              <View style={{flexDirection:'row', marginTop: 20}}>
                <Button underlayColor="#ccc" large transparent style={{padding: 10, marginRight:2, backgroundColor:'#f0c808', flex:1}} onPress={() => this.requestApproval()}>
                  <Text style={{marginRight: 10, fontSize: 20, color: '#004274'}}>Send</Text>
                  <Icon name="send" style={{color:'#e15554'}} />
                </Button>
                <Button underlayColor="#ccc" large transparent style={{padding: 10, backgroundColor:'#f0c808', flex:1}} onPress={() => this.setState({isPreRequestApproval: false})}>
                  <Text style={{marginRight: 10, fontSize: 20, color: '#004274'}}>Cancel</Text>
                  <Icon name="close" style={{color:'#555'}} />
                </Button>
              </View>
            </View>
            </TouchableOpacity>
          </Modal>
        </View>
      );
  }

   getAllTypes(){
      var result = [];
      for(var i=0; i<this.state.timeTypes.length; i++){
        result.push( 
           <TouchableHighlight 
            key={i}
            underlayColor="#AAA"
            onPress={ this.changeTimeType.bind(this, this.state.timeTypes[i])}
            style={styles.textButtonModal}
          >
            <View>
              <Text style={styles.textModal}>
                {this.state.timeTypes[i]}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.underlineModal}></View>
              </View>
            </View>
          </TouchableHighlight>) ;
      }
      return result;
    }

  renderTimeType(timeType){
    return  <TouchableHighlight 
            underlayColor="#AAA"
            onPress={ this.changeTimeType.bind(this, timeType)}
            style={styles.textButtonModal}
          >
            <View>
              <Text style={styles.textModal}>
                1
              </Text>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.underlineModal}></View>
              </View>
            </View>
          </TouchableHighlight> ;
    }

   changeTimeType(t){
    var tsheet = this.state.timesheet;
    tsheet.tables[this.state.currentDay -1].code = t;
    this.setState({currentTimeType: null, currentDay : null, timesheet : tsheet, modalVisible:false}); 
    //const {setParams} = this.props.navigation;
    //setParams({: u});
  }

  getPureComment(){
  	return this.props.navigation.state.params.timesheet.comment.replace(/<(?:.|\n)*?>/gm, '');
  }

  onEditorInitialized() {
    this.setFocusHandlers();
  }

  async getHTML() {
    const contentHtml = await this.richtext.getContentHtml();
    return contentHtml;
  }

  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      
    });
  }

  async getCodeListAsPromise() {
    var error = "";
    //this.setState({ loaded: true, message: '' });
    try {
      var result
      result = await WLResourceRequestRN.asyncRequestWithURL(CODE_LIST_REQUEST+this.state.timesheet.id, WLResourceRequestRN.GET);
      this.handleResponse(JSON.parse(result));
      //if(_DEBUG)
      //  alert(result);
    } catch (e) {
      error = e;
      this.setState({ isLoading: false});
      alert("Failed to retrieve entry - " + error.message);
    }
  }

  async putTimesheetAsPromise(timesheet) {
    var error = "";
    //this.setState({ loaded: true, message: '' });
    try {
      var result;
      //alert(PUT_TIMESHEET_REQUEST+this.state.timesheet.id);
      //alert(timesheet);
      const contentHtml = await this.richtext.getContentHtml();
      timesheet.comment = contentHtml;
      //alert(JSON.stringify(timesheet));
      result = await WLResourceRequestRN.asyncRequestWithURLBody(PUT_TIMESHEET_REQUEST+this.state.timesheet.id, WLResourceRequestRN.PUT, JSON.stringify(timesheet));
      this.setState({message: '', isLoading: false});   
      alert('Changes have been saved.')
      //this.handleResponse(JSON.parse(result));
      //if(_DEBUG)
      //  alert(result);
    } catch (e) {
      error = e;
      this.setState({ isLoading: false});
      alert("Failed to retrieve entry - " + error.message);
    }
  }

  handleResponse(response) {
    //if(_DEBUG)
    //   alert(JSON.stringify(response));

    for(var i = 0, size = response.length; i < size ; i++){
       response[i].key = i;
    }
    this.setState({message: '', timeTypes: response, isLoading: false});       
  }


  backHandler = () => {
    this.props.navigation.state.params.updateTimesheets();
    //return false;
  }

}
