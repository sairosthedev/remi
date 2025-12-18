
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
    const handleLogout = () => {
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>JD</Text>
                </View>
                <Text style={styles.name}>John Doe</Text>
                <Text style={styles.email}>john.doe@example.com</Text>
            </View>

            <View style={styles.menu}>
                 <TouchableOpacity style={styles.menuItem}>
                    <User size={24} color={Colors.light.text} />
                    <Text style={styles.menuText}>Personal Details</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.menuItem}>
                    <Settings size={24} color={Colors.light.text} />
                    <Text style={styles.menuText}>Settings</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <LogOut size={24} color={Colors.light.error} />
                     <Text style={[styles.menuText, { color: Colors.light.error }]}>Log Out</Text>
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
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: Colors.light.surface,
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    menu: {
        paddingHorizontal: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        gap: 16,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    }
});
