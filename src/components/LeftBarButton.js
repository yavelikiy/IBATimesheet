import React, { Component } from 'react';
 
import {
  StyleSheet,
  I18nManager,
  TouchableHighlight,
  Image,
  Platform,
} from 'react-native';

export default class LeftBarButton extends Component{

  constructor(props) {
    super(props);
  }

  render(){
    return <TouchableHighlight 
      onPress={this.props.onPress} 
      style={{ width: 60, height:60, borderRadius: 30, alignItems:"center", justifyContent:"center"}}
      underlayColor='rgba(0,0,0,0.1)'
    >
      <Image source={require('../assets/img/back-icon-light.png')} style={styles.icon}/>
    </TouchableHighlight>
  }
}

const styles = {
    icon: Platform.OS === 'ios'
      ? {
          height: 21,
          width: 13,
          marginLeft: 10,
          marginRight: 22,
          marginVertical: 12,
          resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        }
      : {
          height: 24,
          width: 24,
          margin: 16,
          resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }
}