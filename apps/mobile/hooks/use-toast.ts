import Toast from 'react-native-toast-message';

export function useToast() {
  return {
    show: {
      success: (message: string, description?: string) => {
        Toast.show({
          type: 'success',
          text1: message,
          text2: description,
          position: 'top',
        });
      },
      error: (message: string, description?: string) => {
        Toast.show({
          type: 'error',
          text1: message,
          text2: description,
          position: 'top',
        });
      },
      info: (message: string, description?: string) => {
        Toast.show({
          type: 'info',
          text1: message,
          text2: description,
          position: 'top',
        });
      },
    },
  };
}

