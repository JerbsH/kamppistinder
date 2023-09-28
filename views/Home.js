import React, {useEffect, useState} from 'react';
import {Layout, Text, Button} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import Upload from './Upload';
import List from '../components/List';

const Home = ({navigation}) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [shouldCloseUpload, setShouldCloseUpload] = useState(false);

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

  return (
    // style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    <Layout>
      <Button
        onPress={toggleUploadModal}
        style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
      >
        Make a post
      </Button>

      <Button
        style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
        onPress={() => {
          navigation.navigate('My files');
        }}
      >
        My Files
      </Button>
      {/* Render the Upload component inside a modal */}
      {uploadModalVisible && (
        <Upload
          visible={uploadModalVisible}
          onClose={toggleUploadModal}
          navigation={navigation}
          onSuccess={uploadSuccessCallback}
        />
      )}
      <List />
    </Layout>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
