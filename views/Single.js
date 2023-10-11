import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Button, Card, Text} from '@ui-kitten/components';
import {Divider, Image} from 'react-native-elements';
import Toast from 'react-native-toast-message';

const Single = ({route, navigation}) => {
  const [owner, setOwner] = useState({});
  const [userLike, setUserLike] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const {user} = useContext(MainContext);
  const {getUserById} = useUser();
  const {postFavourite, getFavouritesById, deleteFavourite} = useFavourite();
  const [likes, setLikes] = useState([]);
  const {update, setUpdate} = useContext(MainContext);

  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    user_id: userId,
    file_id: fileId,
  } = route.params;

  // fetch owner info
  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const ownerData = await getUserById(userId, token);
      setOwner(ownerData);
    } catch (error) {
      console.error(error.message);
    }
  };

  // delete favourite
  const removeFavourite = async () => {
    if (userLike === false) {
      setButtonDisabled(true);
    } else {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await deleteFavourite(fileId, token);
        response && setUserLike(false);
        Toast.show({
          text1: 'Like removed! Returning to My Likes...',
        });
        setUpdate(!update);
        setTimeout(() => {
          navigation.goBack();
        }, 2500);
        setButtonDisabled(true);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  // get favouritesbyid
  const fetchLikes = async () => {
    try {
      const likesData = await getFavouritesById(fileId);
      setLikes(likesData);
      // check if userid stored in context is in likesData
      likesData.forEach((like) => {
        if (like.user_id === user.user_id) {
          setUserLike(true);
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  const date = new Date(timeAdded);
  // Show full image and metadata
  return (
    <Card>
      <Image
        source={{uri: mediaUrl + filename}}
        resizeMode="cover"
        style={{height: 300, marginBottom: 10, borderRadius: 15}}
      />
      <Text category="h2" style={{marginVertical: 10}}>
        {title}
      </Text>
      <Text style={{marginBottom: 10}}>{description}</Text>
      <Divider />
      <Text>Time added: {date.toDateString()}</Text>
      <Text>Added by: {owner.full_name}</Text>
      <Button
        appearance="outline"
        onPress={() => {
          navigation.navigate('Comments', route.params);
        }}
        style={{marginVertical: 10}}
      >
        Start Chatting
      </Button>
      <Toast />
      <Button
        appearance="outline"
        status="danger"
        onPress={removeFavourite}
        disabled={buttonDisabled}
        style={{marginVertical: 10}}
      >
        Remove like
      </Button>
    </Card>
  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Single;
