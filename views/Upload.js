import {Layout , Text} from '@ui-kitten/components';
import { PropTypes } from 'prop-types';

const Upload = ({navigation}) => {
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Upload</Text>
    </Layout>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
