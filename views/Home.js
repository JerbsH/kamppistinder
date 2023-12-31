import React, {useEffect, useState} from 'react';
import {Layout, Text, Button, Card, Input, Avatar} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import Upload from './Upload';
import List from '../components/List';
import {useMedia} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/app-config';
import {ScrollView} from 'react-native';

const Home = ({navigation}) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [shouldCloseUpload, setShouldCloseUpload] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const {mediaArray} = useMedia();
  const [showList, setShowList] = useState(true);

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

  // handle searching for files
  useEffect(() => {
    if (searchQuery !== '') {
      const results = mediaArray.filter(
        (media) =>
          media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          media.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(results);
      setShowList(false);
    } else {
      setShowList(true);
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
          appearance={'outline'}
          status="success"
          onPress={toggleUploadModal}
          style={{flex: 1, marginHorizontal: 5}}
        >
          Make a post
        </Button>
        <Button
          appearance={'outline'}
          status="info"
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
        <List navigation={navigation} />
      ) : (
        <ScrollView>
          {searchResults.map((item) => (
            <Card key={item.file_id}>
              <Avatar source={{uri: mediaUrl + item.filename}} />
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
