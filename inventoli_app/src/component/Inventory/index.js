import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import { NavigationEvents } from "react-navigation";

import InventoryItem from './InventoryItem'
import SnackbarHelper from '../../common/helpers/SnackbarHelper'
import StorageApi from '../../services/storage/StorageApi'
import ObjectHelper from '../../common/helpers/ObjectHelper'

export default class Inventory extends Component {
  constructor(){
    super()

    this.state = {
      items: []
    }
  }

  onFocus() {
    StorageApi.getAllItems(this.props.screenProps.houseId)
    .then(items => {
      this.setState({items})
    })
    .catch(err => console.log(err))
  }

  renderItems() {
    if (this.state.items.length > 0) {
      let renderItems = []
      this.state.items.forEach((data,index) => {
        renderItems.push(
          <InventoryItem
            key={index}
            navigation={this.props.navigation}
            data={data}
            categories={this.props.screenProps.categories}
          />
        )
      })

      return renderItems
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={this.onFocus.bind(this)}
        />
      <ScrollView style={{width: '100%', paddingHorizontal: 10}} contentContainerStyle={{paddingVertical: 20}}>
          <View style={styles.itemsContainer}>
            {this.renderItems()}
          </View>
        </ScrollView>
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
  itemsContainer: {
    flex: 1,
  }
});
