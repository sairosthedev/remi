import { StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Plus, X, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface Recipient {
  name: string;
  surname: string;
  country: string;
  countryCode: string;
  phone: string;
  email: string;
}

// Sample countries with flags and codes
const COUNTRIES = [
  { name: 'Afghanistan', flag: '🇦🇫', code: '+93' },
  { name: 'Albania', flag: '🇦🇱', code: '+355' },
  { name: 'Algeria', flag: '🇩🇿', code: '+213' },
  { name: 'Argentina', flag: '🇦🇷', code: '+54' },
  { name: 'Australia', flag: '🇦🇺', code: '+61' },
  { name: 'Austria', flag: '🇦🇹', code: '+43' },
  { name: 'Belgium', flag: '🇧🇪', code: '+32' },
  { name: 'Brazil', flag: '🇧🇷', code: '+55' },
  { name: 'Canada', flag: '🇨🇦', code: '+1' },
  { name: 'China', flag: '🇨🇳', code: '+86' },
  { name: 'France', flag: '🇫🇷', code: '+33' },
  { name: 'Germany', flag: '🇩🇪', code: '+49' },
  { name: 'India', flag: '🇮🇳', code: '+91' },
  { name: 'Italy', flag: '🇮🇹', code: '+39' },
  { name: 'Japan', flag: '🇯🇵', code: '+81' },
  { name: 'Kenya', flag: '🇰🇪', code: '+254' },
  { name: 'Mexico', flag: '🇲🇽', code: '+52' },
  { name: 'Nigeria', flag: '🇳🇬', code: '+234' },
  { name: 'South Africa', flag: '🇿🇦', code: '+27' },
  { name: 'Spain', flag: '🇪🇸', code: '+34' },
  { name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { name: 'United States', flag: '🇺🇸', code: '+1' },
  { name: 'Zimbabwe', flag: '🇿🇼', code: '+263' },
];

export default function CheckoutScreen() {
  const { items, getTotal } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState<'self' | 'delivery'>('self');
  const [promoCode, setPromoCode] = useState('');
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Recipient form state
  const [recipientName, setRecipientName] = useState('');
  const [recipientSurname, setRecipientSurname] = useState('');
  const [recipientCountry, setRecipientCountry] = useState(COUNTRIES[0]);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleAddRecipient = () => {
    const newRecipient: Recipient = {
      name: recipientName,
      surname: recipientSurname,
      country: recipientCountry.name,
      countryCode: recipientCountry.code,
      phone: recipientPhone,
      email: recipientEmail,
    };
    setSelectedRecipient(newRecipient);
    setShowRecipientModal(false);
    // Reset form
    setRecipientName('');
    setRecipientSurname('');
    setRecipientCountry(COUNTRIES[0]);
    setRecipientPhone('');
    setRecipientEmail('');
  };

  if (items.length === 0) {
    router.replace('/(tabs)/cart');
    return null;
  }

  const subtotal = getTotal();
  const storeName = items[0]?.store || 'Store';
  const country = items[0]?.country || 'N/A';
  const category = items[0]?.category || 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
            <Text style={styles.breadcrumbText}>Services</Text>
          </TouchableOpacity>
          <ChevronRight size={16} color="#00A859" style={{ marginHorizontal: 8 }} />
          <TouchableOpacity>
            <Text style={styles.breadcrumbText}>{category}</Text>
          </TouchableOpacity>
          <ChevronRight size={16} color="#00A859" style={{ marginHorizontal: 8 }} />
          <Text style={styles.breadcrumbTextActive}>Create Order</Text>
          <ChevronRight size={16} color="#00A859" style={{ marginHorizontal: 8 }} />
          <Text style={styles.breadcrumbTextActive}>Checkout</Text>
        </View>

        {/* Store Name */}
        <Text style={styles.storeName}>{storeName}</Text>

        <View style={styles.content}>
          {/* Left Column - Steps */}
          <View style={styles.leftColumn}>
            {/* 1. Select Recipient */}
            <View style={styles.card}>
              <Text style={styles.stepTitle}>1. Select Recipient</Text>
              <TouchableOpacity 
                style={styles.addRecipientButton}
                onPress={() => setShowRecipientModal(true)}
              >
                <Plus size={20} color="#fff" />
                <Text style={styles.addRecipientText}>Add Recipient</Text>
              </TouchableOpacity>
              <Text style={styles.orText}>or choose a recipient</Text>
              
              {!selectedRecipient && (
                <View style={styles.errorMessage}>
                  <AlertCircle size={16} color="#dc2626" />
                  <Text style={styles.errorText}>Receiver is required</Text>
                </View>
              )}

              {selectedRecipient && (
                <View style={styles.selectedRecipient}>
                  <View style={styles.recipientInfo}>
                    <Text style={styles.recipientName}>
                      {selectedRecipient.name} {selectedRecipient.surname}
                    </Text>
                    <Text style={styles.recipientDetails}>
                      {selectedRecipient.email}
                    </Text>
                    <Text style={styles.recipientDetails}>
                      {selectedRecipient.countryCode} {selectedRecipient.phone}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* 2. Delivery */}
            <View style={styles.card}>
              <Text style={styles.stepTitle}>2. Delivery</Text>
              
              <TouchableOpacity
                style={[
                  styles.deliveryOption,
                  selectedDelivery === 'self' && styles.deliveryOptionActive
                ]}
                onPress={() => setSelectedDelivery('self')}
              >
                <View style={styles.deliveryIcon}>
                  <Text style={styles.deliveryIconText}>📦</Text>
                </View>
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryTitle}>Self Collect</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedDelivery === 'self' && styles.radioButtonActive
                ]}>
                  {selectedDelivery === 'self' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deliveryOption,
                  selectedDelivery === 'delivery' && styles.deliveryOptionActive
                ]}
                onPress={() => setSelectedDelivery('delivery')}
              >
                <View style={styles.deliveryIcon}>
                  <Text style={styles.deliveryIconText}>🚚</Text>
                </View>
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryTitle}>Delivery</Text>
                  <Text style={styles.deliverySubtitle}>Not Available</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedDelivery === 'delivery' && styles.radioButtonActive
                ]}>
                  {selectedDelivery === 'delivery' && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Column - Order Summary */}
          <View style={styles.rightColumn}>
            <View style={styles.card}>
              <Text style={styles.stepTitle}>3. Order Summary</Text>

              {/* Product Items */}
              {items.map((item) => (
                <View key={item.id} style={styles.productItem}>
                  <View style={styles.productImage}>
                    <Text style={styles.productImageIcon}>🍾</Text>
                  </View>
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productQuantity}>{item.quantity} Item{item.quantity > 1 ? 's' : ''}</Text>
                  </View>
                  <Text style={styles.productPrice}>{item.price.toFixed(2)} USD</Text>
                </View>
              ))}

              {/* Promo Code */}
              <View style={styles.promoSection}>
                <Text style={styles.promoLabel}>Have A Gift Or Promo Code</Text>
                <View style={styles.promoInputContainer}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter coupon code"
                    placeholderTextColor="#999"
                    value={promoCode}
                    onChangeText={setPromoCode}
                  />
                  <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Order Details */}
              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Store</Text>
                  <Text style={styles.detailValue}>{storeName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Destination country</Text>
                  <Text style={styles.detailValue}>{country}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{category}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Subtotal</Text>
                  <Text style={styles.detailValue}>{subtotal.toFixed(2)} USD</Text>
                </View>
              </View>

              {/* Order Total */}
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalValue}>{subtotal.toFixed(2)} USD</Text>
              </View>

              {/* Pay Button */}
              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Pay {subtotal.toFixed(2)} USD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Recipient Modal */}
      <Modal
        visible={showRecipientModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowRecipientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Recipient</Text>
              <TouchableOpacity 
                onPress={() => setShowRecipientModal(false)}
                style={styles.closeButton}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter name"
                  placeholderTextColor="#999"
                  value={recipientName}
                  onChangeText={setRecipientName}
                />
              </View>

              {/* Surname */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Surname</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter surname"
                  placeholderTextColor="#999"
                  value={recipientSurname}
                  onChangeText={setRecipientSurname}
                />
              </View>

              {/* Country */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Country</Text>
                <TouchableOpacity
                  style={styles.countrySelector}
                  onPress={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <Text style={styles.countryFlag}>{recipientCountry.flag}</Text>
                  <Text style={styles.countryName}>{recipientCountry.name}</Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>

                {showCountryDropdown && (
                  <View style={styles.countryDropdown}>
                    <ScrollView style={styles.countryList} nestedScrollEnabled>
                      {COUNTRIES.map((country) => (
                        <TouchableOpacity
                          key={country.name}
                          style={styles.countryOption}
                          onPress={() => {
                            setRecipientCountry(country);
                            setShowCountryDropdown(false);
                          }}
                        >
                          <Text style={styles.countryFlag}>{country.flag}</Text>
                          <Text style={styles.countryName}>{country.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Phone */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCodeBox}>
                    <Text style={styles.countryCodeText}>{recipientCountry.code}</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={recipientPhone}
                    onChangeText={setRecipientPhone}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={recipientEmail}
                  onChangeText={setRecipientEmail}
                />
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowRecipientModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddRecipient}
              >
                <Text style={styles.submitButtonText}>Add Recipient</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    flexWrap: 'wrap',
  },
  breadcrumbText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  breadcrumbTextActive: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  storeName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flexDirection: 'row',
    padding: 24,
    gap: 24,
    flexWrap: 'wrap',
  },
  leftColumn: {
    flex: 1,
    minWidth: 300,
    gap: 24,
  },
  rightColumn: {
    flex: 1,
    minWidth: 300,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 20,
  },
  addRecipientButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  addRecipientText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e8eaed',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  deliveryOptionActive: {
    borderColor: Colors.light.primary,
    backgroundColor: '#f0fdf7',
  },
  deliveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deliveryIconText: {
    fontSize: 24,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  deliverySubtitle: {
    fontSize: 13,
    color: '#999',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: Colors.light.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productImageIcon: {
    fontSize: 28,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 13,
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  promoSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  promoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#90EE90',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#1a1a1a',
    fontSize: 15,
    fontWeight: '700',
  },
  orderDetails: {
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  payButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  errorMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
  },
  selectedRecipient: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0fdf7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  recipientInfo: {
    gap: 6,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  recipientDetails: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 24,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  formInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  countryDropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  countryList: {
    maxHeight: 200,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBox: {
    width: 80,
    height: 50,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#e8eaed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

