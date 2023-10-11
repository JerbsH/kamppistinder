import {Modal, Text, Button, Card, Input, Layout} from '@ui-kitten/components';
import React from 'react';
import {useUser} from '../hooks/ApiHooks';
import {useForm, Controller} from 'react-hook-form';
import {Alert} from 'react-native';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {useEffect} from 'react';

const RegisterForm = ({visible, onClose, onSuccess}) => {
  const {postUser, checkUsername} = useUser();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
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
    try {
      delete registerData.confirm_password;
      const registerResult = await postUser(registerData);
      console.log('registeration result', registerResult);
      Alert.alert('Success', registerResult.message);
      onSuccess();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  useEffect(() => {
    if (registrationSuccess) {
      onClose();
    }
  }, [registrationSuccess, onClose]);

  return (
    <Modal
      visible={visible}
      backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      onBackdropPress={onClose}
      style={{width: '70%', paddingBottom: '75%'}}
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
              required: {value: true, message: 'is required'},
              minLength: {value: 3, message: 'min length 3 characters'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <>
                <Input
                  placeholder="Full name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{alignSelf: 'center', marginVertical: 4}}
                />
                {errors.full_name && (
                  <Text style={{color: 'red'}}>{errors.full_name.message}</Text>
                )}
              </>
            )}
            name="full_name"
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'is required'},
              minLength: {value: 3, message: 'min length 3 characters'},
              validate: async (value) => {
                try {
                  const isAvailable = await checkUsername(value);
                  console.log('username available?', value, isAvailable);
                  return isAvailable ? isAvailable : 'username taken';
                } catch (error) {
                  console.error(error);
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <>
                  <Input
                    placeholder="username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    style={{alignSelf: 'center', marginVertical: 4}}
                  />
                  {errors.username && (
                    <Text style={{color: 'red'}}>
                      {errors.username.message}
                    </Text>
                  )}
                </>
              );
            }}
            name="username"
          />
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
              <>
                <Input
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{alignSelf: 'center', marginVertical: 4}}
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text style={{color: 'red'}}>{errors.email.message}</Text>
                )}
              </>
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'is required'},
              minLength: {value: 5, message: 'min length 5 characters'},
              maxLength: 100,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <>
                <Input
                  placeholder="password"
                  secureTextEntry={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  style={{alignSelf: 'center', marginVertical: 4}}
                />
                {errors.password && (
                  <Text style={{color: 'red'}}>{errors.password.message}</Text>
                )}
              </>
            )}
            name="password"
          />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'is required'},
              validate: (value) => {
                const {password} = getValues();
                return value === password ? true : 'Passwords dont match!';
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <>
                <Input
                  placeholder="Confirm password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  style={{alignSelf: 'center', marginVertical: 4}}
                />
                {errors.confirm_password && (
                  <Text style={{color: 'red'}}>
                    {errors.confirm_password.message}
                  </Text>
                )}
              </>
            )}
            name="confirm_password"
          />
          <Button
            status="info"
            onPress={handleSubmit(register)}
            style={{width: '80%', alignSelf: 'center', marginVertical: 4}}
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
