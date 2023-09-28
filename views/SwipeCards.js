import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions, Text, View, Image } from 'react-native';
import {
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { useMedia } from '../hooks/ApiHooks';
import { mediaUrl } from '../utils/app-config';

const { width } = Dimensions.get('window');

const SwipeCards = ({ singleMedia = {} }) => {
  const [index, setIndex] = useState(0);
  const { mediaArray } = useMedia();

  const translateX = useRef(new Animated.Value(0)).current;

  const handleSwipe = ({ nativeEvent }) => {
    const { state, translationX, velocityX } = nativeEvent;
    if (state === State.END) {
      if (translationX > width / 2 || velocityX > 800) {
        // Swipe right
        Animated.timing(translateX, {
          toValue: width,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setIndex(index + 1);
          translateX.setValue(0);
        });
      } else if (translationX < -width / 2 || velocityX < -800) {
        // Swipe left
        Animated.timing(translateX, {
          toValue: -width,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setIndex(index + 1);
          translateX.setValue(0);
        });
      } else {
        // Reset if the swipe didn't meet the threshold
        Animated.spring(translateX, {
          toValue: 0,
          stiffness: 200,
          damping: 20,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  useEffect(() => {
    // Reset index when mediaArray changes
    setIndex(0);
  }, [mediaArray]);

  // Check if currentMedia exists in mediaArray, otherwise, use an empty object
  const currentMedia = mediaArray[index] || {};

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={Animated.event(
          [{ nativeEvent: { translationX: translateX } }],
          { useNativeDriver: true }
        )}
        onHandlerStateChange={handleSwipe}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <Image
            source={{ uri: mediaUrl + currentMedia.filename }}
            style={styles.image}
            resizeMode="cover" // Change this to "cover" to fill 50% of the card
          />
          <View style={styles.cardContent}>
            <Text style={styles.title}>{currentMedia.title}</Text>
            <Text style={styles.description}>{currentMedia.description}</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: '75%',
    height: '75%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '50%', // Adjust this to control the image height
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
});

SwipeCards.propTypes = {
  navigation: PropTypes.object,
  singleMedia: PropTypes.object, // Define the prop type for singleMedia
};

export default SwipeCards;
