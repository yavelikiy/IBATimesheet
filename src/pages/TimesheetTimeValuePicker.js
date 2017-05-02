import React, { Component } from 'react';
 
import {
  StyleSheet,
  Picker,
  Text,
  Alert,
  Navigator
} from 'react-native';

const Item = Picker.Item;

export default class TimesheetTimeValuePicker extends Component {
	constructor(props) {
	        super(props);
	        const { params } = this.props.navigation.state;
	        this.state = {
	            selected : params.selected,
	            timeTypes: params.timeTypes,
	        };   
	    }

    render() {
    	alert(`selected: ${this.props.navigation.state.selected}`);
    	var items = [];
    	for (var i=0; i < this.state.timeTypes.length; i++) {
		    items.push(<Item label={timeTypes[i]} value={timeTypes[i]} />);
		}

        return (
            <Picker
	            style={styles.picker}
	            selectedValue={this.state.selected}
	            onValueChange={this.onValueChange.bind(this, 'color')}
	            mode="dialog">
		            {items}
          </Picker>
        );
    }
}

const styles = StyleSheet.create({
});