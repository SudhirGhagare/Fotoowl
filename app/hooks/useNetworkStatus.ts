import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export function useNetworkStatus() {

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {

    const unsub = NetInfo.addEventListener(
        (state) => {
      setIsConnected(Boolean(state.isConnected));
    });

    return () => unsub();
  }, []);

  return isConnected;
}
