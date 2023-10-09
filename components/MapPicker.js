import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import {Input, Button} from '@ui-kitten/components/ui';
import MapView from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const MapPicker = ({onLocationSelect}) => {
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleMapPress = (event) => {
    const {coordinate} = event.nativeEvent;
    setSelectedCoordinate(coordinate);
    onLocationSelect(coordinate);
    setButtonDisabled(false);
  };
  const handleCitySelect = (details) => {
    try {
      if (!details) {
        throw new Error('Invalid details object: null');
      }

      console.log('Selected Item:', details); // Add this line for additional logging

      const { geometry, description } = details;

      let location = details.location || (geometry && geometry.location);

      if (!location || !location.lat || !location.lng) {
        throw new Error('Invalid details object - Missing or invalid geometry or location');
      }

      setSelectedCoordinate(location);
      setSelectedCity({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        description: description || '',
      });

      setButtonDisabled(false);
    } catch (error) {
      console.error(error.message);
      console.trace(); // Add this line for a stack trace
    }
  };


  const handleInputChange = (text) => {
    setSearchText(text);

    // Perform your search logic here and update searchResults
    // For example, you might fetch data from an API based on the input.
    // Update setSearchResults with the search results.
  };

  const handleItemSelect = (selectedItem) => {
    // Handle the selected item, for example, update state or perform an action
    console.log('Selected Item:', selectedItem);
    setSearchText(selectedItem.description);
    handleCitySelect(selectedItem);
  };

  useEffect(() => {
    // Update the selectedCoordinate in case it changes externally
    if (selectedCity) {
      setSelectedCoordinate({
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
      });
    }
  }, [selectedCity]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: selectedCoordinate ? selectedCoordinate.latitude : 60.1695,
          longitude: selectedCoordinate
            ? selectedCoordinate.longitude
            : 24.9354,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      {/* Search Input with Autocomplete */}
      <GooglePlacesAutocomplete
        placeholder="Search for a city"
        onPress={handleItemSelect}
        query={{
          key: 'AIzaSyArMzb3iykSAAzky-smqGDTWLOSKglN1k0',
          language: 'en',
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
        renderTextInput={(props) => (
          <Input
            {...props}
            style={styles.input}
            value={searchText}
            onChangeText={handleInputChange}
          />
        )}
      />

      {/* Search Results List */}
      <View style={styles.flatListContainer}>
        <FlatList
          style={styles.flatList}
          data={searchResults}
          keyExtractor={(item) => item.id.toString()} // Adjust the key based on your data
          renderItem={({item}) => (
            <View>
              <Text>{item.description}</Text>
              <Button onPress={() => handleItemSelect(item)}>Select</Button>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    height: 200,
    width: 250,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
  flatListContainer: {
    maxHeight: 200,
  },
  flatList: {
    flex: 1,
  },
});

export default MapPicker;
