import {Button, Layout , Text} from '@ui-kitten/components';
import { PropTypes } from 'prop-types';
import { useContext, useEffect } from 'react';
import { MainContext } from '../contexts/MainContext';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);

  const logOut = async () => {
    console.log('profile, logout');
    try {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
  }, []);
  return (
    <ScrollView>
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Profile</Text>
      <Button onPress={logOut}>Logout</Button>
    </Layout>
    </ScrollView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
