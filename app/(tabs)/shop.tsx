import { StyleSheet, ScrollView, TouchableOpacity, Image, Platform, TextInput, Modal, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight, Star } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

// Sample service providers data
const SERVICE_PROVIDERS = [
  // Groceries in Bulawayo
  {
    id: '1',
    name: 'Saimart',
    deliveryType: 'Pickup',
    hours: '8:00AM - 8:00PM',
    rating: 4.8,
    reviews: 245,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['groceries', 'liquor']
  },
  {
    id: '2',
    name: 'OK Zimbabwe',
    deliveryType: 'Delivery',
    hours: '7:00AM - 10:00PM',
    rating: 4.9,
    reviews: 892,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['groceries', 'liquor']
  },
  {
    id: '4',
    name: 'Bon Marché',
    deliveryType: 'Both',
    hours: '6:00AM - 11:00PM',
    rating: 4.6,
    reviews: 423,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['groceries', 'farming']
  },
  {
    id: '5',
    name: 'Pick n Pay',
    deliveryType: 'Delivery',
    hours: '8:00AM - 8:00PM',
    rating: 4.8,
    reviews: 1024,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['groceries']
  },
  {
    id: '6',
    name: 'Food Lovers Market',
    deliveryType: 'Both',
    hours: '7:00AM - 9:00PM',
    rating: 4.7,
    reviews: 678,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['groceries']
  },
  {
    id: '7',
    name: 'Choppies',
    deliveryType: 'Pickup',
    hours: '8:00AM - 8:30PM',
    rating: 4.5,
    reviews: 342,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['groceries']
  },
  // Liquor in Bulawayo
  {
    id: '8',
    name: 'Delta Beverages',
    deliveryType: 'Both',
    hours: '9:00AM - 7:00PM',
    rating: 4.9,
    reviews: 567,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['liquor']
  },
  {
    id: '9',
    name: 'Innscor Liquor Store',
    deliveryType: 'Pickup',
    hours: '10:00AM - 6:00PM',
    rating: 4.7,
    reviews: 234,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['liquor']
  },
  // Farming in Bulawayo
  {
    id: '10',
    name: 'Agricura',
    deliveryType: 'Delivery',
    hours: '7:00AM - 5:00PM',
    rating: 4.8,
    reviews: 189,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['farming']
  },
  {
    id: '11',
    name: 'Farm & City',
    deliveryType: 'Both',
    hours: '8:00AM - 6:00PM',
    rating: 4.6,
    reviews: 145,
    location: 'Bulawayo',
    country: 'Zimbabwe',
    categories: ['farming']
  },
  // Other cities for testing
  {
    id: '3',
    name: 'TM Supermarkets',
    deliveryType: 'Pickup',
    hours: '8:00AM - 9:00PM',
    rating: 4.7,
    reviews: 567,
    location: 'Harare',
    country: 'Zimbabwe',
    categories: ['groceries']
  },
];

