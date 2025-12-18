import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Plus, CreditCard, History, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
             <Text style={styles.greeting}>Good Morning,</Text>
             <Text style={styles.username}>John Doe</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>JD</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$2,540.00</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <View style={styles.actionIcon}>
                 <Plus size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Top Up</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.actionBtn}>
              <View style={styles.actionIcon}>
                 <Send size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
                <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/(tabs)/shop')}>
                    <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
                        <CreditCard size={24} color="#1565C0" />
                    </View>
                    <Text style={styles.quickActionText}>Shop Essentials</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={styles.quickActionCard}>
                    <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
                        <History size={24} color="#2E7D32" />
                    </View>
                    <Text style={styles.quickActionText}>History</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
           <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                   <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
           </View>
           
           <View style={styles.transactionsList}>
               {[1, 2, 3].map((_, i) => (
                   <View key={i} style={styles.transactionItem}>
                       <View style={styles.transactionIcon}>
                           <Send size={20} color="#666" />
                       </View>
                       <View style={styles.transactionDetails}>
                           <Text style={styles.transactionTitle}>Groceries for Mom</Text>
                           <Text style={styles.transactionDate}>Today, 10:23 AM</Text>
                       </View>
                       <Text style={styles.transactionAmount}>-$45.00</Text>
                   </View>
               ))}
           </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Invite Friends</Text>
                <Text style={styles.promoDesc}>Get $5 fo every friend you invite to Remipey.</Text>
            </View>
             <ChevronRight size={24} color="#fff" />
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  profileBtn: {},
  avatarPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors.light.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.light.border,
  },
  avatarText: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.light.primary,
  },
  balanceCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      gap: 8,
  },
  actionIcon: {
      
  },
  actionText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 15,
  },
  section: {
      marginBottom: 32,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.light.text,
      marginBottom: 16,
  },
  seeAll: {
      color: Colors.light.primary,
      fontWeight: '600',
  },
  quickActionsGrid: {
      flexDirection: 'row',
      gap: 16,
  },
  quickActionCard: {
      flex: 1,
      backgroundColor: Colors.light.surface,
      padding: 16,
      borderRadius: 20,
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: Colors.light.border,
  },
  quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
  },
  quickActionText: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.light.text,
  },
  transactionsList: {
      backgroundColor: Colors.light.surface,
      borderRadius: 20,
      padding: 8,
      borderWidth: 1,
      borderColor: Colors.light.border,
  },
  transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors.light.border,
  },
  transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  transactionDetails: {
      flex: 1,
  },
  transactionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.light.text,
      marginBottom: 4,
  },
  transactionDate: {
      fontSize: 13,
      color: '#888',
  },
  transactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.light.text,
  },
  promoBanner: {
      backgroundColor: '#2D3436',
      borderRadius: 20,
      padding: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  promoContent: {
      flex: 1,
  },
  promoTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  promoDesc: {
      color: '#ccc',
      fontSize: 14,
  },
});
