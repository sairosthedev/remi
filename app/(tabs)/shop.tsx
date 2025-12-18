import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star } from 'lucide-react-native';
import { router } from 'expo-router';

const CATEGORIES = [
  { id: '1', name: 'All', active: true },
  { id: '2', name: 'Groceries', active: false },
  { id: '3', name: 'Utilities', active: false },
  { id: '4', name: 'Hardware', active: false },
  { id: '5', name: 'Fuel', active: false },
];

const PRODUCTS = [
  { id: '1', name: 'Family Grocery Pack', price: '$85.00', rating: 4.8, reviews: 124, image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Cement (50kg)', price: '$12.50', rating: 4.9, reviews: 56, image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Prepaid Electricity', price: '$20.00', rating: 5.0, reviews: 890, image: 'https://via.placeholder.com/150' },
  { id: '4', name: 'Rice (25kg)', price: '$35.00', rating: 4.7, reviews: 89, image: 'https://via.placeholder.com/150' },
  { id: '5', name: 'Cooking Oil (5L)', price: '$18.00', rating: 4.6, reviews: 45, image: 'https://via.placeholder.com/150' },
];

export default function ShopScreen() {
  return (
    <SafeAreaView style={styles.container}>
       {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop Essentials</Text>
        <TouchableOpacity style={styles.filterBtn}>
           <Filter size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
         <Search size={20} color="#999" />
         <Text style={styles.searchPlaceholder}>Search for products...</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         {/* Categories */}
         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={[styles.categoryChip, cat.active && styles.categoryChipActive]}
                >
                    <Text style={[styles.categoryText, cat.active && styles.categoryTextActive]}>
                        {cat.name}
                    </Text>
                </TouchableOpacity>
            ))}
         </ScrollView>

         {/* Products Grid */}
         <View style={styles.productsGrid}>
            {PRODUCTS.map((item) => (
                <TouchableOpacity 
                   key={item.id} 
                   style={styles.productCard}
                   onPress={() => router.push(`/product/${item.id}`)}
                >
                    <View style={styles.productImagePlaceholder}>
                         <Text style={{color: '#ccc'}}>Image</Text>
                    </View>
                    <View style={styles.productInfo}>
                        <View style={styles.ratingContainer}>
                             <Star size={12} color="#FFC107" fill="#FFC107" />
                             <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
                        </View>
                        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                        <Text style={styles.productPrice}>{item.price}</Text>

                        <TouchableOpacity style={styles.addBtn}>
                             <Text style={styles.addBtnText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ))}
         </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  filterBtn: {
    padding: 8,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchContainer: {
     marginHorizontal: 20,
     marginVertical: 16,
     height: 50,
     backgroundColor: Colors.light.surface,
     borderWidth: 1,
     borderColor: Colors.light.border,
     borderRadius: 12,
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: 16,
     gap: 12,
  },
  searchPlaceholder: {
      color: '#999',
      fontSize: 16,
  },
  scrollContent: {
      paddingBottom: 40,
  },
  categoriesContainer: {
      paddingHorizontal: 20,
      marginBottom: 24,
  },
  categoryChip: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: Colors.light.surface,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: Colors.light.border,
      marginRight: 10,
  },
  categoryChipActive: {
      backgroundColor: Colors.light.primary,
      borderColor: Colors.light.primary,
  },
  categoryText: {
      fontWeight: '600',
      color: Colors.light.text,
  },
  categoryTextActive: {
      color: '#fff',
  },
  productsGrid: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
  },
  productCard: {
      width: '47%', // roughly half minus gap
      backgroundColor: Colors.light.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.light.border,
      overflow: 'hidden',
  },
  productImagePlaceholder: {
      height: 140,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
  },
  productInfo: {
      padding: 12,
  },
  ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 6,
  },
  ratingText: {
      fontSize: 12,
      color: '#666',
  },
  productName: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.light.text,
      marginBottom: 8,
      height: 40,
  },
  productPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.light.primary,
      marginBottom: 12,
  },
  addBtn: {
      backgroundColor: Colors.light.text,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
  },
  addBtnText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
  },
});
