import {Controller, useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {mediaUrl} from '../utils/app-config';
import { Button, Card, Input } from '@ui-kitten/components';

const Modify = ({navigation, route}) => {
  const {
    title,
    description,
    filename,
    file_id: fileId,
  } = route.params;
  const {update, setUpdate} = useContext(MainContext);
  const {putMedia} = useMedia();
  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: title,
      description: description,
    },
    mode: 'onBlur',
  });

  const updateMedia = async (data) => {
    console.log('updating file', data);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await putMedia(fileId, token, data);
      console.log('updateMedia()', result.message);
      setUpdate(!update);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
        <Card.Image source={{uri: mediaUrl + filename}} style={styles.image} />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.title?.message}
          />
        )}
        name="title"
      />

      <Controller
        control={control}
        rules={{
          minLength: {value: 10, message: 'min 10 characters'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Description (optional)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.description?.message}
          />
        )}
        name="description"
      />
      <Button
        title="Reset"
        color={'error'}
        onPress={() => {
          reset();
        }}
      />
      <Button
        disabled={errors.description || errors.title}
        title="Update"
        onPress={handleSubmit(updateMedia)}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15,
    resizeMode: 'cover',
  },
});

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
