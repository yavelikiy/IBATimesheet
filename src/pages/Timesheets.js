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
			<Container>
			    <Button 
			        label={this.props.timesheet.title}
			        styles={{button: styles.alignRight, label: styles.label}} 
			        onPress={() => navigate('Timesheet', { timesheetTitle: {this.props.timesheet.title} })} />
			</Container>
		);
	}
}

export default class Timesheets extends Component {
	static navigationOptions = {
		title: 'My Timesheets',
	};

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
			        renderItem={this.renderItem}
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
	        <Text>
	          Loading movies...
	        </Text>
	      </View>
	    );
	  }

	renderItem(item) {
    	return <TimesheetsGridItem timesheet={item} />
  	}
}

const styles = StyleSheet.create({
	 scroll: {
	    backgroundColor: '#E1D7D8',
	    padding: 30,
	    flexDirection: 'column'
	},
	label: {
	    color: '#0d8898',
	    fontSize: 20
	},
	alignRight: {
	    alignSelf: 'flex-end'
	},
	textInput: {
	    height: 80,
	    fontSize: 30,
	    backgroundColor: '#FFF'
	},
	buttonWhiteText: {
	    fontSize: 20,
	    color: '#FFF',
	},
	primaryButton: {
	    backgroundColor: '#3B5699'
	},
	footer: {
	   marginTop: 100
	},
	listView: {
	  paddingTop: 20,
	  backgroundColor: '#F5FCFF',
	},
});