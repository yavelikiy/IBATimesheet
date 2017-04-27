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


import WLClientRN from './src/wrappers/WLClientRN'
import SecurityCheckChallengeHandlerRN from './src/wrappers/SecurityCheckChallengeHandlerRN'
import WLResourceRequestRN from './src/wrappers/WLResourceRequestRN'


const IBATimesheet = StackNavigator({
    Timesheets: { 
      screen: Timesheets,
      navigationOptions : { 
        title: 'My Timesheets',
        headerRight: <Button title="Info"/>,
      }
    },
    Login: { 
      screen: Login, 
      headerMode : 'screen',
      navigationOptions : { headerVisible: false }
    },
    Timesheet: { screen: Timesheet, 
      navigationOptions : ({ navigation }) => ({ title: `${navigation.state.params.timesheetTitle}`})
    }
});

AppRegistry.registerComponent('IBATimesheet', () => IBATimesheet);
