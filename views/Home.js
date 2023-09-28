import React, { useContext, useState } from 'react';
import { Layout, Text, Button, Input} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import Upload from './Upload';
import List from '../components/List';
import {Search} from '../components/Search';
import {useMedia} from '../hooks/ApiHooks';
import { MainContext } from '../contexts/MainContext'; // Import your MainContext



const Home = ({ navigation}) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Add state for search results
  const {mediaArray} = useMedia(update);
  const { update } = useContext(MainContext);


  const toggleUploadModal = () => {
    setUploadModalVisible(!uploadModalVisible);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const performSearch = () => {
    // If there is no text in the search input, don't filter the mediaArray
    if (searchText === '') {
      setSearchResults([]);
      return;
    }

    // Implement the search logic here
    const results = mediaArray.filter((media) =>
      media.title.toLowerCase().includes(searchText.toLowerCase()) ||
      media.description.toLowerCase().includes(searchText.toLowerCase())
    );

    // Update the search results state
    setSearchResults(results);
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Input
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearchTextChange}
        onSubmitEditing={performSearch}
        style={{ marginTop: 16, marginHorizontal: 16 }}
      />

      <Text category="h1">HOME</Text>

      <Button
        onPress={toggleUploadModal}
        style={{ width: '90%', alignSelf: 'center', marginVertical: 8 }}
      >
        Make a post
      </Button>
      {/* Render the Upload component inside a modal */}
      {uploadModalVisible && (
        <Upload
          visible={uploadModalVisible}
          onClose={toggleUploadModal}
          navigation={navigation}
        />
      )}

      {/* Render the List component based on searchResults */}
      <List
        navigation={navigation}
        myFilesOnly={false}
        searchText={searchText}
        mediaArray={searchResults !== null ? searchResults : mediaArray}
      />
    </Layout>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
