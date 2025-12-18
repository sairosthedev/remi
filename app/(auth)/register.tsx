import { Link, router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function RegisterScreen() {
  const handleRegister = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Remipey to start sending smiles.</Text>
        </View>

        <View style={styles.form}>
           <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
              <Text style={styles.placeholder}>John Doe</Text>
            </View>
          </View>

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

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign In</Text>
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
