import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Iniciar sesión" }} />
      <Stack.Screen
        name="register"
        options={{
          headerTintColor: "#000",
          headerBackTitle: "Volver",
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: "Registrarse",
          headerShown: true,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
