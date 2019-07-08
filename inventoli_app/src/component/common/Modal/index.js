import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';

import ObjectHelper from '../../../common/helpers/ObjectHelper'
import Picture from './Picture'

export default class Modal extends Component {
  renderComponent() {
    let params = this.props.navigation.state.params
    if (!ObjectHelper.isEmpty(params)) {
      let component
      if(params.modal){
        switch (params.modal) {
          case 'picture':
            component = <Picture goBack={this.props.navigation.goBack} data={params.data}/>
            break
          default:
            component = <View />
        }

        return component
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this.renderComponent()}
      </View>
    );
  }
}
