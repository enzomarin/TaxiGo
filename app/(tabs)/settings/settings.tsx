import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type profileType = {
  id: string;
  name: string;
  role: string;
};
export default function SettingsScreen() {
  const [user, setUser] = useState<null | User>(null);
  const [profile, setProfile] = useState<null | profileType>(null);
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom + 16; // 16 is the padding you want to add
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        Alert.alert("Error", "No se pudo obtener el usuario");
        return;
      }

      setUser(userData.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        Alert.alert("Error al cargar perfil", profileError.message);
        return;
      }

      setProfile(profileData);
    };

    fetchUserAndProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Configuración",
          headerLeft: () => null,
        }}
      />

      <View style={styles.container}>
        {/* Parte con scroll */}
        <Text> Bienvenido {profile?.name}</Text>
        <ScrollView style={styles.scrollArea}>
          <Text style={styles.userText}>{JSON.stringify(user, null, 2)}</Text>
        </ScrollView>
        {/* Botón fijo */}
        <View style={[styles.footer, { paddingBottom: bottomPadding || 16 }]}>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollArea: {
    flex: 2,
    padding: 16,
    paddingBottom: 32, // deja espacio visual para que no quede justo contra el botón
  },
  userText: {
    fontSize: 12,
  },
  buttonContainer: {
    backgroundColor: "#000968",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 12,
    margin: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
