import React from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {MAPBOX_PUBLIC_TOKEN} from '@env';

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN as string);

const MapView = () => {
  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView style={{ flex: 1 }}>
        <Mapbox.Camera
          zoomLevel={14}
          centerCoordinate={[18.6466, 54.3520]}
        />
      </Mapbox.MapView>
    </View>
  );
};

export default MapView;