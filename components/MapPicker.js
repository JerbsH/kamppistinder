import React, {useContext} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import googleMapsApiKey from '../utils/apiKey';
import { MainContext } from '../contexts/MainContext';
import { Text } from '@ui-kitten/components';

const MapPicker = () => {
  const {selectedCity, setSelectedCity} = useContext(MainContext);

  return (
    <GooglePlacesAutocomplete
      query={{
        types: '(cities)',
        key: googleMapsApiKey,
        language: 'en',
        components: 'country:fi',
      }}
      onPress={(data, details = null) => {
        setSelectedCity(details.description);
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      textInputProps={{
        placeholder: 'Type your city',
      }}
    />
  );
};

export default MapPicker
