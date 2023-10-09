import React, {useContext} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import googleMapsApiKey from '../utils/apiKey';
import { MainContext } from '../contexts/MainContext';

const MapPicker = () => {
  const {selectedCity, setSelectedCity} = useContext(MainContext);
  return (
    <GooglePlacesAutocomplete
      query={{
        placeholder: 'Select city',
        key: googleMapsApiKey,
        language: 'en',
        components: 'country:fi',
      }}
      onPress={(data, details = null) => {
        setSelectedCity(data.description);
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
    />
  );
};

export default MapPicker
