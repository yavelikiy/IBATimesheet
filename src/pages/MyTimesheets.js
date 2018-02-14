import React, { Component } from 'react';

import {StyleSheet, ScrollView} from 'react-native';

import Container from '../components/Container';
import TimesheetLabel from '../components/Container';
	
export default class MyTimesheets extends Component {
  static  navigationOptions = {
    title: 'My current timesheets'
  }
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
     <ScrollView style={styles.scroll}>
       <Container>
       {
         this.props.timesheets && 
         this.props.timesheets.map((value)=> { return (<TimesheetLabel props={value}></TimesheetLabel>) })
       }
      </Container>
      </ScrollView>
    );
  }	   
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column'
  }
});