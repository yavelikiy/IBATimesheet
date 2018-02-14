import {StyleSheet} from 'react-native';

let GlobalStyle = StyleSheet.create({
  globalBackground: {
    backgroundColor: '#F7F7F7'
  },
  globalBackgroundDark: {
    backgroundColor: '#0066B3'
  },
  actionBarHeader:{ 
    color: '#FFF',
    fontFamily: 'Roboto', 
    fontWeight: 'normal'
  },
  barButton: {
    backgroundColor: "#CCB400",
    alignItems: 'center',
    borderRadius: 4,
    margin: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  barButtonLabel: {
      color: '#004274',
      fontSize: 16,      
  },
  notificationText: {
      color: '#fff1d0',  
  },
  textLabel: {
        fontSize: 20,
        fontFamily: 'Roboto',
        marginBottom: 10,
        color: '#004274'
    },
  textLabelDark: {
        fontSize: 20,
        fontFamily: 'Roboto',
        marginBottom: 10,
        color: '#fff'
  },
  timesheetItemText:{
    marginLeft:10, 
    fontSize:15, 
    color:"#555"
  },
  timesheetItem: {
    backgroundColor:'#F9F9F9',
    padding:0
  },
  timesheetList:{
    paddingRight:16
  },
  timesheetMonthNavView:{
    flex:1,
    backgroundColor:"#B3CADB", 
    flexDirection:'row'
  },
  timesheetMonthNavTextView: {
    alignItems:'center', 
    justifyContent:'center',
    flex:1
  },
  timesheetMonthNavIconView: {
    padding:8
  },
  timesheetMonthNavIcon: {
    fontSize:24
  },
  circleButtonView:{
    backgroundColor:'#00000000', 
    height:82, 
    position: 'absolute', 
    bottom: 2, 
    right: 2
  },
  circleButton: {
    backgroundColor:'#b30335', 
    width: 80, 
    height:80
  },
  circleButtonIcon: {
    fontSize: 20
  },
  textInput: {
      height: 50,
      fontSize: 16,
      backgroundColor: '#FFF',
      borderRadius: 4,
  },
  colorButtonText: {
      fontSize: 20,
      color: '#004274',
  },
  colorButton: {
      backgroundColor: '#CCB400',
      height: 80,
      borderRadius: 4,
  },
  lightSwitch: {
    alignSelf: 'flex-end',
    marginTop: 5, 
  },
  lightSwitchLabel: {
    alignSelf: 'flex-start',
    marginTop: 10, 
    color:"#fff1d0", 
  },
  activityModalOuter:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor:'rgba(255, 255, 255, 0.6)',
    padding: 20,
  },
  activityApprovalModalOuter:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor:'#0066B3',
    padding: 30,
  },
  picker:{
    backgroundColor: '#32688A',
    borderRadius: 4,
    marginBottom: 4,
  },
  pickerText:{
    color: '#555',
  },
  pickerBackgroundColor1:{
    backgroundColor: '#0E69Af',    
  },
  pickerBackgroundColor2:{
    backgroundColor: '#3072A4',    
  },
  pickerBackgroundColor3:{
    backgroundColor: '#587C97',    
  },
  pickerBackgroundColor4:{
    backgroundColor: '#7A858C',    
  },
  pickerBackgroundColor5:{
    backgroundColor: '#FFF',    
  },
  pickerColor1:{
    color: '#FFF',
  },
  pickerColor2:{
    color: '#FFF',
  },
  pickerColor3:{
    color: '#000',
  },
  pickerColor4:{
    color: '#000',
  },
});

export default GlobalStyle;