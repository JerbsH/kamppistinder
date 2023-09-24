import {Layout , Text} from '@ui-kitten/components';
import { PropTypes } from 'prop-types';

const Profile = ({navigation}) => {
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Profile</Text>
    </Layout>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
