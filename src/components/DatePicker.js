import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  Picker,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import Style from '../styles/DatePickerStyle';
import Moment from 'moment';

const FORMATS = {
  'date': 'YYYY-MM-DD',
  'datetime': 'YYYY-MM-DD HH:mm',
  'time': 'HH:mm'
};

const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'];

class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.getDate(),
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      allowPointerEvents: true
    };

    this.datePicked = this.datePicked.bind(this);
    this.onPressDate = this.onPressDate.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    /*this.onPressMask = this.onPressMask.bind(this);
    this.onDatePicked = this.onDatePicked.bind(this);
    this.onTimePicked = this.onTimePicked.bind(this);
    this.onDatetimePicked = this.onDatetimePicked.bind(this);
    this.onDatetimeTimePicked = this.onDatetimeTimePicked.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);*/
  }

  componentWillMount() {
    // ignore the warning of Failed propType for date of DatePickerIOS, will remove after being fixed by official
    console.ignoredYellowBox = [
      'Warning: Failed propType'
      // Other warnings you don't want like 'jsSchedulingOverhead',
    ];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      this.setState({date: this.getDate(nextProps.date)});
    }
  }

  setModalVisible(visible) {
    const {height, duration} = this.props;

    // slide animation
    if (visible) {
      this.setState({modalVisible: visible});
      return Animated.timing(
        this.state.animatedHeight,
        {
          toValue: height,
          duration: duration
        }
      ).start();
    } else {
      return Animated.timing(
        this.state.animatedHeight,
        {
          toValue: 0,
          duration: duration
        }
      ).start(() => {
        this.setState({modalVisible: visible});
      });
    }
  }

  onStartShouldSetResponder(e) {
    return true;
  }

  onMoveShouldSetResponder(e) {
    return true;
  }

  onPressMask() {
    if (typeof this.props.onPressMask === 'function') {
      this.props.onPressMask();
    } else {
      this.onPressCancel();
    }
  }

  onPressCancel() {
    this.setModalVisible(false);

    if (typeof this.props.onCloseModal === 'function') {
      this.props.onCloseModal();
    }
  }

  onPressConfirm() {
    this.datePicked();
    this.setModalVisible(false);

    if (typeof this.props.onCloseModal === 'function') {
      this.props.onCloseModal();
    }
  }

  getDate(date = this.props.date) {
    const {mode, minDate, maxDate, format = FORMATS[mode]} = this.props;

    // date
    if (!date) {
      let now = new Date();
      if (minDate) {
        let _minDate = this.getDate(minDate);

        if (now < _minDate) {
          return _minDate;
        }
      }

      if (maxDate) {
        let _maxDate = this.getDate(maxDate);

        if (now > _maxDate) {
          return _maxDate;
        }
      }

      return now;
    }

    if (date instanceof Date) {
      return date;
    }

    return Moment(date, format).toDate();
  }

  getDateStr(date = this.props.date) {
    const {mode, format = FORMATS[mode]} = this.props;

    if (date instanceof Date) {
      return Moment(date).format(format);
    } else {
      return Moment(this.getDate(date)).format(format);
    }
  }

  datePicked() {
    if (typeof this.props.onDateChange === 'function') {
      this.props.onDateChange(this.getDateStr(this.state.date), this.state.date);
    }
  }

  getTitleElement() {
    const {date, placeholder, customStyles} = this.props;

    if (!date && placeholder) {
      return (<Text style={[Style.placeholderText, customStyles.placeholderText]}>{placeholder}</Text>);
    }
    return (<Text style={[Style.dateText, customStyles.dateText]}>{this.getDateStr()}</Text>);
  }

  onDateChange(date) {
    this.setState({
      allowPointerEvents: false,
      date: date
    })
    const timeoutId = setTimeout(() => {
      this.setState({
        allowPointerEvents: true
      })
      clearTimeout(timeoutId)
    }, 200);
  }
 

  onPressDate() {
    if (this.props.disabled) {
      return true;
    }

    Keyboard.dismiss();

    // reset state
    this.setState({
      date: this.getDate()
    });

    this.setModalVisible(true);
   
    if (typeof this.props.onOpenModal === 'function') {
      this.props.onOpenModal();
    }
  }

  _renderIcon() {
    const {
      showIcon,
      iconSource,
      iconComponent,
      customStyles
    } = this.props;

    if (showIcon) {
      if (!!iconComponent) {
        return iconComponent;
      }
      return (
        <Image
          style={[Style.dateIcon, customStyles.dateIcon]}
          source={iconSource}
        />
      );
    }

    return null;
  }

  render() {
    const {
      mode,
      style,
      customStyles,
      disabled,
      minDate,
      maxDate,
      months,
      minuteInterval,
      timeZoneOffsetInMinutes,
      cancelBtnText,
      confirmBtnText
    } = this.props;

    const dateInputStyle = [
      Style.dateInput, customStyles.dateInput,
      disabled && Style.disabled,
      disabled && customStyles.disabled
    ];

    let monthItems = months.map( (s, i) => {
            return <Picker.Item key={i} value={s} label={s} />
    });

    return (
      <TouchableHighlight
        style={[Style.dateTouch, style]}
        underlayColor={'transparent'}
        onPress={this.onPressDate}
      >
        <View style={[Style.dateTouchBody, customStyles.dateTouchBody]}>
          <View style={dateInputStyle}>
            {this.getTitleElement()}
          </View>
          {this._renderIcon()}
          <Modal
            transparent={true}
            animationType="none"
            visible={this.state.modalVisible}
            supportedOrientations={SUPPORTED_ORIENTATIONS}
            onRequestClose={() => {this.setModalVisible(false);}}
          >
            <View
              style={{flex: 1}}
            >
              <TouchableHighlight
                style={Style.datePickerMask}
                activeOpacity={1}
                underlayColor={'#00000077'}
                onPress={this.onPressMask}
              >
                <TouchableHighlight
                  underlayColor={'#fff'}
                  style={{flex: 1}}
                >
                  <Animated.View
                    style={[Style.datePickerCon, {height: this.state.animatedHeight}, customStyles.datePickerCon]}
                  >
                    <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
                      <Picker 
                        selectedValue={this.state.month} 
                        onValueChange={(m) => this.setState({month: m})}
                      > 
                          {monthItems}  
                      </Picker>
                    </View>
                    <TouchableHighlight
                      underlayColor={'transparent'}
                      onPress={this.onPressCancel}
                      style={[Style.btnText, Style.btnCancel, customStyles.btnCancel]}
                    >
                      <Text
                        style={[Style.btnTextText, Style.btnTextCancel, customStyles.btnTextCancel]}
                      >
                        {cancelBtnText}
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      underlayColor={'transparent'}
                      onPress={this.onPressConfirm}
                      style={[Style.btnText, Style.btnConfirm, customStyles.btnConfirm]}
                    >
                      <Text style={[Style.btnTextText, customStyles.btnTextConfirm]}>{confirmBtnText}</Text>
                    </TouchableHighlight>
                  </Animated.View>
                </TouchableHighlight>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
      </TouchableHighlight>
    );
  }
}

