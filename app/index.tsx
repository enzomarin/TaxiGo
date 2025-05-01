import { supabase } from "@/lib/supabase";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";
import "react-native-get-random-values";

export default function Page() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/(tabs)");
      } else {
        console.log("No hay sesion");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
        console.log("No user");
      }
    });
  }, []);
  return <Redirect href="/(auth)/login" />;
}
