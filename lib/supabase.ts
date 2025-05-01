import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://eevlozkntiedveaytdjm.supabase.co";
const supabasesKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldmxvemtudGllZHZlYXl0ZGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzMyMDksImV4cCI6MjA2MTEwOTIwOX0.CkL4cw9iNF_JkSJQ_dxqoB1Z9VABvNuqk_69kE4Doas";

export const supabase = createClient(supabaseUrl, supabasesKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
