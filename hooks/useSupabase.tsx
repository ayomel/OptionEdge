import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";

export const useSupabase = (config: {
  supabaseUrl: string;
  supabaseAnonKey: string;
}) =>
  useMemo(
    () => createClient(config.supabaseUrl, config.supabaseAnonKey),
    [config]
  );
