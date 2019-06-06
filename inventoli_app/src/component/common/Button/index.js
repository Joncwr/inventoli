import React, { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native'

export default class Button extends Component {
  constructor(props) {
    super(props)

    this.onPressAction = this.onPressAction.bind(this)
    this.getTheme = this.getTheme.bind(this)
    this.generateIcon = this.generateIcon.bind(this)
  }

  onPressAction() {
    if (this.props.function) {
      this.props.function()
    }
  }

  getTheme(){
    let theme = {
      fillColor: '#ccc',
      textColor: '#454545',
    }

    if(this.props.disabled){
      theme['fillColor'] = '#eee'
      theme['textColor'] = '#ccc'
    }
    else{
      if(this.props.theme){
        let fillColor = this.props.theme.fillColor
        let textColor = this.props.theme.textColor
        let outlineColor = this.props.theme.outlineColor

        // button background color
        if(fillColor){
          switch (fillColor) {
            case 'green':
              theme['fillColor'] = '#d5ffa7'
              break
            case 'blue':
              theme['fillColor'] = '#002387'
              break
            default:
              theme['fillColor'] = fillColor
          }
        }

        // button text color
        if(textColor){
          switch (textColor) {
            case 'green':
              theme['textColor'] = '#538818'
              break
            case 'blue':
              theme['textColor'] = '#002387'
              break
            default:
              theme['textColor'] = textColor
          }
        }

        // button outline color
        if(outlineColor){
          theme['outlineWidth'] = 1.5
          switch (outlineColor) {
            case 'green':
              theme['outlineColor'] = '#538818'
              break
            case 'blue':
              theme['outlineColor'] = '#002387'
              break
            default:
              theme['outlineColor'] = outlineColor
          }
        }
      }
    }
    return theme
  }

  generateIcon(color) {
    if (this.props.icon) {
      return (
        <Image
          source={this.props.icon}
          style={[styles.buttonIcon, {tintColor: color}, this.props.iconStyle]}
          resizeMode='contain'
        />
      )
    }
  }

  render() {
    let theme = this.getTheme()
    let disableButton = this.props.disabled || false
    let direction = this.props.iconPosition === 'left' ? 'rtl' : 'ltr' || 'ltr'

    return (
      <TouchableOpacity
        disabled={disableButton}
        style={[styles.container, {
          backgroundColor: theme.fillColor,
          borderWidth: theme.outlineWidth,
          borderColor: theme.outlineColor,
        }]}
        onPress={() => this.onPressAction()}
        activeOpacity={0.7}
      >
        <View style={[styles.content, {direction: direction}]}>
          <Text style={[
            styles.buttonText,
            {color: theme.textColor},
          ]}>
            {this.props.text.toUpperCase()}
          </Text>
          {this.generateIcon(theme.textColor)}
        </View>
      </TouchableOpacity>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    borderRadius: 500,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cccccc',
    paddingHorizontal: 15,
  },
  content:{
    flexDirection: 'row',
  },
  buttonText: {
    color:'#333333',
    textAlign:'center',
    backgroundColor: 'transparent',
    fontWeight: '600',
    fontSize: 14
  },
  buttonIcon: {
    height: 16,
    width: 16,
    marginLeft: 4,
  },
})
