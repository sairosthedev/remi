import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  LogOut,
  Package,
  Edit3,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { apiClient, Order } from '@/api/client';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { logout, user, token, refreshUser } = useAuth();
  // Debug: log user changes to verify frontend receives updated user object
  useEffect(() => {
    console.log('[Profile] user changed:', user);
  }, [user]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token]);

  // ============ Data Loading ============
  const loadUserData = async () => {
    try {
      setLoadingOrders(true);
      await refreshUser();
      const response = await apiClient.getOrders({ limit: 10 });
      setOrders(response.orders || []);
    } catch (error: any) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoadingOrders(false);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  // ============ Event Handlers ============
  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleViewOrder = (orderId: string) => {
    if (orderId) {
      Alert.alert(
        'Order Details',
        `Order ID: ${orderId}\n\nOrder details feature coming soon!`
      );
    } else {
      Alert.alert('All Orders', 'Orders list feature coming soon!');
    }
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings feature coming soon!');
  };

  // ============ Utility Functions ============
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      completed: '#4CAF50',
      processing: '#FF9800',
      pending: '#2196F3',
      cancelled: '#F44336',
    };
    return statusColorMap[status] || '#666';
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // ============ Loading State ============
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ============ Main Render ============
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.light.primary}
          />
        }
      >
        {/* Header Section */}
        <HeaderSection />

        {/* Quick Stats */}
        <StatsSection orders={orders} />

        {/* Personal Information */}
        <PersonalInfoSection user={user} onEdit={handleEditProfile} />

        {/* Recent Orders */}
        <RecentOrdersSection
          orders={orders}
          loadingOrders={loadingOrders}
          onViewOrder={handleViewOrder}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
        />

        {/* Menu Items */}
        <MenuSection onSettings={handleSettings} onLogout={handleLogout} />

        {/* Footer */}
        <FooterSection />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ Sub-Components ============
function HeaderSection() {
  const { user } = useAuth();

  const handleVerifyEmail = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'Email not found');
      return;
    }

    try {
      await apiClient.resendVerification(user.email);
      Alert.alert(
        'Verification Code Sent',
        'Check your email for the verification code. Go to the verification screen to enter it.'
      );
      // Navigate to verification screen
      router.push('/(auth)/verification');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend verification code');
    }
  };

  return (
    <LinearGradient
      colors={['#00A859', '#008a47', '#006b39']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.header}>
        {/* Avatar with Enhanced Shadow */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarOuterRing} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]?.toUpperCase()}
              {user?.lastName?.[0]?.toUpperCase()}
            </Text>
          </View>
          {user?.isVerified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle size={22} color="#fff" fill="#4CAF50" />
            </View>
          )}
        </View>

        {/* User Info with Better Spacing */}
        <Text style={styles.name}>
          {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* Verification Status with Enhanced Styling */}
        <View style={styles.verificationStatus}>
          {user?.isVerified ? (
            <View style={styles.statusBadgeVerified}>
              <CheckCircle size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.statusBadgeUnverified}
              onPress={handleVerifyEmail}
            >
              <XCircle size={16} color="#FF9800" />
              <Text style={styles.unverifiedText}>Verify Email</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

function StatsSection({ orders }: { orders: Order[] }) {
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const activeCount = orders.filter(
    (o) => o.status === 'processing' || o.status === 'pending'
  ).length;

  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Package size={26} color="#00A859" />
        </View>
        <Text style={styles.statNumber}>{orders.length}</Text>
        <Text style={styles.statLabel}>Total Orders</Text>
      </TouchableOpacity>

      <View style={styles.statDivider} />

      <TouchableOpacity style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <CheckCircle size={26} color="#4CAF50" />
        </View>
        <Text style={styles.statNumber}>{completedCount}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </TouchableOpacity>

      <View style={styles.statDivider} />

      <TouchableOpacity style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Package size={26} color="#FF9800" />
        </View>
        <Text style={styles.statNumber}>{activeCount}</Text>
        <Text style={styles.statLabel}>In Progress</Text>
      </TouchableOpacity>
    </View>
  );
}

