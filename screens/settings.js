import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
//import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_OPTIONS = [
  { id: '1', title: 'Profile', icon: 'person', screen: 'Profile' },
  { id: '2', title: 'Home', icon: 'home', screen: 'Home' },
  { id: '3', title: 'Cart', icon: 'shopping-cart', screen: 'Cart' },
];

const SettingsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <Text style={styles.settingItemText}>Account Information</Text>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('PrivacyPolicyScreen')}
        >
          <Text style={styles.settingItemText}>Privacy Policy</Text>
        </TouchableOpacity>

        <Text style={styles.settingItemText}>Terms of Service</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <Text style={styles.settingItemText}>Notifications</Text>
        <Text style={styles.settingItemText}>Language</Text>
        <Text style={styles.settingItemText}>Dark Mode</Text>
      </View>
      
 
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('FAQScreen')}
        >
          <Text style={styles.settingItemText}>Frequently Asked Questions (FAQ)</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.buttonContainer}>
        <Button
          title="Go to Profile"
          onPress={() => navigation.navigate('ProfileScreen')}
          color="#3498db"
        />
        <Button
          title="Go to Home"
          onPress={() => navigation.navigate('HomeScreen')}
          color="#2ecc71"
        />
        <Button
          title="Go to Cart"
          onPress={() => navigation.navigate('CartScreen')}
          color="#e74c3c"
        />
        <Button
          title="Log Out"
          onPress={() => navigation.navigate('LoginScreen')}
          color="#95a5a6"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  settingItem: {
    paddingVertical: 10,
    marginBottom: 5, 
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItemText: {
    fontSize: 16,
    paddingVertical: 5, 
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SettingsScreen;