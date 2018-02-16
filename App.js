/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View,
  TouchableHighlight
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Login from './src/pages/Login';
import Timesheets from './src/pages/Timesheets';
import Timesheet from './src/pages/Timesheet';
import TimesheetComment from './src/pages/TimesheetComment';
import TimesheetTimeValuePicker from './src/pages/TimesheetTimeValuePicker';
import CreateTimesheet from './src/pages/CreateTimesheet';


import WLClientRN from './src/wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from './src/wrappers/SecurityCheckChallengeHandlerRN'
import WLResourceRequestRN from './src/wrappers/WLResourceRequestRN'


const styles = StyleSheet.create({
    barButton: {
        backgroundColor: "#464866",
        margin: 4,
        padding: 6
    },
    barButtonLabel: {
        color: "#FFF",
        fontSize: 16,      
    }
});

const IBATimesheet = StackNavigator({
    Timesheets: { 
      screen: Timesheets,
    },
    Login: { 
      screen: Login, 
      
    },
    TimesheetTimeValuePicker: { 
      screen: TimesheetTimeValuePicker, 
      headerMode : 'screen',
      navigationOptions : { 
        title: "Time Type",
      }
    },
    Timesheet: { 
      screen: Timesheet
    },
    TimesheetComment: { screen: TimesheetComment
    },
    CreateTimesheet : {
      screen: CreateTimesheet,
    }
});


export default IBATimesheet;
AppRegistry.registerComponent('IBATimesheet', () => IBATimesheet);