function PersonalInfoSection({
  user,
  onEdit,
}: {
  user: any;
  onEdit: () => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text style={styles.sectionSubtitle}>
            Manage your profile details
          </Text>
        </View>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Edit3 size={18} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <InfoRow
          icon={<Mail size={22} color="#00A859" />}
          label="Email Address"
          value={user?.email || 'Not set'}
        />
        {user?.phone && (
          <InfoRow
            icon={<Phone size={22} color="#00A859" />}
            label="Phone Number"
            value={user.phone}
            isLast={!user?.firstName}
          />
        )}
        <InfoRow
          icon={<User size={22} color="#00A859" />}
          label="Full Name"
          value={user ? `${user.firstName} ${user.lastName}` : 'Not set'}
          isLast
        />
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  isLast,
}: {
  icon: any;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function RecentOrdersSection({
  orders,
  loadingOrders,
  onViewOrder,
  formatDate,
  getStatusColor,
  getStatusLabel,
}: {
  orders: Order[];
  loadingOrders: boolean;
  onViewOrder: (orderId: string) => void;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <TouchableOpacity onPress={() => router.push('/orders')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {loadingOrders ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.light.primary} />
        </View>
      ) : orders.length === 0 ? (
        <EmptyOrdersPlaceholder />
      ) : (
        <OrdersList
          orders={orders}
          onViewOrder={onViewOrder}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
        />
      )}
    </View>
  );
}

function EmptyOrdersPlaceholder() {
  return (
    <View style={styles.emptyOrders}>
      <Package size={48} color="#ccc" />
      <Text style={styles.emptyText}>No orders yet</Text>
      <Text style={styles.emptySubtext}>
        Start shopping to see your orders here
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => router.push('/(tabs)/shop')}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

function OrdersList({
  orders,
  onViewOrder,
  formatDate,
  getStatusColor,
  getStatusLabel,
}: {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}) {
  return (
    <View style={styles.ordersList}>
      {orders.slice(0, 5).map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          onPress={() => onViewOrder(order._id)}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
        />
      ))}
    </View>
  );
}

function OrderCard({
  order,
  onPress,
  formatDate,
  getStatusColor,
  getStatusLabel,
}: {
  order: Order;
  onPress: () => void;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}) {
  const statusColor = getStatusColor(order.status);

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>
            Order #{order._id.slice(-8).toUpperCase()}
          </Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor + '20' },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {getStatusLabel(order.status)}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.orderDetails}>
        <Text style={styles.orderItems}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.orderTotal}>
          ${order.totalAmount.toFixed(2)}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.orderFooter}>
        <View style={styles.orderAddress}>
          <MapPin size={14} color="#666" />
          <Text style={styles.orderAddressText}>
            {order.shippingAddress.city}, {order.shippingAddress.country}
          </Text>
        </View>
        <ChevronRight size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
}

function MenuSection({
  onSettings,
  onLogout,
}: {
  onSettings: () => void;
  onLogout: () => void;
}) {
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={[styles.menuItem, styles.menuItemPrimary]}
        onPress={onSettings}
      >
        <View style={styles.menuIconWrapper}>
          <Settings size={24} color="#00A859" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.menuItemTitle}>Settings</Text>
          <Text style={styles.menuItemSubtitle}>
            Manage account preferences
          </Text>
        </View>
        <ChevronRight size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, styles.menuItemDanger]}
        onPress={onLogout}
      >
        <View style={styles.menuIconWrapperDanger}>
          <LogOut size={24} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuItemTitle, { color: Colors.light.error }]}>
            Log Out
          </Text>
          <Text style={styles.menuItemSubtitle}>
            Sign out of your account
          </Text>
        </View>
        <ChevronRight size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
}

function FooterSection() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Remi v1.0.0</Text>
    </View>
  );
}

// ============ Styles ============
const SHADOW_IOS = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
};

const SHADOW_ELEVATION = 2;

const shadowStyle = Platform.select({
  ios: SHADOW_IOS,
  android: { elevation: SHADOW_ELEVATION },
});

const styles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header Section
  headerGradient: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatarOuterRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: -10,
    left: -10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 16,
    fontWeight: '500',
  },
  verificationStatus: {
    marginTop: 12,
  },
  statusBadgeVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  statusBadgeUnverified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  unverifiedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -28,
    marginBottom: 32,
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f0f7f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e8eef0',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Section Layouts
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00A859',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  viewAllText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  // Personal Info Section
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...shadowStyle,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f7f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 17,
    color: Colors.light.text,
    fontWeight: '700',
  },

  // Orders Section
  emptyOrders: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: '#00A859',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#00A859',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ordersList: {
    gap: 14,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#00A859',
    ...shadowStyle,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  orderId: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 6,
  },
  orderDate: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  orderItems: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: 19,
    fontWeight: '800',
    color: '#00A859',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderAddressText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },

  // Menu Section
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    ...shadowStyle,
  },
  menuItemPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: '#00A859',
  },
  menuItemDanger: {
    marginTop: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.error,
  },
  menuIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f0f7f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconWrapperDanger: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.light.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  footerText: {
    fontSize: 13,
    color: '#bbb',
    fontWeight: '600',
  },
});
