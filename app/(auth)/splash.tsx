import { useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Images } from '@/constants/Images';

const PRIMARY_GREEN = '#00A859';

export default function SplashScreen() {
  useEffect(() => {
    // Show splash for 6 seconds then navigate to login
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

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