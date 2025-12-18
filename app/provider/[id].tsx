import { StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Platform, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight, Star, ShoppingCart, Plus } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

// Sample products data
const PRODUCTS = [
  {
    id: '1',
    name: 'Win Vodka',
    price: 0.49,
    rating: 0,
    reviews: 0,
    image: null,
    category: 'liquor',
    stock: 50
  },
  {
    id: '2',
    name: 'Whitestone Gin Pineapple',
    price: 5.93,
    rating: 0,
    reviews: 0,
    image: null,
    category: 'liquor',
    stock: 30
  },
  {
    id: '3',
    name: 'Viceroy',
    price: 9.89,
    rating: 0,
    reviews: 0,
    image: null,
    category: 'liquor',
    stock: 45
  },
  {
    id: '4',
    name: 'Van Loveren',
    price: 9.89,
    rating: 0,
    reviews: 0,
    image: null,
    category: 'liquor',
    stock: 25
  },
  {
    id: '5',
    name: 'Castle Lager 750ml',
    price: 1.50,
    rating: 4.5,
    reviews: 128,
    image: null,
    category: 'beer',
    stock: 100
  },
  {
    id: '6',
    name: 'Savanna Dry 500ml',
    price: 1.75,
    rating: 4.7,
    reviews: 89,
    image: null,
    category: 'beer',
    stock: 80
  },
  {
    id: '7',
    name: 'Jameson Irish Whiskey',
    price: 15.99,
    rating: 4.8,
    reviews: 234,
    image: null,
    category: 'spirits',
    stock: 20
  },
  {
    id: '8',
    name: 'Amarula Cream Liqueur',
    price: 12.50,
    rating: 4.9,
    reviews: 456,
    image: null,
    category: 'liquor',
    stock: 35
  },
];

