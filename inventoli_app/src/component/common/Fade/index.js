import React, { Component } from 'react'
import { View, Platform, StyleSheet, Animated, Easing, Image, TouchableOpacity, Text } from 'react-native'

export default class Fade extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
    }
  }

  componentWillMount() {
    this._visibility = new Animated.Value(this.props.visible ? 1 : 0)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true })
    }
    Animated.timing(this._visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: 100,
    }).start(() => {
      this.setState({ visible: nextProps.visible })
    })
  }

  render() {
    const { visible, style, children, ...rest } = this.props

    const containerStyle = {
      position: 'absolute',
      flex: 1,
      zIndex: 5,
      height: '100%',
      width: '100%',
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    }

    const combinedStyle = [containerStyle, style]
    return (
      <Animated.View style={this.state.visible ? combinedStyle : containerStyle} {...rest} pointerEvents="none">
        {this.state.visible ? children : null}
      </Animated.View>
    )
  }
}
