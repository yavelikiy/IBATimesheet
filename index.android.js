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
  Button,
  TextInput,
  Alert,
  View,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Login from './src/pages/Login';
import Timesheets from './src/pages/Timesheets';
import Timesheet from './src/pages/Timesheet';
import TimesheetTimeValuePicker from './src/pages/TimesheetTimeValuePicker';


import WLClientRN from './src/wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from './src/wrappers/SecurityCheckChallengeHandlerRN'
import WLResourceRequestRN from './src/wrappers/WLResourceRequestRN'


const IBATimesheet = StackNavigator({
    Timesheets: { 
      screen: Timesheets,
      navigationOptions : { 
        title: 'My Timesheets',
        headerRight: <Button title="Logout" style="barButton"/>,
      }
    },
    Login: { 
      screen: Login, 
      navigationOptions : { headerVisible: false }
    },
    TimesheetTimeValuePicker: { 
      screen: TimesheetTimeValuePicker, 
      headerMode : 'screen',
      navigationOptions : { 
        title: "Time Type",
        headerRight: <Button title="Save" style="barButton"/>
      }
    },
    Timesheet: { screen: Timesheet, 
      navigationOptions : ({ navigation }) => ({ 
          title: `${navigation.state.params.timesheetTitle}`,
          headerRight: <Button title="Options" style="barButton"/>
      })
    }
});

const styles = StyleSheet.create({
    barButton: {
        backgroundColor: "white",
        marginRight: 10,
    }
});

AppRegistry.registerComponent('IBATimesheet', () => IBATimesheet);
