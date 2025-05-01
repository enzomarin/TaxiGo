import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { StyleSheet, Dimensions } from "react-native";
import { useState } from "react";
import { LocationObject } from "expo-location";

type Props = {
  style?: object;
  currentLocation: LocationObject | null;
  onPlaceSelected: (data: GooglePlaceDetail | null) => void;
};
export default function GooglePlaceInput({
  style,
  currentLocation,
  onPlaceSelected,
}: Props) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  console.log("Api key google: ", apiKey);
  return (
    <GooglePlacesAutocomplete
      placeholder="A donde vamos?"
      minLength={2}
      fetchDetails={true}
      onFail={(error) =>
        console.error("Error en GooglePlacesAutocomplete: ", error)
      }
      styles={{
        textInputContainer: {
          width: Dimensions.get("window").width * 0.9,
          color: "black",
        },
        textInput: {
          height: 45,
          width: Dimensions.get("window").width * 0.9,
          color: "black",
          fontSize: 16,
          fontFamily: "Pangram-Regular",
        },
        predefinedPlacesDescription: {
          color: "#1faadb",
        },
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
        onPlaceSelected(details); // llamar a la función onPlaceSelected con los datos del lugar seleccionado
        // almacenar el destino en el estado
      }}
      query={{
        lenguage: "es",
        key: apiKey,
        components: "country:cl",
        location: `${currentLocation?.coords.latitude},${currentLocation?.coords.longitude}`,
        radius: 5000,
      }}
    />
  );
}
