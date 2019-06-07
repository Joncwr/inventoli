import React, { Component } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class LoadingIndicator extends Component {
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4c4c4c" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.2)',
  },
  loadingContainer: {
    height: 60,
    width: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.9)',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
