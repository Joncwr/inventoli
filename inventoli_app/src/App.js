import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import NfcManager, {NfcAdapter} from 'react-native-nfc-manager'

import Home from './component/Home'
import Create from './component/Create'
import Modal from './component/common/Modal'

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
      tag: {techTypes: Array(1), id: "4B701085"},
    }
  }

  componentDidMount() {
    NfcManager.registerTagEvent(
      tag => {
        console.log('Tag Discovered', tag);
        this.setState({tag})
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

  render() {
    return <AppContainer screenProps={this.state}/>;
  }
}

const styles = StyleSheet.create({
  container: {
  },
});
