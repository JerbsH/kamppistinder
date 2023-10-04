//import {List as KittenList} from '@ui-kitten/components';
import {FlatList} from 'react-native';
import ListItem from './ListItem';
import {useFavourite, useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {List as KittenList} from '@ui-kitten/components';
import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const List = React.memo(
  ({navigation, myFilesOnly,filterMyFiles}) => {
    const {update, user} = useContext(MainContext);
    const {mediaArray} = useMedia(update, myFilesOnly);
    const {getFavouritesByToken} = useFavourite();

    const [favouriteMedia, setFavouriteMedia] = useState([]);
    const [usableData, setUsableData] = useState([]);

    const fetchFavourites = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const listOfFavourites = await getFavouritesByToken(token);
        setFavouriteMedia(listOfFavourites);
      } catch (error) {
        console.error(error.message);
      }
    };

    useEffect(() => {
      fetchFavourites();
    }, []);

    useEffect(() => {
      fetchFavourites();
      if (filterMyFiles) {
        setUsableData(mediaArray);
      } else {
        setUsableData(filteredMediaArray);
      }
    }, [update, favouriteMedia]);

    const filteredMediaArray = mediaArray.filter((item) => {
      return favouriteMedia
        .map((favorite) => favorite.file_id)
        .includes(item.file_id);
    });

    return (
      <KittenList
        data={usableData}
        renderItem={({item}) => (
          <ListItem
            navigation={navigation}
            singleMedia={item}
            userId={user.user_id}
          />
        )}
      />
    );
  },
);

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
