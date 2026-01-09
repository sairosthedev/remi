import { useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Images } from '@/constants/Images';
import { useAuth } from '@/contexts/AuthContext';

const PRIMARY_GREEN = '#00A859';

export default function SplashScreen() {
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    // Wait until auth state has loaded from storage
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (token && user) {
        // User already authenticated → go straight to main app
        router.replace('/(tabs)');
      } else {
        // Not authenticated → go to login
        router.replace('/(auth)/login');
      }
    }, 1500); // shorter, snappier splash

    return () => clearTimeout(timer);
  }, [isLoading, token, user]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={Images.logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ActivityIndicator size="large" color={PRIMARY_GREEN} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 48,
  },
  logo: {
    width: 200,
    height: 80,
  },
  loader: {
    marginTop: 24,
  },
});