DatePicker.defaultProps = {
  mode: 'date',
  androidMode: 'default',
  date: '',
  // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
  height: 259,

  // slide animation duration time, default to 300ms, IOS only
  duration: 300,
  confirmBtnText: 'Ok',
  cancelBtnText: 'Cancel',
  iconSource: require('../assets/google_calendar.png'),
  customStyles: {},

  // whether or not show the icon
  showIcon: true,
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'September', 'October', 'November', 'December'],
  disabled: false,
  placeholder: '',
  modalOnResponderTerminationRequest: e => true
};

DatePicker.propTypes = {
  mode: React.PropTypes.oneOf(['date', 'datetime', 'time']),
  androidMode: React.PropTypes.oneOf(['calendar', 'spinner', 'default']),
  date: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.instanceOf(Date)]),
  format: React.PropTypes.string,
  minDate: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.instanceOf(Date)]),
  maxDate: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.instanceOf(Date)]),
  height: React.PropTypes.number,
  duration: React.PropTypes.number,
  confirmBtnText: React.PropTypes.string,
  cancelBtnText: React.PropTypes.string,
  iconSource: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.object]),
  iconComponent: React.PropTypes.element,
  customStyles: React.PropTypes.object,
  showIcon: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  onDateChange: React.PropTypes.func,
  onOpenModal: React.PropTypes.func,
  onCloseModal: React.PropTypes.func,
  onPressMask: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  modalOnResponderTerminationRequest: React.PropTypes.func,
  is24Hour: React.PropTypes.bool
};

export default DatePicker;