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
    filesize,
    media_type: mediaType,
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
          text1: 'Like removed!',
        });
        setUpdate(!update);
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
        resizeMode="center"
        style={{height: 300}}
      />
      <Text category="h2">{title}</Text>
      <Text>{description}</Text>
      <Text>Time added: {date.toDateString()}</Text>
      <Text>Added by: {owner.full_name}</Text>
      <Button
        onPress={() => {
          navigation.navigate('Chat');
        }}
        style={{marginBottom: 5}}
      >
        Start Chatting
      </Button>
      <Toast />
      <Button onPress={removeFavourite} disabled={buttonDisabled}>
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
