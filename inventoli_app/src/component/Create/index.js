import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, Picker, TextInput, Image} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { NavigationEvents } from "react-navigation";
import NfcManager, {NfcAdapter} from 'react-native-nfc-manager'
import ImagePicker from 'react-native-image-picker'
import { Auth, Storage } from 'aws-amplify';
import RNFetchBlob from 'rn-fetch-blob'
import { Buffer } from 'buffer'
import moment from 'moment'
import uuidv4 from 'uuid/v4'

import CustomTextInput from '../common/CustomTextInput'
import Button from '../common/Button'
import ObjectHelper from '../../common/helpers/ObjectHelper'
import SnackbarHelper from '../../common/helpers/SnackbarHelper'
import StorageApi from '../../services/storage/StorageApi'

export default class Home extends Component {
  constructor(){
    super()

    this.state = {
      location: '',
      items: [
        {
          owner: {},
          categories: [],
          certainty: '',
          images: [],
          description: ''
        },
      ],
      disableButton: false,
      tag: {id: 243243},
    }
    this.onChangeText=this.onChangeText.bind(this)
    this.itemOptions=this.itemOptions.bind(this)
    this.addCategory=this.addCategory.bind(this)
    this.imagePicker=this.imagePicker.bind(this)
  }

  onChangeText(event, name, index) {
    if (typeof index === 'number') {
      let items = Object.assign([], this.state.items)
      let item = items[index]
      item['description'] = event
      this.setState({items})
    }
    else {
      this.setState({[name]: event})
    }
  }

