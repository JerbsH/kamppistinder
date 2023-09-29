import React, {useEffect, useState} from 'react';
import {Layout, Text, Button, Card, Input, Avatar} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import Upload from './Upload';
import List from '../components/List';
import {useMedia} from '../hooks/ApiHooks';
import { mediaUrl } from '../utils/app-config';

const Home = ({navigation}) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [shouldCloseUpload, setShouldCloseUpload] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const {mediaArray} = useMedia();
  const [showList, setShowList] = useState(true); // Track when to show the list

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

  useEffect(() => {
    if (searchQuery !== '') {
      const results = mediaArray.filter(
        (media) =>
          media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          media.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(results);
      setShowList(false); // Hide the list when search is active
    } else {
      setShowList(true); // Show the list when no search is performed
    }
  }, [searchQuery, mediaArray]);

  return (
    <Layout style={{flex: 1}}>
      <Layout
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          marginHorizontal: 16,
        }}
      >
        <Button
          onPress={toggleUploadModal}
          style={{flex: 1, marginHorizontal: 5}}
        >
          Make a post
        </Button>
        <Button
          style={{flex: 1, marginHorizontal: 5}}
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
      <Input
        style={{borderWidth: 1, padding: 8}}
        placeholder="Search..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {showList ? (
        <List />
      ) : (
        searchResults.map((media) => (
            <Card key={media.id}>
              <Avatar source={{uri: mediaUrl + media.thumbnails.w160}} />
              <Text>{media.title}</Text>
              <Text>{media.description}</Text>
            </Card>
        ))
      )}
    </Layout>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
