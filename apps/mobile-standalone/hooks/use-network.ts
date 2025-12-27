import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import type { NetInfoState } from '@react-native-community/netinfo';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);
  const [networkType, setNetworkType] = useState<string | null>(null);

  useEffect(() => {
    // Get initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
      setNetworkType(state.type ?? null);
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
      setNetworkType(state.type ?? null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isConnected,
    networkType,
    isOffline: !isConnected,
  };
}

