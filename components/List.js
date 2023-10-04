//import {List as KittenList} from '@ui-kitten/components';
import { FlatList } from 'react-native';
import ListItem from './ListItem';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';

const List = React.memo(({navigation, myFilesOnly, selectedCity}) => {
  const {update, user} = useContext(MainContext);
  const {mediaArray} = useMedia(update, myFilesOnly);
  console.log('List navi: ', navigation);

  return (
    <FlatList
      data={mediaArray}
      renderItem={({item}) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          userId={user.user_id}
          selectedCity={selectedCity}
        />
      )}
    />
  );
});

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  selectedCity: PropTypes.string,
};

export default List;