  renderTag() {
    if (!ObjectHelper.isEmpty(this.state.tag)) {
      return (
        <View style={{flexDirection: 'row', paddingHorizontal: 4, marginTop: 10}}>
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

  renderPicker(index, option) {
    let items = Object.assign([], this.state.items)
    let item = items[index]
    if (option === 'owner') {
      let screenProps = Object.assign({}, this.props.screenProps)
      if (!ObjectHelper.isEmpty(screenProps.owners)) {
        if (screenProps.owners.length > 0) {
          let owners = []
          screenProps.owners.forEach((data, index) => {
            owners.push(
              <Picker.Item key={index} label={data.name} value={data.name}/>
            )
          })

          return (
            <Picker
              selectedValue={item.owner.name}
              onValueChange={(itemValue, itemIndex) => {
                // CHANGE ID WHEN DB INTERGRATED
                item['owner'] = {name: itemValue, id: screenProps.owners[itemIndex].id}
                this.setState({items})
              }}>
              {owners}
            </Picker>
          )
        }
      }
    }
    else if (option === 'certainty') {
      return (
        <Picker
          selectedValue={item.certainty}
          onValueChange={(itemValue, itemIndex) => {
            // CHANGE ID WHEN DB INTERGRATED
            item['certainty'] = itemValue
            this.setState({items})
          }}>
          <Picker.Item label='Please Select' value={null}/>
          <Picker.Item label='Certain' value='certain'/>
          <Picker.Item label='Uncertain' value='uncertain'/>
          <Picker.Item label='No Clue' value='noclue'/>
        </Picker>
      )
    }
  }

  renderCategories(index) {
    let screenProps = Object.assign({}, this.props.screenProps)
    if (!ObjectHelper.isEmpty(screenProps.categories)) {
      if (screenProps.categories.length > 0) {
        let renderCategories = []
        let items = Object.assign([], this.state.items)
        let categories = items[index].categories
        screenProps.categories.forEach((data,catIndex) => {
          let selected
          let color = '#e6e6e6'
          if (categories.length > 0) {
            categories.forEach(category => {
              if (category.category === data.category) {
                selected = true
              }
            })
          }
          if (selected) color = data.color
          renderCategories.push(
            <TouchableOpacity key={catIndex} activeOpacity={0.7} onPress={() => this.addCategory(data, index)} style={[styles.categoryItem, {backgroundColor: color}]}>
              <Text style={{fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail'>
                {data.category}
              </Text>
            </TouchableOpacity>
          )
        })
        return renderCategories
      }
    }
  }

  addCategory(category, index) {
    let items = Object.assign([], this.state.items)
    let categories = items[index].categories
    let method = 'add'
    let catIndex
    categories.forEach((data,index) => {
      if (category.category === data.category) {
        method = 'delete'
        catIndex = index
      }
    })
    if (method === 'add') {
      categories.push({category: category.category})
    }
    else if (method === 'delete') categories.splice(catIndex, 1)
    this.setState({items})
  }

  renderItems() {
    let renderItems = []
    for (let i = 0; i < this.state.items.length; i++) {
      var swipeoutBtns = [{backgroundColor: '#ff4d4d', text: 'Delete', onPress: () => this.itemOptions('delete', i)}]
      renderItems.push(
        <Swipeout style={{marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6', borderTopWidth: 1, borderTopColor: '#f2f2f2',}} right={swipeoutBtns} key={i}>
          <View style={styles.item}>
            <View style={styles.itemRow}>
              <Text style={styles.itemHeader} numberOfLines={1} ellipsizeMode='tail'>
                Owner:
              </Text>
              <View style={styles.itemMain}>
                {this.renderPicker(i, 'owner')}
              </View>
            </View>
            <View style={[styles.categoryRow]}>
              <Text style={[styles.itemHeader, {alignSelf: 'flex-start', marginTop:5}]} numberOfLines={1} ellipsizeMode='tail'>
                Categories:
              </Text>
              <View style={styles.categoryMain}>
                {this.renderCategories(i)}
              </View>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemHeader} numberOfLines={1} ellipsizeMode='tail'>
                Certainty:
              </Text>
              <View style={styles.itemMain}>
                {this.renderPicker(i, 'certainty')}
              </View>
            </View>
            <View style={styles.itemRowImage}>
              <Text style={styles.itemHeader} numberOfLines={1} ellipsizeMode='tail'>
                Images:
              </Text>
              <View style={styles.itemMain}>
                {this.renderImagePicker(i)}
              </View>
            </View>
            <View style={[styles.itemRow, {height: 60, marginTop: 5}]}>
              <Text style={[styles.itemHeader, {alignSelf: 'flex-start', marginTop: 8}]} numberOfLines={1} ellipsizeMode='tail'>
                Description:
              </Text>
              <View style={styles.itemMain}>
               <TextInput
                style={styles.TextInputStyleClass}
                value={this.state.items[i].description}
                onChangeText={(value) => this.onChangeText(value,'description',i)}
                underlineColorAndroid="transparent"
                placeholder={"Type Something in Text Area."}
                placeholderTextColor={"#9E9E9E"}
                numberOfLines={10}
                multiline={true}
              />
              </View>
            </View>
          </View>
        </Swipeout>
      )
    }

    return renderItems
  }

  renderImagePicker(index) {
    let items = Object.assign([], this.state.items)
    let item = items[index]

    if (item.images.length > 0) {
      let renderImage = []
      item.images.forEach((data, index) => {
        if (data.uri) {
          renderImage.push(
            <TouchableOpacity key={index} onPress={() => this.showPictureModal(data)}>
              <Image
                style={{height: 40, width: 40}}
                source={{
                  uri: data.uri,
                }}
              />
            </TouchableOpacity>
          )
        }
      })

      return renderImage
    }
    else {
      return (
        <TouchableOpacity onPress={() => this.imagePicker(index)} style={styles.imagePicker} activeOpacity={.7}>
          <Text style={{fontSize: 18, fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail'>
            +
          </Text>
        </TouchableOpacity>
      )
    }
  }

  showPictureModal(data) {
    let modalDict = {
      modal: 'picture',
      data: data
    }
    this.props.navigation.navigate('MyModal', modalDict)
  }

  readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64').then(data => new Buffer(data, 'base64'));
  }

  imagePicker(index) {
    const options = {
      title: `Please choose the item's picture.`,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    }

    ImagePicker.showImagePicker(options, (response) => {
      let file = {
        uri: response.uri,
        name: uuidv4() + '.jpg',
        type: 'image/jpeg',
      }

      let items = Object.assign([], this.state.items)
      items[index].images.push(file)
      this.setState({items})
    });
  }

  itemOptions(option, index) {
    let itemArr = Object.assign([], this.state.items)
    if (option === 'create') {
      itemArr.push(
        {
          owner: {},
          categories: [],
          certainty: '',
          images: [],
          description: ''
        }
      )
    }
    else if (option === 'delete') {
      itemArr.splice(index, 1)
    }
    this.setState({items: itemArr})
  }

  validate() {
    let tag = Object.assign({}, this.state.tag)
    if (ObjectHelper.isEmpty(tag)) {
      SnackbarHelper.toggle('Error. Please scan a RFID tag.')
      return false
    }

    let items = Object.assign([], this.state.items)
    let categoryCheck = true
    let descriptionCheck = true
    let certaintyCheck = true
    items.forEach(data => {
      if (data.categories.length == 0) {
        categoryCheck = false
      }
      if (!data.description) {
        descriptionCheck = false
      }
      if (!data.certainty) {
        certaintyCheck = false
      }
    })
    if (!categoryCheck) {
      SnackbarHelper.toggle('Error. Please choose at least 1 category for any item.')
      return false
    }
    else if (!certaintyCheck) {
      SnackbarHelper.toggle('Error. Please choose the certainty for any item.')
      return false
    }
    else if (!descriptionCheck) {
      SnackbarHelper.toggle('Error. Please write a description for any item.')
      return false
    }
    return true
  }

  onSubmit() {
    if (!this.state.disableButton) {
      if (!this.validate()) return
      let createContainerDict = {
        rfid_tag: this.state.tag.id,
        items: this.state.items
      }
      this.setState({disableButton: true}, () => {
        StorageApi.createContainer(createContainerDict)
        .then(res => {
          if (res === 'Container already exists') {
            SnackbarHelper.toggle('Error. Tag already exists.')
          }
          else {
            SnackbarHelper.toggle('Container sucessfully created.')
            this.state.items.forEach(data => {
              if (data.images.length > 0) {
                data.images.forEach(images => {
                  this.readFile(images.uri).then(buffer => {
                    Storage.put(images.name, buffer, {
                      contentType: 'image/jpeg'
                    })
                    .then (result => console.log(result))
                  })
                  .catch(err => console.log(err));
                })
              }
            })

            this.setState({
              tag: {},
              location: '',
              items: [
                {
                  owner: {},
                  categories: [],
                  certainty: '',
                  images: [],
                  description: ''
                },
              ],
              disableButton: false
            })
          }
        })
        .catch(err => {
          this.setState({disableButton: false})
          console.log(err);
        })
        // StorageApi.test()
        // .then(res => {
        //   console.log(res);
        // })
        // .catch(err => {
        //   console.log(err);
        // })
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            NfcManager.unregisterTagEvent()
            NfcManager.registerTagEvent(
              tag => {
                console.log('Tag Discovered', tag);
                this.setState({tag})
                //Add Sound.
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
              <CustomTextInput
                onChangeText={(e) => this.onChangeText(e, 'location')}
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
          <ScrollView contentContainerStyle={{paddingVertical: 20}}>
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
                  fillColor: '#99ccff',
                  textColor: '#4c4c4c'
                }}
                text="Add Container"
                disabled={this.state.disableButton}
                function={() => this.onSubmit()}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  itemRow: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    // backgroundColor: 'red',
  },
  itemRowImage: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemHeader: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  itemMain: {
    flex: 3,
    marginLeft: 20,
    height: '100%',
    justifyContent: 'center',
  },
  categoryMain: {
    flex: 3,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 20,
  },
  categoryRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    // backgroundColor: 'red',
  },
  categoryItem: {
    height: 25,
    marginHorizontal: 2.5,
    marginVertical: 2.5,
    paddingHorizontal: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },
  TextInputStyleClass: {
    height: 60,
    borderWidth: 2,
    borderColor: '#e6f2ff',
    borderRadius: 10,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    backgroundColor : "#FFFFFF",
  },
  createItem: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  imagePicker: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b3ffff',
  },
});
