import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import NfcManager, {NfcAdapter} from 'react-native-nfc-manager'

import SnackbarHelper from './common/helpers/SnackbarHelper'
import Home from './component/Home'
import Create from './component/Create'
import Scan from './component/Scan'
import Update from './component/Update'
import Modal from './component/common/Modal'
import Snackbar from './component/common/Snackbar'
import Fade from './component/common/Fade'
import LoadingIndicator from './component/common/LoadingIndicator'
import LoadFetch from './services/common/LoadFetch'
import OwnershipApi from './services/ownership/OwnershipApi'

let loadingIndicatorDestroyTimer

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
  Create: Create,
  Scan: Scan,
  Inventory: SettingsScreen,
});

const MainStack = createStackNavigator(
  {
    Home: {
      screen: TabNavigator,
    },
    Update: {
      screen: Update,
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
      tag: {},
      loadingIndicatorMethod: 'hide',
      fadeAnimation: false,
      owners: [],
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
    this.loadingIndicatorChanged = this.loadingIndicatorChanged.bind(this)

    SnackbarHelper.setToggleSnackbar(this.toggleSnackbar)
    LoadFetch.setLoader(this.loadingIndicatorChanged)
  }

  componentDidMount() {
    console.log(process.env.REACT_APP_NOT_SECRET_CODE);

    let house_id = 2
    OwnershipApi.getOwners(house_id)
    .then(res => {
      let emptyArr = [{name: 'Not Sure'}]
      let owners = emptyArr.concat(res)
      this.setState({owners})
    })
    .catch(err => console.log(err))

    // NfcManager.registerTagEvent(
    //   tag => {
    //     console.log('Tag Discovered', tag);
    //     this.setState({tag})
    //     //Add Sound.
    //   },
    //   'Hold your device over the tag',
    //   {
    //     invalidateAfterFirstRead: true,
    //     isReaderModeEnabled: true,
    //     readerModeFlags:
    //       NfcAdapter.FLAG_READER_NFC_A | NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK,
    //   },
    // );
  }

  toggleSnackbar(message, snackbarDuration, snackbarButtonText, snackbarFunction, snackbarButtonColor) {
    let snackbarTimeout
    clearTimeout(snackbarTimeout)
    if (message) {
    let duration = snackbarDuration || 2000
      if (snackbarButtonText) {
        console.log(snackbarButtonText);
        this.setState({snackbarButtonText: snackbarButtonText, snackbarFunction: snackbarFunction, snackbarButtonColor: snackbarButtonColor})
      }
      this.setState({showSnackbar: true, snackbarDuration: duration, snackbarMessage: message}, () => {
        if (this.state.showSnackbar) {
          snackbarTimeout = setTimeout(() => {
            this.toggleSnackbar()
          }, this.state.snackbarDuration + 1500)
        }
      })
    }
    else {
      this.setState({showSnackbar: false})
    }
  }

  loadingIndicatorChanged(method){
    clearTimeout(loadingIndicatorDestroyTimer)
    if (method === 'show') {
      this.setState({loadingIndicatorMethod: method, fadeAnimation: true})
    }
    else if (method === 'hide') {
      loadingIndicatorDestroyTimer = setTimeout(() => {
        this.setState({fadeAnimation: false})
        loadingIndicatorDestroyTimer = setTimeout(() => {
          this.setState({loadingIndicatorMethod: method})
        }, 150)
      }, 350)
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Fade visible={this.state.fadeAnimation}>
          {(this.state.loadingIndicatorMethod === 'hide') ?
            null
          :
          <LoadingIndicator
            loadingStatus={this.state.loadingIndicatorMethod}
            />
          }
        </Fade>
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
