import { StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Star, Truck, ShieldCheck, Heart } from 'lucide-react-native';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: '',
        headerStyle: { backgroundColor: Colors.light.background },
        headerShadowVisible: false,
        headerLeft: () => (
             <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                 <Text style={styles.closeText}>Close</Text>
             </TouchableOpacity>
        ),
        headerRight: () => (
            <TouchableOpacity style={styles.likeBtn}>
                <Heart size={24} color={Colors.light.text} />
            </TouchableOpacity>
        )
      }} />
      
      <ScrollView>
          <View style={styles.imageContainer}>
              <View style={styles.placeholderImage} />
          </View>

          <View style={styles.content}>
              <View style={styles.header}>
                   <Text style={styles.title}>Family Grocery Pack</Text> 
                   <View style={styles.rating}>
                       <Star size={16} color="#FFC107" fill="#FFC107" />
                       <Text style={styles.ratingText}>4.8 (124 reviews)</Text>
                   </View>
              </View>

              <Text style={styles.price}>$85.00</Text>

              <View style={styles.features}>
                  <View style={styles.featureItem}>
                      <Truck size={20} color={Colors.light.primary} />
                      <Text style={styles.featureText}>Next Day Delivery</Text>
                  </View>
                   <View style={styles.featureItem}>
                      <ShieldCheck size={20} color={Colors.light.secondary} />
                      <Text style={styles.featureText}>Quality Guarantee</Text>
                  </View>
              </View>

              <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>
                      This pack contains essential monthly groceries for a family of 4. Includes rice, oil, flour, sugar, and canned goods. Sourced from premium local suppliers.
                  </Text>
              </View>
          </View>
      </ScrollView>

      <View style={styles.footer}>
          <TouchableOpacity style={styles.addToCartBtn}>
              <Text style={styles.addToCartText}>Add to Cart - $85.00</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  closeBtn: {
      padding: 8,
  },
  closeText: {
      fontSize: 16,
      color: Colors.light.primary,
  },
  likeBtn: {
      padding: 8,
  },
  imageContainer: {
      height: 300,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
  },
  placeholderImage: {
      width: 200,
      height: 200,
      backgroundColor: '#e0e0e0',
      borderRadius: 20,
  },
  content: {
      padding: 24,
  },
  header: {
      marginBottom: 8,
  },
  title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: Colors.light.text,
      marginBottom: 8,
  },
  rating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  ratingText: {
      fontSize: 14,
      color: '#666',
  },
  price: {
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors.light.primary,
      marginBottom: 24,
  },
  features: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 32,
      padding: 16,
      backgroundColor: Colors.light.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.light.border,
  },
  featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  featureText: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.light.text,
  },
  section: {
      marginBottom: 24,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      color: Colors.light.text,
  },
  description: {
      fontSize: 16,
      lineHeight: 24,
      color: '#666',
  },
  footer: {
      padding: 24,
      backgroundColor: Colors.light.surface,
      borderTopWidth: 1,
      borderTopColor: Colors.light.border,
  },
  addToCartBtn: {
      backgroundColor: Colors.light.text,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
  },
  addToCartText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  },
});
