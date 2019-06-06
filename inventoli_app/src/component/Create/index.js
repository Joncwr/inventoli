import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import Swipeout from 'react-native-swipeout';

import TextInput from '../common/TextInput'
import Button from '../common/Button'
import ObjectHelper from '../../common/helpers/ObjectHelper'

export default class Home extends Component {
  constructor(){
    super()

    this.state = {
      location: '',
      items: [
        {

        },
      ],
    }
    this.onChangeText=this.onChangeText.bind(this)
    this.itemOptions=this.itemOptions.bind(this)
  }

  onChangeText(event, name) {
    this.setState({[name]: event})
  }

  renderTag() {
    if (!ObjectHelper.isEmpty(this.props.screenProps.tag)) {
      return (
        <View style={{flexDirection: 'row', paddingHorizontal: 4}}>
          <Text style={{fontSize: 20}} numberOfLines={1} ellipsizeMode='tail'>
            RFID Tag ID:
          </Text>
          <Text style={{fontSize: 20, fontWeight: '700'}} numberOfLines={1} ellipsizeMode='tail'>
            {' ' + this.props.screenProps.tag.id}
          </Text>
        </View>
      )
    }
    else {
      return (
        <Text style={{paddingHorizontal: 4, fontWeight: '600', color: '#ff4d4d'}} numberOfLines={2} ellipsizeMode='tail'>
          Please scan your tag behind before continuing.
        </Text>
      )
    }
  }

  renderItems() {
    let renderItems = []
    for (let i = 0; i < this.state.items.length; i++) {
      var swipeoutBtns = [{backgroundColor: '#ff4d4d', text: 'Delete', onPress: () => this.itemOptions('delete', i)}]
      renderItems.push(
        <Swipeout style={{marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6', borderTopWidth: 1, borderTopColor: '#f2f2f2',}} right={swipeoutBtns} key={i}>
          <View style={styles.item}>

          </View>
        </Swipeout>
      )
    }

    return renderItems
  }

  itemOptions(option, index) {
    let itemArr = Object.assign([], this.state.items)
    if (option === 'create') {
      itemArr.push({})
    }
    else if (option === 'delete') {
      itemArr.splice(index, 1)
    }
    this.setState({items: itemArr})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.header} numberOfLines={1} ellipsizeMode='tail'>
            Container
          </Text>
          <View style={styles.containerDetailsContainer}>
            <View style={styles.image}>

            </View>
            <View style={styles.containerDetails}>
              {this.renderTag()}
              <TextInput
                onChangeText={this.onChangeText.bind(this)}
                placeholder={'Enter Location Here'}
                keyboard={'default'}
                name={'location'}
                value={this.state.location}
                maxLength={19}
              />
            </View>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={{flex: 1,paddingVertical: 20}}>
            <View style={styles.mainHeader}>
              <Text style={styles.header} numberOfLines={1} ellipsizeMode='tail'>
                Items
              </Text>
              <TouchableOpacity
                style={styles.addItem}
                onPress={() => this.itemOptions('create')}
                activeOpacity={0.7}
              >
                <Text style={{fontWeight: '500'}}>
                  Add Item
                </Text>
              </TouchableOpacity>
            </View>
            {this.renderItems()}
            <View style={styles.createItem}>
              <Button
                theme={{
                  fillColor: '#99ffcc',
                  textColor: '#4c4c4c'
                }}
                text="Add Container"
                function={() => this.itemOptions('create')}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(242, 242, 242,1)',
    elevation: 5,
  },
  containerDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerDetails: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 20,
    backgroundColor: 'lightblue',
  },
  header: {
    color: '#4c4c4c',
    fontWeight: '700',
    fontSize: 22,
  },
  mainContainer: {
    flex: 3,
    width: '100%',
    backgroundColor: 'rgba(242, 242, 242, .5)',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  addItem: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#b3ffb3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: '100%',
    height: 100,
    backgroundColor: '#fff',
  },
  createItem: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
});
