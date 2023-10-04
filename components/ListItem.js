import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/app-config';
import {Alert} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {
  Avatar,
  Button,
  ListItem as KittenListItem,
} from '@ui-kitten/components';

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
    <KittenListItem
      title={
        singleMedia.title.length > 20
          ? singleMedia.title.slice(0, 20) + '...'
          : singleMedia.title
      }
      description={
        singleMedia.description.length > 100
          ? singleMedia.description.slice(0, 100) + '...'
          : singleMedia.description
      }
      accessoryLeft={() => (
        <Avatar source={{uri: mediaUrl + singleMedia.thumbnails.w160}} />
      )}
      onPress={() => {
        console.log('touched!', singleMedia.title);
        navigation.navigate('Single', singleMedia);
      }}
      accessoryRight={() =>
        userId === singleMedia.user_id && (
          <>
            <Button
              onPress={modifyFile}
              style={{borderRadius: 15, marginRight: 5}}
              status="info"
              size="medium"
            >
              Modify
            </Button>
            <Button
              onPress={deleteFile}
              style={{borderRadius: 15, marginRight: 5}}
              status="danger"
              size="medium"
            >
              Delete
            </Button>
          </>
        )
      }
    />
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  userId: PropTypes.number,
};

export default ListItem;
