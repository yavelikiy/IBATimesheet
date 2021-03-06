import React, { Component } from "react";

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
} from "react-native";


export default class Calendar extends Component {

    static get defaultProps() {
        return {
            date: new Date(),
            today: new Date(),
            //onDateSelect: null,
            weekFirstDay: 0,
            dayNames: [
                "Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun", 
            ],
            monthNames: [
                "January", "February", "March",
                "April",   "May",      "June",
                "July",    "August",   "September",
                "October", "November", "December"
            ],
            timesheet: null,
            workdayDefault: "8",
            weekendDefault: "В",
            holydayDefault: "П",
        };
    }

    static get propTypes() {
        return {
            date: React.PropTypes.object,
            today: React.PropTypes.object,
            dayNames: React.PropTypes.array,
            monthNames: React.PropTypes.array,
            weekFirstDay: React.PropTypes.number,
            timesheet: React.PropTypes.object,
            workdayDefault: React.PropTypes.string,
            weekendDefault: React.PropTypes.string,
            holydayDefault: React.PropTypes.string,
        };
    }

    handleDayPress(dateNumber, timeType) {
        if (this.props.onDateSelect !== null) {
            this.props.onDateSelect(dateNumber,timeType);
        }
    }

    renderBar() {
        const month = this.props.date.getMonth();
        const year = this.props.date.getFullYear();
        const monthName = this.props.monthNames[month];

        return (
            <View style={styles.bar}>
                <Text style={styles.barText}>
                    {monthName + " "+year}
                </Text>
            </View>
        );
    }

    renderDayNames() {
        const elements = [];

        for (let i = 0; i < 7; i++) {
            const dayIndex = (this.props.weekFirstDay + i) % 7;
            elements.push(
                <View key={i} style={styles.dayInner}>
                    <Text style={[styles.shadedText, styles.dayText]}>
                        {this.props.dayNames[dayIndex]}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.week}>
                {elements}
            </View>
        );
    }

    renderCalendarDay(index, dateNumber) {
        const weekDay = (index + this.props.weekFirstDay) % 7;
        const isWeekend = weekDay === 5 || weekDay  === 6;

        const today = new Date();
        const isToday = this.props.today.getDate() === dateNumber &&
                        this.props.today.getMonth() === today.getMonth() &&
                        this.props.today.getFullYear() === today.getFullYear();

        const timeType = this.props.timesheet == null || typeof this.props.timesheet.tables[dateNumber-1] === "undefined"? 
                        isWeekend ? 
                            this.props.weekendDefault 
                            : this.props.workdayDefault 
                        : this.props.timesheet.tables[dateNumber-1].code;

        return (
            <View key={dateNumber} style={styles.dayOuter}>
                <TouchableOpacity onPress={() => this.handleDayPress(dateNumber, timeType)}>
                    <View style={[styles.dayInner, isToday ? styles.todayDayInner : {}]}>
                        <Text style={[styles.dayText, isWeekend ? styles.dayWeekendText : {}]}>
                            {String(dateNumber)}
                        </Text>
                        <Text style={[styles.dayValueText, isWeekend ? styles.dayWeekendText : {}]}>
                            {timeType}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderCalendarDayEmpty(dateNumber) {
        return (
            <View key={dateNumber} style={styles.dayOuter}>
                <View style={styles.dayInner}>
                    <Text style={styles.dayText}> </Text>
                </View>
            </View>
        );
    }

    renderCalendarWeek(startDateNumber, weekOffset, daysLeft) {
        const days = [];
        const weekKey = startDateNumber;

        for (let i = 0; i < weekOffset; i++) {
            days.push(this.renderCalendarDayEmpty(- weekOffset + i));
        }

        let i = weekOffset;
        for (; i < 7 && daysLeft > 0; i++) {
            days.push(this.renderCalendarDay(i, startDateNumber++));
            daysLeft--;
        }

        for (; i < 7; i++) {
            days.push(this.renderCalendarDayEmpty(startDateNumber++));
        }

        return (
            <View key={weekKey} style={styles.week}>
                {days}
            </View>
        );
    }

    render() {
        const date = this.props.date;
        let monthFirstDayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        monthFirstDayOfWeek = (monthFirstDayOfWeek - this.props.weekFirstDay + 6) % 7;
        let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        let startDateNumber = 1;

        const weeks = [];

        if (monthFirstDayOfWeek !== 0) {
            weeks.push(this.renderCalendarWeek(startDateNumber, monthFirstDayOfWeek, daysInMonth));
            daysInMonth     -= (7 - monthFirstDayOfWeek) % 7;
            startDateNumber += (7 - monthFirstDayOfWeek) % 7;
        }

        while (daysInMonth  > 0) {
            weeks.push(this.renderCalendarWeek(startDateNumber, 0, daysInMonth));
            startDateNumber += 7;
            daysInMonth     -= 7;
        }

        return (
            <View style={[styles.calendar]}>
                {this.renderBar()}
                {this.renderDayNames()}
                {weeks}
            </View>
        );
    }
}

const timeTypes = ["8", "7", "П", "В", "ОТ"];

const styles = StyleSheet.create({
    calendar: {
        borderBottomWidth: 3,
        borderStyle: "solid",
        borderBottomColor: "#BDBDBD",
        backgroundColor: "white",
        borderRadius: 4,
    },

    week: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    dayOuter: {
        flex: 1,
    },

    dayInner: {
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 6,
        backgroundColor: "white",
        borderBottomWidth: 3,
        borderStyle: "solid",
        borderColor: "white",
    },

    todayDayInner: {
        borderColor: "#BF360C"
    },
    holidayText: {
        borderColor: "#BF360C"
    },

    dayText: {
        textAlign: "center",
    },
    dayValueText: {
        textAlign: "right",
        color: "black",
        fontSize: 12,
    },

    dayWeekendText: {
        color: "#BF360C",
    },

    bar: {
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },

    barText: {
        color: "#424242",
    },

    schadedText: {
        color: "#AAAAAA",
    }
});