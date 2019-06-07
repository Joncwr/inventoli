import React, { Component } from 'react'
import { View, Platform, StyleSheet, Animated, Easing, Image, TouchableOpacity, Text } from 'react-native'
import Animation from 'lottie-react-native'

let loadingStripImages = [
  require('../../../assets/img/loading_strip1.png'),
  require('../../../assets/img/loading_strip2.png'),
  require('../../../assets/img/loading_strip3.png')
]
let cardFlipInterval

export default class NoCardLinked extends Component {
  constructor(){
    super()

    this.state = {
      frontInterpolate: new Animated.Value(0),
      backInterpolate: new Animated.Value(0),
      loadingStripIndexFront: 0,
      loadingStripIndexBack: 1,
      isFacingFront: false,
      loadingStripTranslateValue: new Animated.Value(0),
    }
  }

  componentDidMount() {
    this.flipCard()
    if (Platform.OS === 'ios') {
      cardFlipInterval = setInterval(() => {
        if (this.state.isFacingFront) {
          this.setState({loadingStripIndexBack: this.nextIndex(this.state.loadingStripIndexBack)})
        }
        else {
          this.setState({loadingStripIndexFront: this.nextIndex(this.state.loadingStripIndexFront)})
        }
        this.setState({isFacingFront: !this.state.isFacingFront})
      }, 1000)
    }
  }

  nextIndex(currentIndex){
    let i = currentIndex + 2
    if (i > 2) {
      return i%3
    }
    else {
      return i
    }
  }

  componentWillUnmount() {
    clearInterval(cardFlipInterval)
  }

  flipCard() {
    if (Platform.OS === 'ios') {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.frontInterpolate, {
            toValue: 180,
            duration: 800
          }),
          Animated.timing(this.state.backInterpolate, {
            toValue: 180,
            duration: 800
          })
        ]),
        Animated.parallel([
          Animated.timing(this.state.frontInterpolate, {
            toValue: 0,
            duration: 800
          }),
          Animated.timing(this.state.backInterpolate, {
            toValue: 0,
            duration: 800
          })
        ]),
      ]).start(() => {
        this.flipCard()
      })
    }
    else {
      Animated.sequence([
        Animated.timing(this.state.frontInterpolate, {
          toValue: 90,
          duration: 400,
          easing: Easing.linear
        }),
        Animated.timing(this.state.loadingStripTranslateValue, {
          toValue: 1,
          duration: 1,
          easing: Easing.linear
        }),
        Animated.timing(this.state.frontInterpolate, {
          toValue: 270,
          duration: 800,
          easing: Easing.linear
        }),
        Animated.timing(this.state.loadingStripTranslateValue, {
          toValue: 2,
          duration: 1,
          easing: Easing.linear
        }),
        Animated.timing(this.state.frontInterpolate, {
          toValue: 450,
          duration: 800,
          easing: Easing.linear
        }),
        Animated.timing(this.state.loadingStripTranslateValue, {
          toValue: 0,
          duration: 1,
          easing: Easing.linear
        }),
        Animated.timing(this.state.frontInterpolate, {
          toValue: 540,
          duration: 400,
          easing: Easing.linear
        }),
        Animated.timing(this.state.frontInterpolate, {
          toValue: 0,
          duration: 1
        }),
      ]).start(() => {
        this.flipCard()
      })
    }
  }

  render() {
    let frontInterpolate = '0deg'
    let backInterpolate = '0deg'
    let androidTranslate = 0
    if (Platform.OS === 'android') {
      frontInterpolate = this.state.frontInterpolate.interpolate({
        inputRange: [0, 540],
        outputRange: ['0deg', '540deg'],
      })
      androidTranslate = this.state.loadingStripTranslateValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, -80, -160],
      })
    }
    if (Platform.OS === 'ios') {
      frontInterpolate = this.state.frontInterpolate.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
      })
      backInterpolate = this.state.backInterpolate.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
      })
    }
    const frontAnimatedStyle = {
      transform: [
        { rotateY: frontInterpolate}
      ]
    }
    const backAnimatedStyle = {
      transform: [
        { rotateY: backInterpolate}
      ]
    }
    const androidTranslateX = {
      transform: [
        { translateX: androidTranslate}
      ]
    }

    return (
      <View style={styles.loadingIndicatorContainer} pointerEvents="none">
        <View style={{height: 80, width: 80}}>
          {(this.props.loadingStatus === 'show') ?
            <View>
              {(Platform.OS === 'ios') ?
                <View>
                  <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                    <Image
                      source={ loadingStripImages[this.state.loadingStripIndexFront] }
                      key={this.state.loadingStripIndexFront}
                      style={styles.loadingstrip}
                    />
                  </Animated.View>
                  <Animated.View style={[styles.flipCardBack, backAnimatedStyle]}>
                    <Image
                      source={ loadingStripImages[this.state.loadingStripIndexBack] }
                      key={this.state.loadingStripIndexBack}
                      style={styles.loadingstrip}
                    />
                  </Animated.View>
                </View>
                :
                <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                  <Animated.Image
                    source={ require('../../../assets/img/loading_strip.png') }
                    key={this.state.loadingStripTranslateValue._value}
                    style={[styles.loadingstrip, androidTranslateX]}
                  />
                </Animated.View>
              }
            </View>
            :
            <View style={styles.retryCard}>
              <TouchableOpacity style={styles.retryCardButton} onPress={() => this.props.retryFunction()}>
                <Image
                  source={ require('../../../assets/img/icon_refresh.png') }
                  style={styles.refreshIcon}
                />
                <Text style={styles.retryCardText}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  loadingIndicatorContainer: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    height: '100%',
    width: '100%',
  },
  flipCard: {
    position: 'absolute',
    width: 80,
    height: 80,
    backfaceVisibility: 'hidden',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: .08,
    shadowRadius: 6,
    ...Platform.select({
      android: {
        borderWidth: 1,
        borderColor: '#f1f1f1',
      },
    }),
  },
  flipCardBack: {
    position: 'absolute',
    width: 80,
    height: 80,
    backfaceVisibility: 'hidden',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: .08,
    shadowRadius: 6,
  },
  loadingstrip: {
    height: '100%',
    width: (Platform.OS === 'ios') ? '100%' : 240,
  },
  retryCard: {
    position: 'absolute',
    width: 80,
    height: 80,
    backfaceVisibility: 'hidden',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: .08,
    shadowRadius: 6,
    ...Platform.select({
      android: {
        borderWidth: 1,
        borderColor: '#f1f1f1',
      },
    }),
  },
  retryCardButton: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    height: '60%',
    width: '60%',
    opacity: .8,
    tintColor: 'orange',
  },
  retryCardText: {
    fontWeight: 'bold',
    color: 'orange'
  }
});
