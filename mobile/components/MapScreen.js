import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import Mapbox, { MapView, UserLocation, Camera } from "@rnmapbox/maps";

Mapbox.setAccessToken("pk.eyJ1IjoiNnIxbSIsImEiOiJjbWFzbzhmeTUwZHRhMm1zaGM0dGNrbDI1In0.ZDk6vHNDdia5IT_UoUEwPg");

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato",
    overflow: "hidden",
    borderRadius: 10
  },
  map: {
    flex: 1
  }
});

export default function MapScreen() {
  const cameraRef = useRef(null);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
        >
          <UserLocation visible={true} />

          <Camera
            ref={cameraRef}
            zoomLevel={15}
            followUserLocation={true}
            followUserMode="normal"
          />
        </MapView>
      </View>
    </View>
  );
}