import React, { useState, useEffect, useMemo, useRef } from 'react';
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

const SwipeCards = () => {
  const { mediaArray } = useMedia();
  // Initialize the index to keep track of the currently displayed card
  const [index, setIndex] = useState(0);
  const numMedia = mediaArray.length;

  const translateX = useMemo(() => new Animated.Value(0), []);
   // for tracking swipes right
  const swipesRef = useRef(0);
  // rotating card when swiping left/right
  const rotate = translateX.interpolate({
    inputRange: [-width / 2, width / 2],
    outputRange: ['-30deg', '30deg'],
    extrapolate: 'clamp',
  });

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );
  // Handle the swipe gesture
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
          // Increment the index and cycle back to 0 if at the end
          setIndex((prevIndex) => (prevIndex + 1) % numMedia);
          translateX.setValue(0);
          swipesRef.current += 1;
          console.log('swipe right', swipesRef);
        });
      } else if (translationX < -width / 2 || velocityX < -800) {
        // Swipe left
        Animated.timing(translateX, {
          toValue: -width,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setIndex((prevIndex) => (prevIndex + 1) % numMedia);
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
    if (mediaArray.length === 0) {
      setIndex(0);
    }
  }, [mediaArray]);

  const currentMedia = useMemo(() => mediaArray[index] || {}, [mediaArray, index]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleSwipe}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX },
                { rotate },
              ],
            },
          ]}
        >
          <Image
            source={{ uri: mediaUrl + currentMedia.filename }}
            style={styles.image}
            resizeMode="cover"
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
    height: '50%',
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
  singleMedia: PropTypes.object,
};

export default SwipeCards;
