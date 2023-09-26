import {Image} from 'react-native';
import {Button, Card, Layout , Text} from '@ui-kitten/components';
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
      <Card
        style={{
          backgroundColor: '#ffa575',
          width: '90%',
          height: '80%',
          borderRadius: 15,
          alignItems: 'center',
        }}
      >
        <Image
          source={{uri: 'http://placekitten.com/640'}}
          style={{
            width: 250,
            height: 150,
            borderRadius: 15,
            resizeMode: 'cover',
          }}
        ></Image>
        <Text category="h3" style={{textAlign: 'center'}}>
          NAME
        </Text>
        <Card
          style={{
            borderRadius: 15,
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 50,
          }}
        >
          <Text style={{textAlign: 'center'}}>username</Text>
          <Text style={{textAlign: 'center'}}>email</Text>
        </Card>

        <Button style={{borderRadius: 15, marginBottom: 5}}>Edit profile</Button>
        <Button style={{borderRadius: 15}}>Log out</Button>
      </Card>
    </Layout>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
