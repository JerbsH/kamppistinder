import {Button, Layout , Text} from '@ui-kitten/components';
import { PropTypes } from 'prop-types';
import { useContext } from 'react';
import { MainContext } from '../contexts/MainContext';

const Profile = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);

  const logOut = () => {
    setIsLoggedIn(false);
  };
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Profile</Text>
      <Button onPress={logOut}>Logout</Button>
    </Layout>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
