import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/app-config';
import {
  Avatar,
  Button,
  ListItem as KittenListItem,
} from '@ui-kitten/components';

const ListItem = ({singleMedia, navigation, userId}) => {
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
              appearance={'outline'}
              onPress={modifyFile}
              style={{borderRadius: 15, marginRight: 5}}
              status="info"
              size="medium"
            >
              Modify
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
