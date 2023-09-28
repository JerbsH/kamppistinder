import { List as KittenList} from '@ui-kitten/components';
import ListItem from './ListItem';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation, myFilesOnly}) => {
  const {update, user} = useContext(MainContext);
  const {mediaArray} = useMedia(update, myFilesOnly);

  return (
    <KittenList
      data={mediaArray}
      renderItem={({item}) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          userId={user.user_id}
        />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
