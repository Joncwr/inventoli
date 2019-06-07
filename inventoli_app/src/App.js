import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import NfcManager, {NfcAdapter} from 'react-native-nfc-manager'

import SnackbarHelper from './common/helpers/SnackbarHelper'
import Home from './component/Home'
import Create from './component/Create'
import Modal from './component/common/Modal'
import Snackbar from './component/common/Snackbar'

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Home: Create,
  Create: SettingsScreen,
  Scan: SettingsScreen,
  Inventory: SettingsScreen,
});

const MainStack = createStackNavigator(
  {
    Home: {
      screen: TabNavigator,
    },
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    MyModal: {
      screen: Modal,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  constructor(){
    super()

    this.state = {
      showSnackbar: false,
      snackbarDuration: 0,
      snackbarMessage: '',
      snackbarButtonText: '',
      snackbarFunction: null,
      snackbarButtonColor: '',
      tag: {techTypes: Array(1), id: "4B701085"},
      owners: [
        {
          name: 'Not Sure'
        },
        {
          name: 'Jonathan Chua'
        },
        {
          name: 'David Chua'
        },
        {
          name: 'Sharon Chua'
        },
        {
          name: 'Michelle Chua'
        },
        {
          name: 'Keith Chua'
        },
        {
          name: 'Irene Chua'
        },
      ],
      categories: [
        {
          category: 'Books',
          color: '#cceeff',
        },
        {
          category: 'Office Material',
          color: '#ffd9b3',
        },
        {
          category: 'Documents',
          color: '#ccccff',
        },
        {
          category: 'Valuables',
          color: '#d9ffcc',
        },
        {
          category: 'Electronics',
          color: '#ffffb3',
        },
        {
          category: 'Clothes',
          color: '#ffcccc',
        },
        {
          category: 'Others',
          color: '#ffccff',
        },
      ]
    }
    this.toggleSnackbar=this.toggleSnackbar.bind(this)

    SnackbarHelper.setToggleSnackbar(this.toggleSnackbar)
  }

  componentDidMount() {
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
  }

  toggleSnackbar(message, snackbarDuration, snackbarButtonText, snackbarFunction, snackbarButtonColor) {
    let duration = snackbarDuration || 2000
    if (snackbarButtonText) {
      this.setState({snackbarButtonText: snackbarButtonText, snackbarFunction: snackbarFunction, snackbarButtonColor: snackbarButtonColor})
    }
    this.setState({showSnackbar: !this.state.showSnackbar, snackbarDuration: duration, snackbarMessage: message}, () => {
      if (this.state.showSnackbar) {
        setTimeout(() => {
          this.toggleSnackbar()
        }, this.state.snackbarDuration + 1500)
      }
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.snackbar} pointerEvents="none">
          {this.state.showSnackbar ?
            <Snackbar
              duration={this.state.snackbarDuration}
              snackbarMessage={this.state.snackbarMessage}
              snackbarButtonText={this.state.snackbarButtonText}
              snackbarFunction={this.state.snackbarFunction}
              snackbarButtonColor={this.state.snackbarButtonColor}
            />
            :
            null
          }
        </View>
        <AppContainer screenProps={this.state}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  snackbar: {
    zIndex: 5,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 100,
  },
});
