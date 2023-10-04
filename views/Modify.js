import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View, Image, ScrollView} from 'react-native';
import {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {Button, Card, Input, Text} from '@ui-kitten/components';
import {mediaUrl} from '../utils/app-config';

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
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: mediaUrl + filename}} />
      </View>
      <Text
        style={{
          fontSize: 16,
          color: '#777',
          marginBottom: 8,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        Name
      </Text>
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
            style={{width: '70%', alignSelf: 'center', marginVertical: 8}}
          />
        )}
        name="title"
      />
      <Text
        style={{
          fontSize: 16,
          color: '#777',
          marginBottom: 8,
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        Description
      </Text>
      <Controller
        control={control}
        rules={{
          minLength: {value: 10, message: 'min 10 characters'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <ScrollView style={{maxHeight: 200}}>
            <Input
              multiline={true}
              placeholder="Description (optional)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.description?.message}
              style={{width: '70%', alignSelf: 'center', marginVertical: 8}}
            />
          </ScrollView>
        )}
        name="description"
      />
      <Button
        style={{width: '70%', alignSelf: 'center', marginVertical: 8}}
        color={'error'}
        onPress={() => {
          reset();
        }}
      >
        Reset
      </Button>
      <Button
        style={{width: '70%', alignSelf: 'center', marginVertical: 8}}
        disabled={errors.description || errors.title}
        onPress={handleSubmit(updateMedia)}
      >
        Update
      </Button>
    </Card>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
