import React, {useEffect, useState } from 'react';
import { Layout, Text, Button, Card, Input } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import Upload from './Upload';
import List from '../components/List';
import { useMedia } from '../hooks/ApiHooks';
import { Search } from '../components/Search';

const Home = ({ navigation }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [shouldCloseUpload, setShouldCloseUpload] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [searchText, setSearchText] = useState('');
  const { mediaArray } = useMedia();

  const toggleUploadModal = () => {
    setUploadModalVisible(!uploadModalVisible);
  };

  const uploadSuccessCallback = () => {
    setShouldCloseUpload(true);
  };

  useEffect(() => {
    if (shouldCloseUpload) {
      setUploadModalVisible(false);
      setShouldCloseUpload(false);
    }
  }, [shouldCloseUpload]);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const performSearch = () => {
    if (searchText === '') {
      setSearchResults([]);
      return;
    }

    const results = mediaArray.filter(
      (media) =>
        media.title.toLowerCase().includes(searchText.toLowerCase()) ||
        media.description.toLowerCase().includes(searchText.toLowerCase())
    );

    setSearchResults(results);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <Input
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearchTextChange}
        onSubmitEditing={performSearch}
        style={{ marginHorizontal: 16 }}
      />
      <Layout
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          marginHorizontal: 16, // Add margin for spacing
        }}
      >
        <Button onPress={toggleUploadModal} style={{ flex: 1, marginHorizontal: 5 }}>
          Make a post
        </Button>

        <Button
          style={{ flex: 1, marginHorizontal: 5 }}
          onPress={() => {
            navigation.navigate('My files');
          }}
        >
          My Files
        </Button>
      </Layout>
      {uploadModalVisible && (
        <Upload
          visible={uploadModalVisible}
          onClose={toggleUploadModal}
          navigation={navigation}
          onSuccess={uploadSuccessCallback}
        />
      )}
      {searchResults.map((media) => (
        <Card key={media.id}>
          <Text>{media.title}</Text>
          <Text>{media.description}</Text>
        </Card>
      ))}
      <List/>
    </Layout>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
