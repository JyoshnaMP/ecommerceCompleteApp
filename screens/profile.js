import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useContext, useState, useLayoutEffect} from "react";
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from '../userContext';
import { jwtDecode } from 'jwt-decode';


const profile = () => {
  const {userId, setUserId } = useContext(UserType);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const navigation = useNavigation();

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {backgroundColor: "#00CED1"}, 
      headerLeft: ()=>(
        <Image 
          style={{height: 120, width: 140, resizeMode: "contain"}} 
          source={{uri: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c518.png"}}
        />
      ),
      headerRight: ()=>(
        <View style={{flexDirection: "row", alignItems: "center", gap: 6, marginRight: 12}}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <AntDesign name="search1" size={24} color="black"/>
        </View>
      )
    })
  });

  // Step 1 - Load userId from token if not already set
  useEffect(()=>{
    const loadUser = async()=>{
      try {
        if (!userId){
          const token = await AsyncStorage.getItem("authToken");
          if (token){
            const decode = jwtDecode(token);
            setUserId(decode.userId);
          }
        }
      }
      catch (error) {
        console.log("error loading user id", error);
      }
    };
    loadUser();
  }, []);

  // Step 2 - Fetch user profile once userId is available
  useEffect(()=>{
    if (!userId) return;
    const fetchUserProfile = async()=>{
      try {
        const response = await axios.get(
          `https://ecommerce-oa46.onrender.com/profile/${userId}`
        );
        const {user} = response.data;
        setUser(user);
      }
      catch(error){
        console.log("error fetching profile", error);
      }
    };
    fetchUserProfile();
  }, [userId]);

  // Step 3 - Fetch orders once userId is available
  useEffect(()=>{
    if (!userId) return;
    const fetchOrders = async()=>{
      try {
        const response = await axios.get(`https://ecommerce-oa46.onrender.com/orders/${userId}`);
        const orders = response.data.orders;
        setOrders(orders);
        setLoading(false);
      }
      catch(error){
        console.log("error fetching orders", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const logout = ()=>{
    clearAuthToken();
  };

  const clearAuthToken = async()=>{
    await AsyncStorage.removeItem("authToken");
    console.log("auth token cleared");
    navigation.replace("loginScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your orders or profile"
            placeholderTextColor="#888"
          />
        </View>

        {/* Profile Header */}
        <View style={styles.header}>
          <View style={[styles.profileImage, {backgroundColor: 'beige', justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={{fontSize: 48, fontWeight: 'bold', color: 'black'}}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.username}>{user?.email}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Current Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Past Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Buy It Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() => navigation.navigate("AddAddress")}>
            <Text style={styles.orderButtonText}>My Addresses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton} onPress={logout}>
            <Text style={styles.orderButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Orders Section */}
        <Text style={{fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10}}>Your Orders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {loading ? (
            <Text style={{color: 'gray'}}>Loading orders...</Text>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <TouchableOpacity 
                style={{marginTop: 20, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#D0D0D0', marginHorizontal: 10, justifyContent: 'center', alignItems: 'center'}} 
                key={order._id}>
                {order.products.slice(0, 1)?.map((product) => (
                  <View style={{marginVertical: 10}} key={product._id}>
                    <Image 
                      source={{uri: product.image}} 
                      style={{width: 100, height: 100, resizeMode: "contain"}}
                    />
                  </View>
                ))}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{color: 'gray'}}>No orders found</Text>
          )}
        </ScrollView>

        <View style={styles.divider} />

        {/* User Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Account Details</Text>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>📧 Email</Text>
            <Text style={styles.detailText}>{user?.email}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>✅ Verified</Text>
            <Text style={styles.detailText}>{user?.verified ? "Yes" : "No"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>📅 Member Since</Text>
            <Text style={styles.detailText}>
              {user?.createdAt ? new Date(user.createdAt).toDateString() : "N/A"}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>📍 Saved Addresses</Text>
            <Text style={styles.detailText}>{user?.addresses?.length || 0}</Text>
          </View>
        </View>

        <View style={styles.divider} />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f4',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0eee8',
    borderRadius: 25,
    paddingHorizontal: 20, 
    paddingVertical: 10,
    width: '100%',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#386641',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#c2e5c7',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#386641',
  },
  username: {
    fontSize: 16,
    color: '#578c63',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 20,
  },
  orderButton: {
    backgroundColor: '#c2e5c7',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '45%',
    marginHorizontal: '2%',
    marginBottom: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#386641',
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#386641',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c2e5c7',
  },
  detailLabel: {
    fontSize: 14,
    color: '#386641',
    fontWeight: '600',
  },
  detailText: {
    fontSize: 14,
    color: '#497452',
  },
  divider: {
    height: 1,
    backgroundColor: '#c2e5c7',
    width: '100%',
    marginBottom: 20,
    marginTop: 10,
  },
});

export default profile;