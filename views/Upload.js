import React, {useContext, useEffect, useState} from 'react';
import {Modal, Text, Button, Card, Input, Layout} from '@ui-kitten/components';
import {Alert, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {appId} from '../utils/app-config';
import MapPicker from '../components/MapPicker';

const Upload = ({visible, onClose, navigation}) => {
  const {update, setUpdate} = useContext(MainContext);
  const [image, setImage] = useState(null);
  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const [type, setType] = useState('image');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const {selectedCity, setSelectedCity} = useContext(MainContext);

  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
  });

  // upload new posts
  const upload = async (uploadData) => {
    console.log('upload', uploadData);
    const formData = new FormData();
    formData.append(
      'title',
      `${uploadData.title}, ${selectedCity.split(',')[0].trim()}`,
    );
    formData.append('description', uploadData.description);
    console.log(formData);
    const filename = image.split('/').pop();

    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;

    formData.append('file', {
      uri: image,
      name: filename,
      type: `${type}/${fileExtension}`,
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postMedia(formData, token);
      const tagResponse = await postTag(
        {
          file_id: response.file_id,
          tag: appId,
        },
        token,
      );
      console.log('postTag', tagResponse);
      setUpdate(!update);
      setUploadSuccess(true);
      Alert.alert('Upload', 'upload succesful', [
        {
          text: 'Ok',
          onPress: () => {
            resetForm();
            navigation.navigate('My Likes');
          },
        },
      ]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const resetForm = () => {
    setImage(null);
    setType('image');
    reset();
  };

  useEffect(() => {
    if (uploadSuccess) {
      onClose();
    }
  }, [uploadSuccess, onClose]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setType(result.assets[0].type);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
    >
      <Modal
        visible={visible}
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        onBackdropPress={onClose}
        style={{width: '70%'}}
      >
        <MapPicker />
        <ScrollView>
          <Card>
            <Layout
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <Text category="h1" style={{marginBottom: 16}}>
                Upload
              </Text>
              <Controller
                control={control}
                rules={{
                  required: {value: true, message: 'is required'},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    placeholder="What is your name?"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.title?.message}
                    style={{
                      alignSelf: 'center',
                      marginVertical: 4,
                    }}
                  />
                )}
                name="title"
              />

              <Controller
                control={control}
                rules={{
                  required: {value: true, message: 'is required'},
                  minLength: {value: 10, message: 'min 10 characters'},
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ScrollView
                    style={{
                      alignSelf: 'center',
                      marginVertical: 4,
                    }}
                  >
                    <>
                      <Input
                        multiline={true}
                        placeholder="Description (10 characters min.)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={{
                          alignSelf: 'center',
                          maxHeight: 100,
                        }}
                      />
                      {errors.description && (
                        <Text style={{color: 'red'}}>
                          {errors.description.message}
                        </Text>
                      )}
                    </>
                  </ScrollView>
                )}
                name="description"
              />
              <Button
                status={image ? 'success' : 'warning'}
                style={{width: '90%', alignSelf: 'center', marginVertical: 4}}
                onPress={pickImage}
              >
                {image ? 'Picture added' : 'Choose picture'}
              </Button>
              <Button
                appearance="outline"
                status="success"
                style={{width: '90%', alignSelf: 'center', marginVertical: 4}}
                onPress={resetForm}
              >
                Reset
              </Button>
              <Button
                status="success"
                style={{width: '90%', alignSelf: 'center', marginVertical: 4}}
                loading={loading}
                disabled={errors.description || errors.title}
                onPress={handleSubmit(upload)}
              >
                Upload
              </Button>
            </Layout>
          </Card>
        </ScrollView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  selectedCity: PropTypes.string,
};

export default Upload;
