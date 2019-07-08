import React, {Component} from 'react';
import {Platform, Text, View, Image} from 'react-native';

import Button from '../../../common/Button'

export default class Picture extends Component {
  render() {
    let uri = this.props.data.uri || ''
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{height: 400, width: 400}}
          source={{
            uri: uri,
          }}
          resizeMode='contain'
        />
        <View style={{width: 200, marginTop: 40}}>
          <Button
            theme={{
              fillColor: '#99ccff',
              textColor: '#4c4c4c'
            }}
            text="Go Back"
            function={() => this.props.goBack()}
          />
        </View>
      </View>
    );
  }
}
