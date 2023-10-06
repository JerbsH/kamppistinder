import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Text, Button, Card, Input, Avatar } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import Upload from './Upload';
import List from '../components/List';
import { useMedia } from '../hooks/ApiHooks';
import { mediaUrl } from '../utils/app-config';
import { ScrollView } from 'react-native';
import MapPicker from '../components/MapPicker';

const Home = ({ navigation }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [shouldCloseUpload, setShouldCloseUpload] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { mediaArray } = useMedia();
  const [showList, setShowList] = useState(true);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);

  const toggleUploadModal = () => {
    setUploadModalVisible((prevVisible) => !prevVisible);
  };

  const uploadSuccessCallback = () => {
    setShouldCloseUpload(true);
  };

  useEffect(() => {
    if (shouldCloseUpload) {
      setUploadModalVisible(false);
      setShouldCloseUpload(false);
      // setUploadSuccess(true);
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

  const handleLocationSelect = useCallback((coordinate) => {
    setSelectedCoordinate(coordinate);
    console.log('Storing Coordinates:', coordinate);
  }, []);

  return (
    <Layout style={{ flex: 1 }}>
      <MapPicker onLocationSelect={handleLocationSelect} />
      <Layout
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          marginHorizontal: 16,
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
      <Input
        style={{ borderWidth: 1, padding: 8 }}
        placeholder="Search..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {showList ? (
        <List navigation={navigation} />
      ) : (
        <ScrollView>
          {searchResults.map((item) => (
            <Card key={item.file_id}>
              <Avatar source={{ uri: mediaUrl + item.filename }} />
              <Text>{item.title}</Text>
              <Text>
                {item.description.length > 100
                  ? item.description.slice(0, 100) + '...'
                  : item.description}
              </Text>
            </Card>
          ))}
        </ScrollView>
      )}
    </Layout>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
