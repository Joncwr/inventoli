import React, { Component } from 'react'
import { StyleSheet, View, Text, Platform, Animated, TouchableOpacity } from 'react-native'

export default class Snackbar extends Component {
  constructor(){
    super()

    this.state = {
      animated: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.toggleBar()
  }

  toggleBar() {
    Animated.sequence([
      Animated.timing(this.state.animated, {
        toValue: 1,
        duration: 500,
      }),
      Animated.timing(this.state.animated, {
        toValue: 0,
        duration: 500,
        delay: this.props.duration,
      })
    ]).start()
  }

  displayButton() {
    if (this.props.snackbarButtonText !== '') {
      let buttonColor = '#002386'
      if (this.props.snackbarButtonColor) {
        buttonColor = this.props.snackbarButtonColor
      }
      return (
        <Text numberOfLines={1} style={[styles.snackbarButton, {color: buttonColor}]}>{this.props.snackbarButtonText}</Text>
      )
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.props.snackbarFunction()} activeOpacity={1}>
        <Animated.View style={{
          width: '100%',
          padding: 15,
          transform: [
            {
              translateY: this.state.animated.interpolate({
                inputRange: [0,1],
                outputRange: [-100,1]
              })
            }
          ]
        }}>
          <View style={styles.snackbar}>
            <Text style={styles.snackbarHeader}>Notification</Text>
            <View style={styles.snackbarBody}>
              <Text numberOfLines={1} style={styles.snackbarText}>{this.props.snackbarMessage}</Text>
              {this.displayButton()}
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

var styles = StyleSheet.create({
  snackbar: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: .08,
    shadowRadius: 6,
    ...Platform.select({
      android: {
        borderWidth: 1,
        borderColor: '#f1f1f1',
      },
    }),
    padding: 15,
  },
  snackbarHeader: {
    fontSize: 12,
    marginBottom: 5,
    color: '#494949',
    backgroundColor: "white"
  },
  snackbarBody: {
    flexDirection: 'row',
    flex: 1,
  },
  snackbarText: {
    fontWeight: 'bold',
    color: '#404040',
    flex: 1,
  },
  snackbarButton: {
    marginLeft: 15,
    fontWeight: 'bold',
    maxWidth: "50%",
  },
});
