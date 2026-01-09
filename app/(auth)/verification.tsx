import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, TextInput, Keyboard, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';

const PRIMARY_GREEN = '#00A859';

import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/api/client';

export default function VerificationScreen() {
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { verify, user } = useAuth();

  // Auto-verify when all 6 codes are filled (watch codes array)
  useEffect(() => {
    const fullCode = codes.join('');
    if (fullCode.length === 6 && !isVerifying) {
      console.log('[Verification] All 6 digits detected, auto-verifying:', fullCode);
      handleVerify();
    }
  }, [codes, isVerifying]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow single digits
    const digit = value.replace(/\D/g, '').slice(0, 1);

    const newCodes = [...codes];
    newCodes[index] = digit;
    setCodes(newCodes);

    console.log('[Verification] After change at index', index, ':', newCodes);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // The useEffect will handle auto-verification when all 6 digits are present
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = codes.join('');
    console.log('[Verification] Attempt verify with codes array:', codes, 'joined:', code, 'length:', code.length);
    if (code.length !== 6) {
      Alert.alert('Invalid Code', `Please enter the complete verification code.\nCurrent: "${code}" (len=${code.length})`);
      return;
    }

    if (!user?.email) {
       Alert.alert('Error', 'No email found for verification. Please register again.');
       return;
    }

    setIsVerifying(true);
    console.log('[Verification] Verifying:', { email: user.email, code });
    try {
      await verify(user.email, code);
      try {
        const me = await apiClient.getCurrentUser();
        console.log('[Verification] Current user from /me:', me);
      } catch (err) {
        console.log('[Verification] Failed to fetch /me after verify', err);
      }
      // Clear codes to prevent useEffect from re-triggering
      setCodes(['', '', '', '', '', '']);
      Alert.alert('Success', 'Account verified successfully', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    try {
      await apiClient.resendVerification(user.email);
      Alert.alert('Code Resent', 'A new verification code has been sent to your email');
    } catch (error: any) {
       Alert.alert('Error', error.message || 'Failed to resend code');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Account Verification</Text>
          <Text style={styles.subtitle}>
            We have sent a One-Time Password (OTP) to your email address. Please enter it below to verify your account. The code will expire in 10 minutes.
          </Text>
        </View>

        <View style={styles.codeContainer}>
          {codes.map((code, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[styles.codeInput, code && styles.codeInputFilled]}
                value={code}
                onChangeText={(value) => handleCodeChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                onSubmitEditing={() => { if (index === 5) handleVerify(); }}
                keyboardType="number-pad"
                maxLength={1}
                blurOnSubmit={false}
                textContentType="oneTimeCode"
              />
          ))}
        </View>

        <TouchableOpacity style={styles.resendContainer} onPress={handleResend}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          <Text style={styles.resendLink}>Resend code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify Account</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: PRIMARY_GREEN,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    height: 64,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.text,
    backgroundColor: Colors.light.surface,
  },
  codeInputFilled: {
    borderColor: PRIMARY_GREEN,
    backgroundColor: '#fff',
  },
  pasteInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: Colors.light.surface,
    color: Colors.light.text,
  },
  
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
  verifyButton: {
    height: 56,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
