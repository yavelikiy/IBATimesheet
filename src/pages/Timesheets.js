import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  NativeModules
} from 'react-native';

import Container from '../components/Container';
import Button from '../components/Button';

import GridView from 'react-native-grid-view';
//var WLResourceRequestRN = require('NativeModules').WLResourceRequestRN;

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
		    }
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
	    this.fetchData();
	  }

	  fetchData() {
	  	this.setState({
	           dataSource: [{"title":"Integration Services", "owner":"Anastasiya Khobnia"},{"title":"Park Keeping", "owner":"Anastasiya Khobnia"},{"title":"Rockwell Automation", "owner":"Anastasiya Khobnia"}],
	           loaded: true,
	         });
	    // fetch(REQUEST_URL)
	    //   .then((response) => response.json())
	    //   .then((responseData) => {
	    //     this.setState({
	    //       dataSource: responseData.movies,
	    //       loaded: true,
	    //     });
	    //   })
	    //   .done();
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

  	
    navTimesheet(){
		this.props.navigator.push({
			id: 'timesheet'
		});
	}
}

const styles = StyleSheet.create({
	timesheet: {
		height: 60,
		flex: 1,
		alignItems: 'center',
		flexDirection: 'column',
	},
	timesheetButton: {
	    backgroundColor: '#3B5699'
	},
	listView: {
	  paddingTop: 20,
	  backgroundColor: '#F5FCFF',
	},
});