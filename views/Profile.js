import {Button, Card, Icon, Layout, Text} from '@ui-kitten/components';
import {PropTypes} from 'prop-types';
import {Image} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/app-config';
import ModifyForm from '../components/ModifyForm';

const Profile = ({navigation}) => {
  const [isModifyVisible, setIsModifyVisible] = useState(false);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user} = useContext(MainContext);

  // show modify user layout
  const showModify = () => {
    setIsModifyVisible(true);
  };

  // logout functionality for button
  const logOut = async () => {
    console.log('profile, logout');
    try {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  // avatar loading if user has avatar
  const loadAvatar = async () => {
    try {
      const avatars = await getFilesByTag('avatar_' + user.user_id);
      if (avatars.length > 0) {
        setAvatar(mediaUrl + avatars.pop().filename);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Card
        style={{
          backgroundColor: '#ffa575',
          width: '90%',
          height: '80%',
          borderRadius: 15,
          alignItems: 'center',
        }}
      >
        {/* Render the ModifyForm as a modal */}
        {isModifyVisible && (
          <ModifyForm
            visible={isModifyVisible}
            onClose={() => setIsModifyVisible(false)}
          />
        )}
        <Image
          source={{uri: avatar}}
          style={{
            width: 250,
            height: 200,
            borderRadius: 15,
            resizeMode: 'cover',

          }}
        ></Image>
        <Text category="h3" style={{textAlign: 'center', marginBottom: 5}}>
          {user.username}
        </Text>
        <Card
          style={{
            borderRadius: 15,
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 50,
            justifyContent: 'center',
          }}
        >
          <Layout
          style= {{
            flexDirection:'row',
            alignItems:'center',
          }}>
          <Icon
            name="person-outline"
            fill="#000"
            style={{width: 20, height: 20, marginRight: 5}}
          />
          <Text style={{textAlign: 'center'}}>Username: {user.username}</Text>
          </Layout>
          <Layout
          style= {{
            flexDirection:'row',
            alignItems:'center',
          }}>
          <Icon
            name="email-outline"
            fill="#000"
            style={{width: 20, height: 20, marginRight: 5}}
          />
          <Text style={{textAlign: 'center'}}>{user.email}</Text>
          </Layout>
        </Card>
        <Button
          style={{borderRadius: 15, marginBottom: 5}}
          onPress={showModify}
        >
          Edit profile
        </Button>
        <Button style={{borderRadius: 15}} onPress={logOut}>
          Log out
        </Button>
      </Card>
    </Layout>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
