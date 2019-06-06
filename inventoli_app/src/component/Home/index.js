import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';


export default class Home extends Component {
  constructor(){
    super()

    this.state = {
    }
  }


  renderTag() {
    if (this.props.screenProps.tag !== {}) {
      return (
        <Text numberOfLines={1} ellipsizeMode='tail'>
          Tag ID is - {this.props.screenProps.tag.id}
        </Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Hold the tag behind the phone!</Text>
        {this.renderTag()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
