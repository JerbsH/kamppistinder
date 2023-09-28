import React, { useState } from 'react';
import { Layout, Text, Button} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import Upload from './Upload';

const Home = ({ navigation }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const toggleUploadModal = () => {
    setUploadModalVisible(!uploadModalVisible);
  };

  return (

    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
        navigation={navigation} />
      )}
    </Layout>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
