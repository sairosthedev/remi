import { StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';

export default function CartScreen() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 47,
    minutes: 59,
    seconds: 44,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order Summary</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add items to get started</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)/shop')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order Summary</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Countdown Timer */}
        <LinearGradient
          colors={['#FF9800', '#F57C00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.timerBanner}
        >
          <Text style={styles.timerLabel}>ORDER EXPIRES IN</Text>
          <View style={styles.timerContainer}>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{formatTime(timeRemaining.hours)}</Text>
              <Text style={styles.timerUnit}>HOURS</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{formatTime(timeRemaining.minutes)}</Text>
              <Text style={styles.timerUnit}>MINS</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerValue}>{formatTime(timeRemaining.seconds)}</Text>
              <Text style={styles.timerUnit}>SECS</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Items Header */}
        <View style={styles.itemsHeader}>
          <Text style={styles.itemsCount}>{items.length} {items.length === 1 ? 'Item' : 'Items'}</Text>
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearAll}>Clear all</Text>
          </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Product</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Quantity</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Subtotal</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Cart Items */}
        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={[styles.itemColumn, { flex: 2 }]}>
                <View style={styles.productImagePlaceholder}>
                  <Text style={styles.productImageIcon}>🍾</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                </View>
              </View>

              <View style={[styles.itemColumn, { flex: 1 }]}>
                <Text style={styles.priceText}>USD {item.price.toFixed(2)}</Text>
              </View>

              <View style={[styles.itemColumn, { flex: 1 }]}>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.qtyButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={14} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.itemColumn, { flex: 1 }]}>
                <Text style={styles.subtotalText}>USD {(item.price * item.quantity).toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Trash2 size={18} color="#999" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Store</Text>
            <Text style={styles.detailValue}>{items[0]?.store || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Destination country</Text>
            <Text style={styles.detailValue}>{items[0]?.country || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{items[0]?.category || 'N/A'}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>USD {getTotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <View style={styles.checkoutContainer}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => router.push('/checkout')}
          >
            <Text style={styles.checkoutButtonText}>Proceed To Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
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
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  timerBanner: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  timerLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  timerBox: {
    backgroundColor: 'rgba(51, 0, 255, 0.09)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 22, 22, 0.97)',
  },
  timerValue: {
    color: '#000',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  timerUnit: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  itemsCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  clearAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e8eaed',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsList: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productImageIcon: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  qtyButton: {
    width: 18,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  qtyButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    minWidth: 1/2,
    textAlign: 'center',
  },
  subtotalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  deleteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  orderDetails: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    color: '#1a1a1a',
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  checkoutContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
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
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 10,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
