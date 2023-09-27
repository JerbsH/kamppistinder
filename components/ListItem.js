import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/app-config';
import {Alert} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {Avatar, Button, List, ListItem as KittenListItem} from '@ui-kitten/components';

const ListItem = ({singleMedia, navigation, userId}) => {
  const {deleteMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const deleteFile = async () => {
    Alert.alert('Delete', `file id: ${singleMedia.file_id}, Are your sure?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: async () => {
          console.log('deleting file', singleMedia.file_id);
          try {
            const token = await AsyncStorage.getItem('userToken');
            const result = await deleteMedia(singleMedia.file_id, token);
            console.log('deleteFile()', result.message);
            // update view after deleting a file
            setUpdate(!update);
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  const modifyFile = async () => {
    console.log('modifying file', singleMedia.file_id);
    navigation.navigate('Modify file', singleMedia);
  };

  return (
    <List
      onPress={() => {
        console.log('touched!', singleMedia.title);
        navigation.navigate('Single', singleMedia);
      }}
    >
      <Avatar
        size="large"
        source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
      ></Avatar>
      <KittenListItem.Title>{singleMedia.title}</KittenListItem.Title>
      <KittenListItem.Subtitle numberOfLines={3}>
        {singleMedia.description}
      </KittenListItem.Subtitle>
      {singleMedia.user_id == userId && (
        <>
          <Button size="sm" onPress={modifyFile}>
            Modify
          </Button>
          <Button size="sm" onPress={deleteFile} color={'error'}>
            Delete
          </Button>
        </>
      )}
    </List>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  userId: PropTypes.number,
};

export default ListItem;
