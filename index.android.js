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
/*export default class IBATimesheet extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

const onLoginButtonPress = () => {
  Alert.alert('Button has been pressed!');
};



 export default class IBATimesheet extends Component {
   constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  render() {
    return (
      <View style={styles.container}>
       <LoginEmailTextInput        />
       <LoginPasswordTextInput     />
        <Button
            onPress={onLoginButtonPress}
            title="Ok!"
            color="#841584"
            accessibilityLabel="Ok, Great!"
          />
      </View>
    );
  }
}

class LoginPasswordTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <TextInput
          style={styles.pass_input}
          secureTextEntry='true'
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
    );
  }
}

class LoginEmailTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <TextInput
          style={styles.email_input}
          placeholder="email@gomel.iba.by"
          keyboardType="email-address"
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  email_input: {
    height:40,
    width:300,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  pass_input: {
    height:40,
    width:300,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'fle-start',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});*/

const IBATimesheet = StackNavigator({
  Login: { 
    screen: Login, 
    headerMode : 'screen',
    navigationOptions : { headerVisible: false }
  },
  Timesheets: { 
    screen: Timesheets,
    navigationOptions : { title: 'My Timesheets' }
  },
  Timesheet: { screen: Timesheet, 
    navigationOptions : ({ navigation }) => ({ title: "${navigation.state.params.timesheetTitle"})
  },
});

// class IBATimesheet extends React.Component{
//   var _navigator;

//   render() {
//     return (
//       <Navigator
//         initialRoute={{id: 'first'}}
//         renderScene={this.navigatorRenderScene}/>
//     );
//   }

//   navigatorRenderScene(route, navigator) {
//     _navigator = navigator;
//     switch (route.id) {
//       case 'login':
//         return (<Login navigator={navigator} title="Login"/>);
//       case 'timesheets':
//         return (<Second navigator={navigator} title="Timesheets" />);
//       case 'timesheet':
//         return (<Second navigator={navigator} title="Timesheet" />);
//     }
//   }
// }


AppRegistry.registerComponent('IBATimesheet', () => IBATimesheet);
