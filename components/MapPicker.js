import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import googleMapsApiKey from '../utils/apiKey';

const MapPicker = () => {
  return (
    <GooglePlacesAutocomplete
      query={{
        placeholder: 'Select city',
        key: googleMapsApiKey,
        language: 'en',
        components: 'country:fi',
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
    />
  );
};

export default MapPicker
