import { Link, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, Globe, User, Lock, Check, ArrowRight, ArrowLeft, Calendar } from 'lucide-react-native';
import { useState } from 'react';

type Step = 1 | 2 | 3;

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // Step 1: Contact Details
  const [country, setCountry] = useState('Zimbabwe');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Step 2: Personal Details
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  // Step 3: Security
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const steps = [
    { number: 1, label: 'Contact', icon: Mail },
    { number: 2, label: 'Personal', icon: User },
    { number: 3, label: 'Security', icon: Lock },
  ];

  const validateStep1 = () => {
    if (!country || !phone || !email) {
      Alert.alert('Validation Error', 'Please fill in all contact details');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!name || !surname || !gender || !day || !month || !year) {
      Alert.alert('Validation Error', 'Please fill in all personal details');
      return false;
    }
    return true;
  };

  const validatePassword = (pwd: string) => {
    const hasLength = pwd.length >= 8 && pwd.length <= 30;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[$#%!]/.test(pwd);
    return { hasLength, hasUpper, hasLower, hasNumber, hasSpecial };
  };

  const passwordRequirements = validatePassword(password);

  const validateStep3 = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in both password fields');
      return false;
    }
    const reqs = validatePassword(password);
    if (!Object.values(reqs).every(Boolean)) {
      Alert.alert('Validation Error', 'Password does not meet all requirements');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    if (!agreeToTerms) {
      Alert.alert('Validation Error', 'Please agree to the Terms and Conditions');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      // Navigate to verification screen
      router.push('/(auth)/verification');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.sectionTitle}>Contact details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Country</Text>
        <View style={styles.inputContainer}>
          <Globe size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="Select where you will be using Remipey"
            placeholderTextColor="#999"
          />
        </View>
        <Text style={styles.helperText}>Select where you will be using Remipey.</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone</Text>
        <View style={styles.inputContainer}>
          <Phone size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
          <Text style={styles.countryCode}>+263</Text>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <Text style={styles.infoText}>
        A verification code will be sent to your email address to verify your profile. This is only done once to keep your account secure.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <Mail size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.sectionTitle}>Personal Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputContainer}>
          <User size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Surname</Text>
        <View style={styles.inputContainer}>
          <User size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={surname}
            onChangeText={setSurname}
            placeholder="Enter your surname"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderOption, gender === 'male' && styles.genderOptionSelected]}
            onPress={() => setGender('male')}
          >
            {gender === 'male' && <Check size={20} color="#fff" />}
            <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderOption, gender === 'female' && styles.genderOptionSelected]}
            onPress={() => setGender('female')}
          >
            {gender === 'female' && <Check size={20} color="#fff" />}
            <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date Of Birth</Text>
        <View style={styles.dateContainer}>
          <View style={[styles.inputContainer, styles.dateInput]}>
            <TextInput
              style={styles.input}
              value={day}
              onChangeText={setDay}
              placeholder="DD"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={[styles.inputContainer, styles.dateInput]}>
            <TextInput
              style={styles.input}
              value={month}
              onChangeText={setMonth}
              placeholder="Month"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.inputContainer, styles.dateInput]}>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="YYYY"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
        </View>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.sectionTitle}>Password</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Lock size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry
          />
        </View>
        <View style={styles.requirementsContainer}>
          <View style={styles.requirement}>
            {passwordRequirements.hasLength ? (
              <Check size={16} color="#00A859" />
            ) : (
              <View style={styles.requirementDot} />
            )}
            <Text style={[styles.requirementText, passwordRequirements.hasLength && styles.requirementMet]}>
              8-30 characters
            </Text>
          </View>
          <View style={styles.requirement}>
            {passwordRequirements.hasUpper ? (
              <Check size={16} color="#00A859" />
            ) : (
              <View style={styles.requirementDot} />
            )}
            <Text style={[styles.requirementText, passwordRequirements.hasUpper && styles.requirementMet]}>
              One uppercase letter
            </Text>
          </View>
          <View style={styles.requirement}>
            {passwordRequirements.hasLower ? (
              <Check size={16} color="#00A859" />
            ) : (
              <View style={styles.requirementDot} />
            )}
            <Text style={[styles.requirementText, passwordRequirements.hasLower && styles.requirementMet]}>
              One lowercase letter
            </Text>
          </View>
          <View style={styles.requirement}>
            {passwordRequirements.hasNumber ? (
              <Check size={16} color="#00A859" />
            ) : (
              <View style={styles.requirementDot} />
            )}
            <Text style={[styles.requirementText, passwordRequirements.hasNumber && styles.requirementMet]}>
              One number
            </Text>
          </View>
          <View style={styles.requirement}>
            {passwordRequirements.hasSpecial ? (
              <Check size={16} color="#00A859" />
            ) : (
              <View style={styles.requirementDot} />
            )}
            <Text style={[styles.requirementText, passwordRequirements.hasSpecial && styles.requirementMet]}>
              One special character (Ex: $, #, %, or !)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Lock size={20} color={Colors.light.tabIconDefault} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor="#999"
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAgreeToTerms(!agreeToTerms)}
      >
        <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
          {agreeToTerms && <Check size={16} color="#fff" />}
        </View>
        <Text style={styles.checkboxText}>
          I agree to Remipey's{' '}
          <Text style={styles.linkText}>Terms and Conditions</Text>
          {' '}and <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Signup to Remipey</Text>
            
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                const isActive = isCompleted || isCurrent;
                
                return (
                  <View key={step.number} style={styles.progressStepWrapper}>
                    <View style={styles.progressStep}>
                      <View
                        style={[
                          styles.progressCircle,
                          isCompleted && styles.progressCircleCompleted,
                          isCurrent && styles.progressCircleCurrent,
                        ]}
                      >
                        {isCompleted ? (
                          <Check size={20} color="#fff" />
                        ) : (
                          <Icon size={20} color={isCurrent ? '#fff' : '#999'} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.progressLabel,
                          isActive && styles.progressLabelActive,
                        ]}
                      >
                        {step.label}
                      </Text>
                    </View>
                    {index < steps.length - 1 && (
                      <View
                        style={[
                          styles.progressLine,
                          isCompleted && styles.progressLineCompleted,
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.form}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <View style={styles.buttonContainer}>
              {currentStep > 1 && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <ArrowLeft size={20} color={Colors.light.text} />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === 3 ? 'Create Account' : 'Next'}
                </Text>
                {currentStep < 3 && <ArrowRight size={20} color="#fff" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>I have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY_GREEN = '#00A859';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.light.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 10,
    marginHorizontal: -10,
  },
  progressStepWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  progressStep: {
    alignItems: 'center',
    zIndex: 2,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressCircleCompleted: {
    backgroundColor: PRIMARY_GREEN,
  },
  progressCircleCurrent: {
    backgroundColor: PRIMARY_GREEN,
  },
  progressLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  progressLabelActive: {
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
  progressLine: {
    position: 'absolute',
    left: '60%',
    right: '-60%',
    top: 20,
    height: 2,
    backgroundColor: '#E0E0E0',
    zIndex: 1,
  },
  progressLineCompleted: {
    backgroundColor: PRIMARY_GREEN,
  },
  form: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_GREEN,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    padding: 0,
  },
  countryCode: {
    fontSize: 16,
    color: Colors.light.text,
    marginRight: 8,
    fontWeight: '500',
  },
  phoneInput: {
    marginLeft: 0,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 24,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.surface,
  },
  genderOptionSelected: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  genderText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  requirementsContainer: {
    marginTop: 12,
    gap: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  requirementText: {
    fontSize: 12,
    color: '#666',
  },
  requirementMet: {
    color: PRIMARY_GREEN,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.surface,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  nextButton: {
    flex: 1,
    height: 56,
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY_GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  linkText: {
    color: PRIMARY_GREEN,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});