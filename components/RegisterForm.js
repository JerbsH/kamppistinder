import {Modal, Text, Button, Card, Input, Layout} from '@ui-kitten/components';
import React from 'react';
import {useUser} from '../hooks/ApiHooks';
import {useForm, Controller} from 'react-hook-form';
import {Alert} from 'react-native';
import {PropTypes} from 'prop-types';

const RegisterForm = ({setToggleRegister, visible, onClose}) => {
  const {postUser, checkUsername} = useUser();
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {full_name: '', username: '', email: '', password: ''},
    mode: 'onBlur',
  });

  const register = async (registerData) => {
    console.log('Registering: ', registerData);
    try {
      delete registerData.confirm_password;
      const registerResult = await postUser(registerData);
      console.log('registeration result', registerResult);
      Alert.alert('Success', registerResult.message);
      setToggleRegister(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Modal
      visible={visible}
      backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      onBackdropPress={onClose}
      style={{width: '70%'}}
    >
      <Card
        style={{
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <Layout>
          <Text category="h5" alignSelf="center">
            Register
          </Text>

          <Controller
            control={control}
            rules={{
              minLength: {value: 3, message: 'min length is 3 characters'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Full name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
              />
            )}
            name="full_name"
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'is required'},
              minLength: {value: 3, message: 'min length is 3 characters'},
              validate: async (value) => {
                try {
                  const isAvailable = await checkUsername(value);
                  console.log('username available?', value, isAvailable);
                  return isAvailable ? isAvailable : 'Username taken';
                } catch (error) {
                  console.error(error);
                }
              },
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
              required: {value: true, message: 'is required'},
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'must be a valid email',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
                autoCapitalize="none"
                errorMessage={errors.email?.message}
              />
            )}
            name="email"
          />

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
                style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
              />
            )}
            name="password"
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'is required'},
              validate: (value) => {
                const {password} = getValues();
                // console.log('getValues password', password);
                return value === password ? true : 'Passwords dont match!';
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Confirm password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                secureTextEntry={true}
                errorMessage={errors.confirm_password?.message}
                style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
              />
            )}
            name="confirm_password"
          />
          <Button
            onPress={handleSubmit(register)}
            style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
          >
            Register
          </Button>
        </Layout>
      </Card>
    </Modal>
  );
};
RegisterForm.propTypes = {
  setToggleRegister: PropTypes.func,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default RegisterForm;
