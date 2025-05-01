import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Todos los campos son obligatorios.");
      return;
    }
    setLoading(true);
    const {
      data: { user, session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }
    // Si hay que verificar email user puede existir pero no session
    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        name: name,
        role: "driver",
      });

      if (profileError) {
        Alert.alert(profileError.message);
      } else if (!session) {
        Alert.alert(
          "Verifica tu correo",
          "Hemos enviado un correo de verificación a tu bandeja de entrada."
        );
      }
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20 }}>
      <View style={styles.inputsContainer}>
        <Text>Nombre</Text>
        <TextInput
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Text>Correo</Text>
        <TextInput
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <Text>Contraseña</Text>
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
      </View>
      <TouchableOpacity onPress={handleRegister} disabled={loading}>
        <Text
          style={{
            backgroundColor: loading ? "#888" : "#000",
            color: "#fff",
            padding: 10,
            textAlign: "center",
            borderRadius: 5,
          }}
        >
          {loading ? "Registrando..." : "Registrarte"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputsContainer: {
    gap: 10,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    color: "#000",
    padding: 10,
    borderRadius: 5,
  },
});
