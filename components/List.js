import React, { useContext, useEffect, useState } from 'react';
import { List as KittenList } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { useFavourite, useMedia } from '../hooks/ApiHooks';
import { MainContext } from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const List = React.memo(({ navigation, myFilesOnly, filterMyFiles }) => {
  const { update, user } = useContext(MainContext);
  const { mediaArray } = useMedia(update, myFilesOnly);
  const { getFavouritesByToken } = useFavourite();

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
    // Update favourites every 3 seconds
    const intervalId = setInterval(fetchFavourites, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (filterMyFiles) {
      setUsableData(mediaArray);
    } else {
      const filteredMediaArray = mediaArray.filter((item) => {
        return favouriteMedia
          .map((favorite) => favorite.file_id)
          .includes(item.file_id);
      });
      setUsableData(filteredMediaArray);
    }
  }, [filterMyFiles, mediaArray, favouriteMedia]);

  return (
    <KittenList
      data={usableData}
      renderItem={({ item }) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          userId={user.user_id}
        />
      )}
    />
  );
});

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
