import {Button, Layout, Text} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';

const Login = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);

  const login = () => {
    setIsLoggedIn(true);
  };
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Login</Text>
      <Button onPress={login}>Login</Button>
    </Layout>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
