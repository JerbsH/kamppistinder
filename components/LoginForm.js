import {Modal, Text, Button, Card, Input, Layout} from '@ui-kitten/components';
import React, {useContext} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useAuthentication} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = ({visible, onClose}) => {
  const {postLogin} = useAuthentication();
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const logIn = async (loginData) => {
    console.log('Button pressed');
    try {
      const loginResponse = await postLogin(loginData);
      console.log('login response', loginResponse);
      await AsyncStorage.setItem('userToken', loginResponse.token);
      setIsLoggedIn(true);
      setUser(loginResponse.user);
      onClose(); // Close the modal after successful login
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      visible={visible}
      backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      onBackdropPress={onClose}
      style={{width: "70%"}}
    >
      <Card
        style={{
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <Layout>
          <Text category="h5" alignSelf="center">
            Login
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={{color: 'red'}}>This is required.</Text>
          )}

          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="password"
                secureTextEntry={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                style={{width: '90%',alignSelf: 'center',marginVertical: 8,
                }}
              />
            )}
            name="password"
          />
          <Button onPress={handleSubmit(logIn)}
          style={{width: "90%", alignSelf: "center", marginVertical: 8,}}>Login</Button>
        </Layout>
      </Card>
    </Modal>
  );
};

export default LoginForm;
