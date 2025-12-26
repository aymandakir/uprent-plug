import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);
  const [networkType, setNetworkType] = useState<Network.NetworkStateType | null>(null);

  useEffect(() => {
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected ?? true);
      setNetworkType(networkState.type);
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    networkType,
    isOffline: !isConnected,
  };
}

