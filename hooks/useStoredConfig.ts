import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { type Config, DEFAULTS, parseConfig } from "@/components/timer/config";

const STORAGE_KEY = "boxing-timer-config";

export function useStoredConfig() {
  const [config, setConfig] = useState<Config>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) setConfig(parseConfig(val));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config)).catch(() => {});
  }, [config, loaded]);

  return [config, setConfig] as const;
}
