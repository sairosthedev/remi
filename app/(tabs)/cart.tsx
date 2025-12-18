import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, ArrowRight } from 'lucide-react-native';

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.itemCount}>2 Items</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cartItem}>
              <View style={styles.itemImagePlaceholder} />
              <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>Family Grocery Pack</Text>
                  <Text style={styles.itemPrice}>$85.00</Text>
                  <View style={styles.quantityControls}>
                      <TouchableOpacity style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
                      <Text style={styles.qtyText}>1</Text>
                      <TouchableOpacity style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
                  </View>
              </View>
              <TouchableOpacity style={styles.deleteBtn}>
                  <Trash2 size={20} color={Colors.light.error} />
              </TouchableOpacity>
          </View>
           <View style={styles.cartItem}>
              <View style={styles.itemImagePlaceholder} />
              <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>Cooking Oil (5L)</Text>
                  <Text style={styles.itemPrice}>$18.00</Text>
                   <View style={styles.quantityControls}>
                      <TouchableOpacity style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
                      <Text style={styles.qtyText}>1</Text>
                      <TouchableOpacity style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
                  </View>
              </View>
              <TouchableOpacity style={styles.deleteBtn}>
                  <Trash2 size={20} color={Colors.light.error} />
              </TouchableOpacity>
          </View>
      </ScrollView>

      <View style={styles.footer}>
          <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>$103.00</Text>
          </View>
          <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>$2.50</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>$105.50</Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <ArrowRight size={20} color="#fff" />
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
  header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors.light.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
  },
  headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors.light.text,
  },
  itemCount: {
      fontSize: 16,
      color: '#666',
  },
  scrollContent: {
      padding: 20,
  },
  cartItem: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: Colors.light.surface,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: Colors.light.border,
  },
  itemImagePlaceholder: {
      width: 80,
      height: 80,
      backgroundColor: '#eee',
      borderRadius: 12,
      marginRight: 16,
  },
  itemDetails: {
      flex: 1,
      justifyContent: 'space-between',
  },
  itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.light.text,
  },
  itemPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.light.primary,
  },
  quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  qtyBtn: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: '#eee',
      alignItems: 'center',
      justifyContent: 'center',
  },
  qtyText: {
      fontWeight: '600',
      fontSize: 16,
  },
  deleteBtn: {
      justifyContent: 'center',
      paddingLeft: 8,
  },
  footer: {
      padding: 24,
      backgroundColor: Colors.light.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 20,
  },
  summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
  },
  summaryLabel: {
      fontSize: 16,
      color: '#666',
  },
  summaryValue: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.light.text,
  },
  divider: {
      height: 1,
      backgroundColor: Colors.light.border,
      marginVertical: 12,
  },
  totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.light.text,
  },
  totalValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.light.primary,
  },
  checkoutBtn: {
      backgroundColor: Colors.light.primary,
      height: 56,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 24,
  },
  checkoutBtnText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  },
});
