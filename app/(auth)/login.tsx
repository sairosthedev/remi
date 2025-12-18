import { Link, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const handleLogin = () => {
    // Navigate to tabs after "login"
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue supporting your family.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
              <Text style={styles.placeholder}>user@example.com</Text> 
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
              <Text style={styles.placeholder}>••••••••</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.surface,
  },
  icon: {
    marginRight: 12,
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  button: {
    height: 56,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  linkText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
