import React, {useContext, useEffect, useState} from 'react';
import {
  Modal,
  Text,
  Button,
  Card,
  Input,
  Layout,
  IndexPath,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import {Alert, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {appId, placeholderImage} from '../utils/app-config';

const Upload = ({visible, onClose, navigation, selectedCity}) => {
  const {update, setUpdate} = useContext(MainContext);
  const [image, setImage] = useState(placeholderImage);
  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const [type, setType] = useState('image');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const renderOption = (title) => <SelectItem key={title} title={title} />;
  const cityArray = [
    'Helsinki',
    'Kotka',
    'Jyväskylä',
    'Joensuu',
    'Turku',
    'Tampere',
    'Oulu',
    'Lappeenranta',
    'Mikkeli',
    'Vaasa',
  ];

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

  const upload = async (uploadData) => {
    console.log('upload', uploadData);
    // Extract the selected city from the dropdown
    const selectedCity = cityArray[selectedIndex.row];
    console.log('Selected City:', selectedCity);
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
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
      console.log('lataus', response);
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
      Alert.alert('Upload', `${response.message} (id: ${response.file_id})`, [
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
      // TODO: notify user about failed upload
    }
  };

  const resetForm = () => {
    setImage(placeholderImage);
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setType(result.assets[0].type);
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    >
    <Modal
      visible={visible}
      backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
      onBackdropPress={onClose}
      style={{width: '70%'}}
    >
      <ScrollView>
      <Card>
        <Layout
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        >
          <Text category="h1" style={{marginBottom: 16}}>
            Upload
          </Text>
          <Text style={{fontSize: 18, color: '#777', marginBottom: 8}}>
            Select City
          </Text>
          <Select
            style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
            selectedIndex={selectedIndex}
            onSelect={(index) => {
              setType(cityArray[index.row]);
              setSelectedIndex(index);
            }}
            value={cityArray[selectedIndex.row]}
          >
            {cityArray.map(renderOption)}
          </Select>

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
                style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
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
              <ScrollView
                style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
              >
                <Input
                  multiline={true}
                  placeholder="Description (10 characters min.)"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.description?.message}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    marginVertical: 8,
                  }}
                />
              </ScrollView>
            )}
            name="description"
          />
          <Button
            style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
            onPress={pickImage}
          >
            Choose picture
          </Button>
          <Button
            style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
            color={'error'}
            onPress={resetForm}
          >
            Reset
          </Button>
          <Button
            style={{width: '90%', alignSelf: 'center', marginVertical: 8}}
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
