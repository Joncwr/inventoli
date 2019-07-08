import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'

import ObjectHelper from '../../../common/helpers/ObjectHelper'

export default class ItemComponent extends Component {
  constructor(){
    super()

    this.state = {

    }
  }

  renderOwner() {
    if (!ObjectHelper.isEmpty(this.props.data.owner)) {
      return this.props.data.owner.name
    }
    else {
      return 'No one'
    }
  }

  certaintyColor(certainty) {
    if(certainty){
      switch (certainty) {
        case 'certain':
          return '#b3ffb3'
        case 'uncertain':
          return '#ff9999'
        case 'noclue':
          return '#ccf2ff'
        default:
          return 'lightgray'
      }
    }
  }

  renderCategories() {
    if (this.props.data.categories.length > 0) {
      let renderCategories = []

      this.props.data.categories.forEach((data, index) => {
        let color
        for (var key in this.props.categories) {
          if (this.props.categories.hasOwnProperty(key)) {
            if (this.props.categories[key].category === data.category) {
              color = this.props.categories[key].color
            }
          }
        }
        renderCategories.push(
          <View key={index} activeOpacity={0.7} style={[styles.categoryItem, {backgroundColor: color}]}>
            <Text style={{fontWeight: '500', fontSize: 14}} numberOfLines={1} ellipsizeMode='tail'>
              {data.category}
            </Text>
          </View>
        )
      })

      return renderCategories
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.subContainers, {backgroundColor: 'rgba(0,0,0,.01)', paddingVertical: 5, paddingHorizontal: 20}]}>
          <View style={styles.textContainer}>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode='tail'>
              {this.renderOwner()}
            </Text>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode='tail'>
             s Item
            </Text>
          </View>
          <View style={[styles.certainty, {backgroundColor: this.certaintyColor(this.props.data.certainty)}]}>
            <Text style={styles.certaintyText} numberOfLines={1} ellipsizeMode='tail'>
              {this.props.data.certainty}
            </Text>
          </View>
        </View>
        <View style={[styles.subContainers, {paddingHorizontal: 11}]}>
          {this.renderCategories()}
        </View>
        <View style={[styles.subContainersNoRow, {paddingHorizontal: 20}]}>
          <Text style={styles.header} numberOfLines={1} ellipsizeMode='tail'>
            Description:
          </Text>
          <Text style={styles.description} numberOfLines={1} ellipsizeMode='tail'>
          `{this.props.data.description}`
          </Text>
        </View>
        <View style={[styles.subContainersNoRow, {paddingHorizontal: 20}]}>
          <Text style={styles.header} numberOfLines={1} ellipsizeMode='tail'>
            Images:
          </Text>
          <Text numberOfLines={1} ellipsizeMode='tail'>
            Currently not supported.
          </Text>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    marginBottom: 5,
    justifyContent: 'center',
    elevation: 2,
  },
  subContainers: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  subContainersNoRow: {
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  certaintyText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  certainty: {
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
  },
  categoryItem: {
    height: 20,
    marginHorizontal: 2.5,
    marginVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 15,
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  header: {
    fontWeight: '500',
  }
})
