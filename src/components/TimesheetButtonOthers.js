import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Button from './Button';
 
const TimesheetButtonOthers = (props) => {
     
    function getChildren(){
        return (
            <View style={{flexDirection: 'column'}}>
                <Text style={styles.timesheetButtonLabelOwner}>{props.owner}</Text>
                <Text style={styles.timesheetButtonLabelProject}>{props.project}</Text>
            </View>
        );
    }
 
    return (
        <Button
            onPress={props.onPress} 
            disabled={props.disabled}
            style={styles.timesheetButton}
        >
            { getChildren() }
        </Button>
    );
}
 
const styles = StyleSheet.create({
    timesheetButton: {
        backgroundColor: '#29648A',
        flex: 1,
        height: 50,
        margin:4,
        borderRadius: 4,
    },
    timesheetButtonLabelOwner: {
        fontSize: 10,
        color: '#FFF',
        backgroundColor: '#464866',
        flex:1,
    },
    timesheetButtonLabelProject: {
        fontSize: 16,
        color: '#FFF',
    },
});
 
export default TimesheetButtonOthers;