export default function ShopScreen() {
  const params = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(params.category as string || 'groceries');
  const [selectedCountry, setSelectedCountry] = useState(params.country as string || 'Zimbabwe');
  const [selectedCity, setSelectedCity] = useState(params.city as string || 'Bulawayo');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Available options
  const categories = ['groceries', 'liquor', 'farming', 'beverages'];
  const countries = [...new Set(SERVICE_PROVIDERS.map(p => p.country))];
  const cities = [...new Set(SERVICE_PROVIDERS.filter(p => p.country === selectedCountry).map(p => p.location))];

  // Debug: Log the current filters
  console.log('Shop Filters:', {
    category: selectedCategory,
    country: selectedCountry,
    city: selectedCity,
    totalProviders: SERVICE_PROVIDERS.length
  });

  // Filter providers based on selections
  const filteredProviders = SERVICE_PROVIDERS.filter(provider => {
    // Normalize strings for comparison (trim and lowercase)
    const categoryLower = selectedCategory.toLowerCase().trim();
    const countryLower = selectedCountry.toLowerCase().trim();
    const cityLower = selectedCity.toLowerCase().trim();
    const searchLower = searchQuery.toLowerCase().trim();
    
    // Check if category matches (handle both "beverages" and "liquor" as same)
    const normalizedCategory = categoryLower === 'beverages' ? 'liquor' : categoryLower;
    const matchesCategory = provider.categories.some(cat => 
      cat.toLowerCase() === normalizedCategory
    );
    
    // Check country match
    const matchesCountry = !countryLower || provider.country.toLowerCase().trim() === countryLower;
    
    // Check city match
    const matchesCity = !cityLower || provider.location.toLowerCase().trim() === cityLower;
    
    // Check search query (empty search matches all)
    const matchesSearch = !searchLower || provider.name.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesCountry && matchesCity && matchesSearch;
  });

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'groceries': 'Groceries',
      'liquor': 'Liquor',
      'beverages': 'Beverages',
      'farming': 'Farming',
    };
    return categoryMap[category.toLowerCase()] || category;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Breadcrumb */}
          <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.breadcrumbLink}>Services</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}> › </Text>
          <Text style={styles.breadcrumbCurrent}>{getCategoryDisplayName(selectedCategory)}</Text>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            {/* Category Dropdown */}
            <TouchableOpacity 
              style={styles.filterDropdown}
              onPress={() => setShowCategoryDropdown(true)}
            >
              <View style={styles.filterDropdownContent}>
                <Text style={styles.filterDropdownText}>{getCategoryDisplayName(selectedCategory)}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>
            </TouchableOpacity>

            {/* Country Dropdown */}
            <TouchableOpacity 
              style={styles.filterDropdown}
              onPress={() => setShowCountryDropdown(true)}
            >
              <View style={styles.filterDropdownContent}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.filterDropdownText}>{selectedCountry}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>
            </TouchableOpacity>

            {/* City Dropdown */}
            <TouchableOpacity 
              style={styles.filterDropdown}
              onPress={() => setShowCityDropdown(true)}
            >
              <View style={styles.filterDropdownContent}>
                <Text style={styles.filterDropdownText}>{selectedCity}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.advancedFiltersButton}
              onPress={() => setShowAdvancedFilters(true)}
            >
              <Text style={styles.advancedFiltersButtonText}>Advanced Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Remipey"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredProviders.length} {filteredProviders.length === 1 ? 'Provider' : 'Providers'} Found
          </Text>
        </View>

        {/* Service Providers List */}
        <View style={styles.providersList}>
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={styles.providerCard}
                onPress={() => router.push(`/provider/${provider.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.providerImageContainer}>
                  <View style={styles.providerImagePlaceholder}>
                    <Text style={styles.providerImageText}>{provider.name.charAt(0)}</Text>
                  </View>
                </View>

                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  
                  <View style={styles.providerMeta}>
                    <View style={styles.deliveryBadge}>
                      <Text style={styles.deliveryBadgeText}>{provider.deliveryType}</Text>
                    </View>
                    
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFC107" fill="#FFC107" />
                      <Text style={styles.ratingText}>{provider.rating}</Text>
                      <Text style={styles.reviewsText}>({provider.reviews})</Text>
                    </View>
                  </View>

                  <View style={styles.hoursContainer}>
                    <Text style={styles.clockIcon}>🕐</Text>
                    <Text style={styles.hoursText}>{provider.hours}</Text>
                  </View>
                </View>

                <ChevronRight size={20} color="#ccc" style={styles.providerArrow} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Providers Found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your filters or search in a different location
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Category Dropdown Modal */}
      <Modal
        visible={showCategoryDropdown}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryDropdown(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.modalOption,
                    selectedCategory === category && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedCategory === category && styles.modalOptionTextSelected
                  ]}>
                    {getCategoryDisplayName(category)}
                  </Text>
                  {selectedCategory === category && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Country Dropdown Modal */}
      <Modal
        visible={showCountryDropdown}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryDropdown(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country}
                  style={[
                    styles.modalOption,
                    selectedCountry === country && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedCountry(country);
                    setShowCountryDropdown(false);
                    // Reset city when country changes
                    const citiesInCountry = SERVICE_PROVIDERS
                      .filter(p => p.country === country)
                      .map(p => p.location);
                    if (citiesInCountry.length > 0 && !citiesInCountry.includes(selectedCity)) {
                      setSelectedCity(citiesInCountry[0]);
                    }
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedCountry === country && styles.modalOptionTextSelected
                  ]}>
                    📍 {country}
                  </Text>
                  {selectedCountry === country && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* City Dropdown Modal */}
      <Modal
        visible={showCityDropdown}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCityDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityDropdown(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.modalOption,
                    selectedCity === city && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedCity(city);
                    setShowCityDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedCity === city && styles.modalOptionTextSelected
                  ]}>
                    {city}
                  </Text>
                  {selectedCity === city && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  breadcrumbLink: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterDropdown: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  filterDropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  filterDropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#666',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  advancedFiltersButton: {
    flex: 2,
    backgroundColor: '#003d82',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  advancedFiltersButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#e8eaed',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 12,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  providersList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  providerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  providerImageContainer: {
    marginRight: 16,
  },
  providerImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8f5e9',
  },
  providerImageText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  deliveryBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E65100',
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clockIcon: {
    fontSize: 14,
  },
  hoursText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  providerArrow: {
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  modalList: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  modalOptionSelected: {
    backgroundColor: '#f0fdf7',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  modalOptionTextSelected: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 20,
    color: Colors.light.primary,
    fontWeight: '700',
  },
});
