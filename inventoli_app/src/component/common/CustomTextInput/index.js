import React, { Component } from 'react'
import { TextInput, StyleSheet, Platform, View, Text } from 'react-native'

export default class TextInputForm extends Component {
  constructor(props){
    super(props)

    this.state={
      underlineColor: '#cceeff',
      error: false,
    }

    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.generateErrorMsgs = this.generateErrorMsgs.bind(this)
  }

  componentDidUpdate() {
    let errorMsgs = this.props.errorMsgs
    if(errorMsgs){
      if(errorMsgs.length > 0 && !this.state.error){
        this.setState({underlineColor: '#ff0000', error: true})
      }
      else if(errorMsgs.length === 0 && this.state.error){
        this.setState({underlineColor: '#f0f0f0', error: false})
      }
    }
  }

  handleOnFocus(){
    if(this.props.onFocus) this.props.onFocus()
    if (!this.state.error) this.setState({underlineColor: '#00aaff'})
  }

  handleOnBlur(){
    if (!this.state.error) this.setState({underlineColor: '#f0f0f0'})
  }

  generateErrorMsgs(){
    let errorMsgs = this.props.errorMsgs
    if (errorMsgs){
      if(errorMsgs.length > 0){
        return <Text style={styles.errorMsgs}>{errorMsgs.join(" ")}</Text>
      }
    }
  }

  render() {
    var textColor
    if (this.props.editable === false) {
      textColor = '#a6a6a6'
    }
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TextInput
          style={[styles.input, {borderBottomColor: this.state.underlineColor, color: textColor}]}
          onChangeText={(text) => this.props.onChangeText(text, this.props.name)}
          value={this.props.value}
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          keyboardType={this.props.keyboard}
          secureTextEntry={this.props.secureTextEntry}
          returnKeyType={this.props.returnKeyType}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
          editable={this.props.editable}
          autoCapitalize={this.props.autoCapitalize}
          autoCorrect={this.props.autoCorrect}
          maxLength={this.props.maxLength}
          underlineColorAndroid={this.state.underlineColor}
          selectionColor={"#002287"}
          placeholderTextColor={"#bbb"}
        />
      {this.generateErrorMsgs()}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container:{
    width: '100%',
    paddingBottom: (Platform.OS === 'ios') ? 0 : 7,
  },
  input: {
    width: '100%',
    paddingTop: (Platform.OS === 'ios') ? 15 : 8,
    paddingLeft: (Platform.OS === 'ios') ? 2 : 6,
    paddingBottom: (Platform.OS === 'ios') ? 8 : 12,
    borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
    marginBottom: (Platform.OS === 'ios') ? 5 : -3,
    fontSize: 16,
    fontWeight: '400',
  },
  errorMsgs: {
    color: '#FF0000',
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '500',
    marginLeft: (Platform.OS === 'ios') ? 0 : 4,
  }
})