const PROVIDER_DATA: { [key: string]: any } = {
  '1': {
    name: 'Saimart',
    location: 'Bulawayo, Zimbabwe',
    deliveryOptions: ['Pickup'],
    rating: 4.8,
    reviews: 245,
    hours: '8:00AM - 8:00PM',
    description: 'Your trusted neighborhood store for quality products'
  },
  '2': {
    name: 'OK Zimbabwe',
    location: 'Bulawayo, Zimbabwe',
    deliveryOptions: ['Delivery'],
    rating: 4.9,
    reviews: 892,
    hours: '7:00AM - 10:00PM',
    description: 'Leading retail chain with wide selection'
  },
  // Add more providers as needed
};

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🛒' },
  { id: 'beer', name: 'Beer & Ciders', icon: '🍺' },
  { id: 'liquor', name: 'Liquor', icon: '🍾' },
  { id: 'spirits', name: 'Spirits', icon: '🥃' },
  { id: 'wine', name: 'Wine', icon: '🍷' },
];

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, getTotal, getItemCount } = useCart();

  const provider = PROVIDER_DATA[id as string] || PROVIDER_DATA['1'];
  const cartTotal = getTotal();
  const cartCount = getItemCount();

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      store: provider.name,
      category: product.category,
      country: provider.location.split(',')[1]?.trim() || 'Zimbabwe',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
            <Text style={styles.breadcrumbLink}>Services</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}> › </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.breadcrumbLink}>Liquor</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}> › </Text>
          <Text style={styles.breadcrumbCurrent}>Create Order</Text>
        </View>

        {/* Provider Header */}
        <View style={styles.providerHeader}>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>Shopping in {provider.location}</Text>
            </View>
          </View>
        </View>

        {/* Search and Cart Bar */}
        <View style={styles.searchCartBar}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${provider.name} catalogue`}
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.cartInfo}>
            <Text style={styles.cartTotal}>USD {cartTotal.toFixed(2)}</Text>
            <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/(tabs)/cart')}>
              <ShoppingCart size={20} color={Colors.light.primary} />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
              <Text style={styles.cartText}>Cart</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Voucher Banner */}
        <LinearGradient
          colors={['#00bf66', '#00A859']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.voucherBanner}
        >
          <View style={styles.voucherContent}>
            <Text style={styles.voucherTitle}>Give the Gift of <Text style={styles.voucherHighlight}>Choice</Text></Text>
            <Text style={styles.voucherDesc}>Buy a voucher and let them choose exactly what they need</Text>
          </View>
          <TouchableOpacity style={styles.voucherButton}>
            <Text style={styles.voucherButtonText}>Buy Voucher</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Seller Details */}
        <View style={styles.sellerDetails}>
          <Text style={styles.sellerDetailsTitle}>SELLER DETAILS</Text>
          <View style={styles.deliveryOptions}>
            <Text style={styles.deliveryLabel}>Delivery Options:</Text>
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryBadgeText}>{provider.deliveryOptions[0]}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View More</Text>
            <Text style={styles.viewMoreArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Filters/Categories */}
        <View style={styles.filtersSection}>
          <Text style={styles.filtersTitle}>Filters</Text>
          <TouchableOpacity style={styles.clearFilters}>
            <Text style={styles.clearFiltersText}>⊗ Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>CATEGORIES</Text>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.categoryItemActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryExpand}>+</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Products Grid */}
        <View style={styles.productsSection}>
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <View style={styles.productImagePlaceholder}>
                    <Text style={styles.productImageIcon}>🍾</Text>
                  </View>
                  <View style={styles.productImageBadge}>
                    <Text style={styles.productImageBadgeText}>1</Text>
                  </View>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  
                  {product.rating > 0 ? (
                    <View style={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          color={star <= product.rating ? '#FFC107' : '#e0e0e0'}
                          fill={star <= product.rating ? '#FFC107' : '#e0e0e0'}
                        />
                      ))}
                    </View>
                  ) : (
                    <View style={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} color="#e0e0e0" fill="none" />
                      ))}
                    </View>
                  )}

                  <Text style={styles.productPrice}>USD {product.price.toFixed(2)}</Text>

                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => handleAddToCart(product)}
                  >
                    <Text style={styles.addToCartText}>Add To Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breadcrumbLink: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  breadcrumbSeparator: {
    fontSize: 13,
    color: '#999',
    marginHorizontal: 6,
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  providerHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  providerInfo: {
    marginBottom: 4,
  },
  providerName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIcon: {
    fontSize: 15,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  searchCartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: '#fff',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 10,
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cartTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f9f4',
    borderRadius: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: 6,
    backgroundColor: '#ff3b30',
    borderRadius: 11,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  cartText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  voucherBanner: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  voucherContent: {
    flex: 1,
    marginRight: 16,
  },
  voucherTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  voucherHighlight: {
    fontSize: 22,
    fontWeight: '800',
  },
  voucherDesc: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.95,
    lineHeight: 20,
  },
  voucherButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  voucherButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sellerDetails: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 1,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sellerDetailsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#999',
    marginBottom: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  deliveryOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  deliveryLabel: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
    marginRight: 12,
  },
  deliveryBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  deliveryBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E65100',
    letterSpacing: 0.3,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  viewMoreText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '700',
  },
  viewMoreArrow: {
    fontSize: 10,
    color: Colors.light.primary,
  },
  filtersSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  clearFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f9f4',
    borderRadius: 6,
  },
  clearFiltersText: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '700',
  },
  categoriesSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#999',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  categoryItemActive: {
    backgroundColor: '#f0f9f4',
    marginHorizontal: -24,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderBottomWidth: 0,
    marginBottom: 2,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  categoryExpand: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '300',
  },
  productsSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  productImageContainer: {
    position: 'relative',
  },
  productImagePlaceholder: {
    height: 170,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImageIcon: {
    fontSize: 56,
  },
  productImageBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 32,
    alignItems: 'center',
  },
  productImageBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  productInfo: {
    padding: 14,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
    height: 42,
    lineHeight: 21,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  addToCartButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

