import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

import StorageApi from '../../services/storage/StorageApi'
import ObjectHelper from '../../common/helpers/ObjectHelper'
import ImagePicker from 'react-native-image-picker'

export default class Home extends Component {
  constructor(){
    super()

    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width: 400, height: 200}}
          source={{uri: 'https://media.giphy.com/media/S5JSwmQYHOGMo/200.gif'}}
        />
        <Text style={styles.welcome}>Under Construction Nigga!</Text>
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
