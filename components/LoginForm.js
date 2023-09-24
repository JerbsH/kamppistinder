import {View, Text, TextInput, Button} from 'react-native';
import React, {useContext} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useAuthentication} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = () => {
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
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View>
      <Text>Login</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
        name="username"
      />
      {errors.username && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="password"
            secureTextEntry={true}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
        name="password"
      />
      <Button title="Submit" onPress={handleSubmit(logIn)} />
    </View>
  );
};
export default LoginForm;
