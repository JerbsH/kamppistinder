import {Button, Layout, Text} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { MainContext } from '../contexts/MainContext';
import LoginForm from '../components/LoginForm';

const Login = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false); // Add this state

  const showLoginForm = () => {
    setIsLoginFormVisible(true);
  };
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Login</Text>
      <Button onPress={showLoginForm}>Login</Button>
      {/* Render the LoginForm as a modal */}
      {isLoginFormVisible && (
        <LoginForm
          visible={isLoginFormVisible}
          onClose={() => setIsLoginFormVisible(false)}
        />
      )}
    </Layout>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
