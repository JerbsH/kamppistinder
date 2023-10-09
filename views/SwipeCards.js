import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Dimensions, Text, View, Image, TouchableOpacity } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { useFavourite, useMedia} from '../hooks/ApiHooks';
import { mediaUrl } from '../utils/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useContext } from 'react';
import { MainContext } from '../contexts/MainContext';

const { width } = Dimensions.get('window');

const SwipeCards = () => {
  const { mediaArray, loadMedia} = useMedia();
  const { user } = useContext(MainContext);

  const [myFilesOnly, setMyFilesOnly] = useState(false);
  const handleRefresh = async () => {
    console.log('Refreshing...');
    try {
      await loadMedia(myFilesOnly ? user.user_id : 0);

      setIndex(0);
      translateX.setValue(0);
      swipesRef.current = 0;
    } catch (error) {
      console.error('Refresh failed', error);
    }
  };

  const [index, setIndex] = useState(0);
  const numMedia = mediaArray.length;
  const translateX = useMemo(() => new Animated.Value(0), []);

  const swipesRef = useRef(0);
  const rotate = translateX.interpolate({
    inputRange: [-width / 2, width / 2],
    outputRange: ['-30deg', '30deg'],
    extrapolate: 'clamp',
  });

  const [userLike, setUserLike] = useState(false);
  const { postFavourite } = useFavourite();

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const handleSwipe = async ({ nativeEvent }) => {
    const { state, translationX, velocityX } = nativeEvent;
    if (state === State.END) {
      if (translationX > width / 2 || velocityX > 800) {
        // Swipe right
        const token = await AsyncStorage.getItem('userToken');
        try {
          await postFavourite({ file_id: currentMedia.file_id }, token);
          Toast.show({
            text1: 'Post Liked',
            topOffset: 10,
            visibilityTime: 1000,
          });
          setUserLike(true);
        } catch (error) {
          console.error(error.message);
        }

        Animated.timing(translateX, {
          toValue: width,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          const favouriteId = currentMedia.file_id;
          console.log('swipe right, fileId:', favouriteId);
          setIndex((prevIndex) => (prevIndex + 1) % numMedia);
          translateX.setValue(0);
          swipesRef.current += 1;
          console.log('swipe right', swipesRef);
        });
      } else if (translationX < -width / 2 || velocityX < -800) {
        // Swipe left
        Toast.show({
          type: 'error',
          text1: 'Post Disliked',
          topOffset: 10,
          visibilityTime: 1000,
        });
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
    if (notMyMedia.length === 0) {
      setIndex(0);
    }
  }, [notMyMedia]);

  const notMyMedia = mediaArray.filter(item => item.user_id !== user.user_id);

  const currentMedia = useMemo(() => notMyMedia[index] || {}, [notMyMedia, index]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Toast />

      <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>

      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleSwipe}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX }, { rotate }],
            },
          ]}
        >
          <Image
            source={{ uri: mediaUrl + currentMedia.filename }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.title}>
              {currentMedia.title && currentMedia.title.length > 20
                ? currentMedia.title.slice(0, 20) + '...'
                : currentMedia.title}
            </Text>
            <Text style={styles.description}>
              {currentMedia.description && currentMedia.description.length > 100
                ? currentMedia.description.slice(0, 100) + '...'
                : currentMedia.description}
            </Text>
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
    shadowOffset: {width: 0, height: 2},
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
  refreshButton: {
    backgroundColor: '#ffa575', // Example background color
    paddingVertical: 10, // Adjust the height of the button
    paddingHorizontal: 20, // Adjust the width of the button
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10, // Add some margin to create spacing
  },
  refreshButtonText: {
    color: 'black', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default SwipeCards;
