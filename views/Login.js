import {Button, Layout} from '@ui-kitten/components';
import {useContext, useState, useEffect} from 'react';
import {MainContext} from '../contexts/MainContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {ImageBackground} from 'react-native';

const Login = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);
  const [shouldCloseRegisterForm, setShouldCloseRegisterForm] = useState(false);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserByToken(token);
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

  const registerSuccessCallback = () => {
    setIsRegisterFormVisible(false);
  };
  useEffect(() => {
    if (shouldCloseRegisterForm) {
      setIsRegisterFormVisible(false);
      setShouldCloseRegisterForm(false);
    }
  }, [shouldCloseRegisterForm]);

  return (
    <ImageBackground
      source={require('../assets/logo.jpg')}
      style={{flex: 1, justifyContent: 'center'}}
    >
      <Layout
        style={{
          paddingTop: '47%',
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          onPress={showLoginForm}
          status="success"
          style={{
            width: '35%',
            marginBottom: '2%',
          }}
        >
          Login
        </Button>

        <Button
          onPress={showRegisterForm}
          status="info"
          style={{
            width: '35%',
          }}
        >
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
            onSuccess={registerSuccessCallback}
          />
        )}
      </Layout>
    </ImageBackground>
  );
};

export default Login;
