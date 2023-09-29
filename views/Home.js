import React, {useEffect, useState} from 'react';
import {Layout, Text, Button, Card} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import Upload from './Upload';
import List from '../components/List';

const Home = ({navigation}) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [shouldCloseUpload, setShouldCloseUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
      setUploadSuccess(true);
    }
  }, [shouldCloseUpload]);

  useEffect(() => {
    if (uploadSuccess) {
      setUploadSuccess(false);
    }
  }, [uploadSuccess]);


  return (
    // style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    <Layout style={{flex: 1}}>
      <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
        <Button
          onPress={toggleUploadModal}
          style={{ flex: 1, marginHorizontal: 5 }}
        >
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
