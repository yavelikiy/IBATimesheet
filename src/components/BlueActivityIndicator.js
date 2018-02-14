'use strict'; 
import React, { Component } from 'react'; 
import { 
	ActivityIndicator, 
	StyleSheet, 
	View 
} from 'react-native'; 

export default  class BlueActivityIndicator extends Component { 

	/**
   * Optional Flowtype state and timer types
   */ 
   constructor(props) { 
   	super(props); 
   	this.state = { animating: true, }; 
   } 

   stop(){
   	this.setState({animating: false});
   } 

   start(){
   	this.setState({animating: true});
   } 

   render() { 
   	return ( 
   		<ActivityIndicator 
   			animating={this.props.animating} 
   			color="#0066B3"
   			style={styles.centering}/> 
   	); 
   } 
}

const styles = StyleSheet.create({ 
	centering: { 
		alignItems: 'center', 
		justifyContent: 'center', 
		padding: 8, 
	}, 
	gray: { 
		backgroundColor: '#cccccc', 
	}, 
	horizontal: { 
		flexDirection: 'row', 
		justifyContent: 'space-around', 
		padding: 8, 
	}, 
});