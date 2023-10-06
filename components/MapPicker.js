import React, { useState } from 'react';
import { View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapPicker = ({ onLocationSelect }) => {
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedCoordinate(coordinate);
    onLocationSelect(coordinate);
    setButtonDisabled(false); // Enable the button when a location is selected
  };

  const handleConfirmPress = () => {
    if (selectedCoordinate && !buttonDisabled) {
      onLocationSelect(selectedCoordinate);
      // You might want to reset selectedCoordinate and disable the button here
      // setSelectedCoordinate(null);
      setButtonDisabled(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{flex: 1, height: 300}}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 60.1695,
          longitude: 24.9354,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedCoordinate && <Marker coordinate={selectedCoordinate} />}
      </MapView>
      <Button
        title="Confirm Location"
        onPress={handleConfirmPress}
        disabled={!selectedCoordinate || buttonDisabled}
      />
    </View>
  );
};

export default MapPicker;
