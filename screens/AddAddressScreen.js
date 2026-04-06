import { View, Text, ScrollView, Pressable, TextInput } from 'react-native'
import React, {useContext, useState, useEffect} from 'react'
import {Feather, AntDesign} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import {MaterialIcons} from "@expo/vector-icons";
import {Entypo} from "@expo/vector-icons";
import axios from "axios";
import { UserType } from '../userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const {userId, setUserId} = useContext(UserType);

  // Step 1 - Load userId from token if not already set
  useEffect(()=>{
    const loadUserId = async()=>{
      try {
        if (!userId) {
          const token = await AsyncStorage.getItem("authToken");
          if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.userId);
          }
        }
      } catch(error) {
        console.log("error loading userId", error);
      }
    };
    loadUserId();
  }, []);

  // Step 2 - Fetch addresses once userId is available
  useEffect(()=>{
    if (!userId) return;
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async()=>{
    try{
      const response = await axios.get(
        `https://ecommerce-oa46.onrender.com/addresses/${userId}`
      );
      const {addresses} = response.data;
      setAddresses(addresses);
    }
    catch(error){
      console.log("error fetching addresses", error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 10}}>

      {/* Search Bar */}
      <View style={{backgroundColor: '#00CED1', padding: 10, flexDirection: 'row', alignItems: 'center'}}>
        <Pressable style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 7, gap: 10, backgroundColor: 'white', borderRadius: 5, height: 38, flex: 1}}>
          <AntDesign style={{paddingLeft: 10}} name="search1" size={22} color="black" />
          <TextInput placeholder='Search Amazon.com'/>
        </Pressable>
        <Feather name='mic' size={24} color='black'/>
      </View>

      <View style={{padding: 10}}>
        <Text style={{fontSize: 20, fontWeight:'bold'}}>Your Addresses</Text>

        {/* Add New Address Button */}
        <Pressable 
          onPress={()=>navigation.navigate("address")} 
          style={{
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginTop: 10, 
            borderColor: '#D0D0D0', 
            borderWidth: 1, 
            borderLeftWidth: 0, 
            borderRightWidth: 0, 
            paddingVertical: 7, 
            paddingHorizontal: 5
          }}>
          <Text>Add a New Address</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color='black'/>
        </Pressable>

        {/* Addresses List */}
        {addresses?.length === 0 && (
          <Text style={{color: 'gray', marginTop: 20, textAlign: 'center'}}>
            No addresses saved yet
          </Text>
        )}

        {addresses?.map((item, index)=>(
          <View key={index} style={{
            borderWidth: 1, 
            borderColor: '#D0D0D0', 
            padding: 10, 
            flexDirection: 'column', 
            gap: 5, 
            marginVertical: 10, 
            borderRadius: 5
          }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
              <Text style={{fontSize: 16, fontWeight:"bold"}}>{item?.name}</Text>
              <Entypo name="location-pin" size={24} color="red"/>
            </View>
            <Text style={{fontSize: 14, color: '#181818'}}>
              {item?.houseNumber}, {item?.landmark}
            </Text>
            <Text style={{fontSize: 14, color: '#181818'}}>{item?.street}</Text>
            <Text style={{fontSize: 14, color: '#181818'}}>PIN Code: {item?.postalCode}</Text>
            <Text style={{fontSize: 14, color: '#181818'}}>Phone: {item?.mobileNumber}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7}}>
              <Pressable style={{
                backgroundColor: '#F5F5F5', 
                paddingHorizontal: 10, 
                paddingVertical: 6, 
                borderRadius: 5, 
                borderWidth: 1, 
                borderColor: '#D0D0D0'
              }}>
                <Text>Edit</Text>
              </Pressable>
              <Pressable style={{
                backgroundColor: '#F5F5F5', 
                paddingHorizontal: 10, 
                paddingVertical: 6, 
                borderRadius: 5, 
                borderWidth: 1, 
                borderColor: '#D0D0D0'
              }}>
                <Text>Set As Default</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  )
}

export default AddAddressScreen