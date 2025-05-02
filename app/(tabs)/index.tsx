import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  Alert,
  Pressable,
  TouchableOpacity,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { IconSymbol } from "@/components/ui/IconSymbol";
import GooglePlaceInput from "@/components/GooglePlaceInput";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";

import MapViewDirection from "react-native-maps-directions";
import * as Linking from "expo-linking";

// Nivel de zoom personalizado (valores más pequeños = más zoom)
const ZOOM_LEVEL = {
  LATITUDE_DELTA: 0.009, // Aprox. 500 metros de altura visible
  LONGITUDE_DELTA: 0.009, // Aprox. 500 metros de ancho visible
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const [destination, setDestination] = useState<GooglePlaceDetail | null>(
    null
  );
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permiso de ubicación denegado");

        return;
      }

      // Obtener ubicación actual
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Configurar región inicial con zoom personalizado
      const newRegion: Region = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: ZOOM_LEVEL.LATITUDE_DELTA,
        longitudeDelta: ZOOM_LEVEL.LONGITUDE_DELTA,
      };

      setInitialRegion(newRegion);

      // Centrar el mapa (segunda opción por si falla el initialRegion)
      setTimeout(() => {
        mapRef.current?.animateToRegion(newRegion, 1000);
      }, 500);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 1, // Actualizar cada 10 metros
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    })();
    return () => subscription?.remove();
  }, []);

  // 2. Función para re-centrar el mapa
  const centerMap = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: ZOOM_LEVEL.LATITUDE_DELTA,
        longitudeDelta: ZOOM_LEVEL.LONGITUDE_DELTA,
      };

      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la ubicación actual");
    }
  };

  const startNavigation = async () => {
    if (!location || !destination) {
      Alert.alert("Faltan datos", "Debes tener ubicación y destino.");
      return;
    }

    const lat = destination.geometry.location.lat;
    const lng = destination.geometry.location.lng;

    const urls = [
      {
        name: "Google Maps",
        url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
      },
      {
        name: "Waze",
        url: `waze://?ll=${lat},${lng}&navigate=yes`,
      },
      {
        name: "Apple Maps",
        url: `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
      },
    ];

    // Filtrar apps disponibles
    const availableOptions = [];
    for (const app of urls) {
      const canOpen = await Linking.canOpenURL(app.url);
      if (canOpen) {
        availableOptions.push({
          text: app.name,
          onPress: () => Linking.openURL(app.url),
        });
      }
    }

    if (availableOptions.length === 0) {
      Alert.alert("Ninguna app de navegación disponible.");
      return;
    }

    Alert.alert(
      "Elige una app",
      "¿Cómo deseas navegar?",
      [
        ...availableOptions,
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  // 3. Render condicional mientras se obtiene la ubicación
  if (!initialRegion) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Obteniendo tu ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.googlePlaceInpt}>
        <GooglePlaceInput
          currentLocation={location}
          onPlaceSelected={(dataLocation) => {
            setDestination(dataLocation);
            if (!dataLocation) return;
            mapRef.current?.animateToRegion(
              {
                latitude: dataLocation?.geometry.location.lat,
                longitude: dataLocation?.geometry.location.lng,
                latitudeDelta: ZOOM_LEVEL.LATITUDE_DELTA,
                longitudeDelta: ZOOM_LEVEL.LONGITUDE_DELTA,
              },
              1000
            );
            if (!location) return;
            mapRef.current?.fitToCoordinates(
              [
                {
                  latitude: dataLocation?.geometry.location.lat,
                  longitude: dataLocation?.geometry.location.lng,
                },
                {
                  latitude: location?.coords.latitude,
                  longitude: location?.coords.longitude,
                },
              ],
              {
                edgePadding: {
                  top: 200,
                  right: 50,
                  bottom: 200,
                  left: 50,
                },
                animated: true,
              }
            );
          }}
        />
      </View>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        showsMyLocationButton={true}
        showsUserLocation={true}
        initialRegion={initialRegion} // Centrado inicial
        onMapReady={() => centerMap()} // Refuerzo del centrado
      >
        {destination && (
          <Marker
            coordinate={{
              latitude: destination?.geometry.location.lat,
              longitude: destination?.geometry.location.lng,
            }}
          />
        )}

        {location && destination && apiKey && (
          <MapViewDirection
            origin={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            destination={{
              latitude: destination.geometry.location.lat,
              longitude: destination.geometry.location.lng,
            }}
            apikey={apiKey}
            strokeWidth={5}
            strokeColor="hotpink"
            precision="high"
            onStart={() => {
              console.log("Dirección iniciada");
            }}
            onError={(error) => {
              console.error("Error en MapViewDirection: ", error);
            }}
          />
        )}
      </MapView>

      <View style={styles.startButtonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={startNavigation}
          disabled={!location || !destination}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            INICIAR
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsMapContainer}>
        {/* Botón para centrar */}
        <TouchableOpacity style={styles.centerButton} onPress={centerMap}>
          <IconSymbol name="location" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  startButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "20%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  buttonText: {
    fontSize: 24,
  },
  centerButton: {
    backgroundColor: "white",
    borderRadius: 100,
    padding: 5,
    margin: 5,
    shadowColor: "#000",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
  },
  buttonsMapContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    flexDirection: "row",
    gap: 8,
  },
  googlePlaceInpt: {
    position: "absolute",
    top: 50,
    zIndex: 100,
  },
});
