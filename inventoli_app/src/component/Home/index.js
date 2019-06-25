import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import StorageApi from '../../services/storage/StorageApi'
import ObjectHelper from '../../common/helpers/ObjectHelper'


export default class Home extends Component {
  constructor(){
    super()

    this.state = {
      tag: '',
      container: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.screenProps.tag !== this.state.tag) {
      this.setState({tag: this.props.screenProps.tag}, () => {
        console.log(this.state.tag);
        StorageApi.getContainer(this.state.tag.id)
        .then(res => {
          this.setState({container: res})
        })
        .catch(err => console.log(err))
      })
    }
  }

  renderTag() {
    if (this.props.screenProps.tag !== {}) {
      return (
        <Text numberOfLines={1} ellipsizeMode='tail'>
          Tag ID is - {this.state.tag.id}
        </Text>
      )
    }
  }

  test() {
    if (!ObjectHelper.isEmpty(this.state.container)) {
      console.log(this.state.container);
      let { items } = this.state.container
      let renderItems = []
      items.forEach((data, index) => {
        console.log(data);
        let categories = []
        data.categories.forEach(data => {
          categories.push(data.category)
        })
        renderItems.push(
          <View key={index} style={{marginVertical: 20}}>
            <Text numberOfLines={1} ellipsizeMode='tail'>
              Item Certainty: {data.certainty}
            </Text>
            <Text numberOfLines={1} ellipsizeMode='tail'>
              Item Description: {data.description}
            </Text>
            <Text numberOfLines={1} ellipsizeMode='tail'>
              Item categories: {categories}
            </Text>
          </View>
        )
      })
      return (
        <View>
          {renderItems}
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Hold the tag behind the phone!</Text>
        {this.renderTag()}
        {this.test()}
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
