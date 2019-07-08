import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity} from 'react-native';
import { NavigationEvents } from "react-navigation";
import NfcManager, {NfcAdapter} from 'react-native-nfc-manager'

import StorageApi from '../../services/storage/StorageApi'
import Button from '../common/Button'
import ObjectHelper from '../../common/helpers/ObjectHelper'
import CustomTextInput from '../common/CustomTextInput'
import ItemComponent from './ItemComponent'
import SnackbarHelper from '../../common/helpers/SnackbarHelper'

export default class Home extends Component {
  constructor(){
    super()

    this.state = {
      tag: '',
      container: {}
    }
    this.onChangeText=this.onChangeText.bind(this)
  }

  componentDidUpdate(prevProps) {
    // if (this.props.screenProps.tag !== this.state.tag) {
    //   this.setState({tag: this.props.screenProps.tag}, () => {
    //     console.log(this.state.tag);
    //     StorageApi.getContainer(this.state.tag.id)
    //     .then(res => {
    //       this.setState({container: res})
    //     })
    //     .catch(err => console.log(err))
    //   })
    // }
  }

  readTag(tag) {
    this.setState({tag},() => {
      StorageApi.getContainer(this.state.tag.id)
      .then(res => {
        this.setState({container: res})
      })
      .catch(err => {
        this.setState({tag: '', container: {}})
        SnackbarHelper.toggle('No container found with this tag.')
      })
    })
  }

  renderTag() {
    if (!ObjectHelper.isEmpty(this.state.tag)) {
      return (
        <View style={{flexDirection: 'row', paddingHorizontal: 4, marginTop: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 16}} numberOfLines={1} ellipsizeMode='tail'>
            RFID Tag ID:
          </Text>
          <Text style={{fontSize: 16, fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail'>
            {' ' + this.state.tag.id}
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

  onChangeText(event, name) {
    if (name === 'location') {
      let container = Object.assign({}, this.state.container)
      container['location'] = event
      this.setState({container})
    }
    else {
      this.setState({[name]: event})
    }
  }

  renderItems() {
    if (!ObjectHelper.isEmpty(this.state.container.items)) {
      let itemsArr = this.state.container.items
      let renderItems = []

      itemsArr.forEach((data,index) => {
        renderItems.push(
          <ItemComponent
            key={index}
            data={data}
            categories={this.props.screenProps.categories}
          />
        )
      })

      return renderItems
    }
  }

  update() {
    this.props.navigation.navigate('Update', {container: this.state.container, readTag: this.readTag.bind(this)})
  }

  updateLocation() {
    if (!ObjectHelper.isEmpty(this.state.container.location)) {
      let locationDict = {
        id: this.state.container.id,
        location: this.state.container.location
      }

      StorageApi.updateLocation(locationDict)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err))
    }
  }

  render() {
    let location = ''
    if (!ObjectHelper.isEmpty(this.state.container)) location = this.state.container.location
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            NfcManager.unregisterTagEvent()
            NfcManager.registerTagEvent(
              tag => {
                console.log('Tag Discovered', tag);
                this.readTag(tag)
                //Add Sound & implement reading of tag here.
              },
              'Hold your device over the tag',
              {
                invalidateAfterFirstRead: true,
                isReaderModeEnabled: true,
                readerModeFlags:
                  NfcAdapter.FLAG_READER_NFC_A | NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK,
              },
            );
          }}
        />
        <View style={styles.topContainer}>
          <Text style={styles.header} numberOfLines={1} ellipsizeMode='tail'>
            Container
          </Text>
          <View style={styles.containerDetailsContainer}>
            <Image
              source={require('../../assets/img/graphic_container.png')}
              style={styles.image}
              resizeMode='cover'
            />
            <View style={styles.containerDetails}>
              {this.renderTag()}
              <View style={{flexDirection: 'row', flex: 1, marginRight: 50}}>
                <CustomTextInput
                  onChangeText={(e) => this.onChangeText(e, 'location')}
                  placeholder={'Enter Location Here'}
                  keyboard={'default'}
                  name={'location'}
                  value={location}
                  maxLength={19}
                />
                <TouchableOpacity
                  style={styles.updateLocation}
                  onPress={() => this.updateLocation()}
                  activeOpacity={0.7}
                >
                  <Image
                    source={require('../../assets/img/icon_upload.png')}
                    style={{height: '100%', width: '100%'}}
                    resizeMode='cover'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={{paddingVertical: 20}}>
            {this.renderItems()}
            <View style={styles.updateItem}>
              <Button
                theme={{
                  fillColor: '#99ccff',
                  textColor: '#4c4c4c'
                }}
                text="Update Container"
                function={() => this.update()}
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
    backgroundColor: '#F5FCFF',
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
  image: {
    height: 70,
    width: 70,
    marginHorizontal: 12,
  },
  containerDetails: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  updateLocation: {
    width: 35,
    height: 35,
    borderRadius: 5,
    marginLeft: 5,
    backgroundColor: '#ccf2ff',
    padding: 7,
  },
  header: {
    color: '#4c4c4c',
    fontWeight: '700',
    fontSize: 22,
  },
  mainContainer: {
    flex: 4,
    width: '100%',
    backgroundColor: 'rgba(242, 242, 242, .5)',
  },
  updateItem: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
});
