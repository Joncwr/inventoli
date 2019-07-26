import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity ,Image } from 'react-native'

import ObjectHelper from '../../../common/helpers/ObjectHelper'

export default class InventoryItem extends Component {
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

  renderOwner() {
    if (!ObjectHelper.isEmpty(this.props.data.owner)) {
      return this.props.data.owner.name
    }
    else {
      return 'No one'
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
            <Text style={{fontWeight: '500', fontSize: 10}} numberOfLines={1} ellipsizeMode='tail'>
              {data.category}
            </Text>
          </View>
        )
      })

      return renderCategories
    }
  }

  redirect() {
    let { container_id } = this.props.data
    this.props.navigation.navigate('Scan', {containerId: container_id})
  }

  render() {
    return (
      <TouchableOpacity onPress={this.redirect.bind(this)} activeOpacity={.7} style={styles.container}>
        <View style={[styles.subContainers, {backgroundColor: 'rgba(0,0,0,.01)', paddingVertical: 2, paddingHorizontal: 15}]}>
          <View style={styles.textContainer}>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode='tail'>
            </Text>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode='tail'>
             {this.renderOwner()}s Item
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
      </TouchableOpacity>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 5,
    marginBottom: 5,
    justifyContent: 'center',
    elevation: 2,
  },
  subContainers: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  subContainersNoRow: {
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  label: {
    marginLeft: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  certaintyText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  certainty: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-end',
  },
  categoryItem: {
    height: 16,
    marginHorizontal: 2.5,
    marginVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 15,
    justifyContent: 'center',
  },
  description: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  header: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemMain: {
    flex: 1,
    marginLeft: 3,
    marginTop: 1,
    height: '100%',
    justifyContent: 'center',
  },
})
