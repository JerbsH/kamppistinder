import {Button, Layout, Text, Divider} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {useContext, useState, useEffect} from 'react';
import {MainContext} from '../contexts/MainContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserByToken(token);
      console.log('token', token);
      console.log('userdata', userData);
      if (userData) {
        setIsLoggedIn(true);
        setUser(userData);
      }
    } catch (error) {
      console.log('checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  
  const showLoginForm = () => {
    setIsLoginFormVisible(true);
    setIsRegisterFormVisible(false);
  };
  const showRegisterForm = () => {
    setIsLoginFormVisible(false);
    setIsRegisterFormVisible(true);
  };

  const buttonStyle = {
    width: '40%',
  };

  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button onPress={showLoginForm} style={buttonStyle} size="large">
        Login
      </Button>
      <Divider style={{height: '20%'}}></Divider>
      <Button onPress={showRegisterForm} style={buttonStyle} size="large">
        Or Register?
      </Button>
      {/* Render the LoginForm as a modal */}
      {isLoginFormVisible && (
        <LoginForm
          visible={isLoginFormVisible}
          onClose={() => setIsLoginFormVisible(false)}
        />
      )}
      {/* Render the RegisterForm as a modal */}
      {isRegisterFormVisible && (
        <RegisterForm
          setToggleRegister={() => setIsRegisterFormVisible(false)}
          visible={isRegisterFormVisible}
          onClose={() => setIsRegisterFormVisible(false)}
        />
      )}
    </Layout>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
