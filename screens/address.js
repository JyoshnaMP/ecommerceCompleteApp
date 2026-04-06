import { View, Text, ScrollView, TextInput, Pressable, Alert } from 'react-native'
import React, {useEffect, useState, useContext} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";  // ✅ fixed: correct import
import { UserType } from "../userContext";  // ✅ fixed: correct import, was commented out
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const address = () => {
  const navigation = useNavigation(); 
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const {userId, setUserId} = useContext(UserType);  // ✅ fixed: UserType not userType

  useEffect(()=>{
    const fetchUser = async()=>{
      try {
        if (!userId) {
          const token = await AsyncStorage.getItem("authToken");  // ✅ fixed: was "auth token" with space
          if (token) {
            const decodedToken = jwtDecode(token);  // ✅ fixed: jwtDecode not jwt_decode
            setUserId(decodedToken.userId);
          }
        }
      } catch(error) {
        console.log("error fetching user", error);
      }
    }
    fetchUser();
  }, []);
  
  const handleAddresses = ()=>{
    if (!name || !mobileNumber || !houseNumber || !street || !postalCode) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    const address = {name, mobileNumber, houseNumber, street, landmark, postalCode}
    axios.post("https://ecommerce-oa46.onrender.com/addresses", {userId, address})  // ✅ fixed: was "hhttps"
    .then((response)=>{
      Alert.alert("Success", "Address added successfully");
      setName("");
      setMobileNumber("");
      setHouseNumber("");
      setStreet("");
      setLandmark("");
      setPostalCode("");
      setTimeout(()=>{navigation.goBack()}, 500);
    })
    .catch((error)=>{
      Alert.alert("Error", "Failed to add address");
      console.log("error", error)
    })
  }

  return (
    <ScrollView style={{marginTop: 50}}>
      <View style={{padding: 15}}>

        <Text style={{fontSize: 20, fontWeight: "bold", marginBottom: 15}}>Add a New Address</Text>

        {/* Country */}
        <View style={{marginBottom: 10}}>
          <Text style={{fontSize: 15, fontWeight: "bold", marginBottom: 5}}>Country</Text>
          <TextInput 
            placeholderTextColor={"gray"}
            placeholder='India' 
            style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}}
          />
        </View>

        {/* Full Name */}
        <View style={{marginBottom: 10}}>
          <Text style={{fontSize: 15, fontWeight: "bold", marginBottom: 5}}>Full Name</Text>
          <TextInput 
            value={name}  // ✅ fixed: was value={"name"} hardcoded string
            onChangeText={setName}  // ✅ fixed: added onChangeText
            placeholderTextColor={"gray"} 
            style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}} 
            placeholder="Enter Your Name" 
          />
        </View>

        {/* Mobile Number */}
        <View style={{marginBottom: 10}}>
          <Text style={{fontSize: 15, fontWeight: "bold", marginBottom: 5}}>Mobile Number</Text>
          <TextInput 
            value={mobileNumber}  // ✅ fixed: was value='mobileNumber' hardcoded string
            onChangeText={setMobileNumber}  // ✅ fixed: added onChangeText
            placeholder='Mobile Number' 
            placeholderTextColor={"gray"} 
            keyboardType="phone-pad"
            style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}}
          />
        </View>

        {/* House Number */}
        <View style={{marginBottom: 10}}>
          <Text style={{fontSize: 15, fontWeight: "bold", marginBottom: 5}}>Flat, House Number, Building</Text>
          <TextInput 
            value={houseNumber}  // ✅ fixed: was value='houseNumber' hardcoded string
            onChangeText={setHouseNumber}  // ✅ fixed: added onChangeText
            placeholderTextColor={"gray"} 
            style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}}
          />
        </View>

        {/* Street */}
        <View style={{marginBottom: 10}}>
          <Text style={{fontSize: 15, fontWeight: "bold", marginBottom: 5}}>Area, Street, Sector, Village</Text>
          <TextInput 
            value={street}  // ✅ fixed: was value='street' hardcoded string
            onChangeText={setStreet}  // ✅ fixed: added onChangeText
            placeholderTextColor={"gray"} 
            style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}}
          />
        </View>

        {/* Landmark */}
        <View style={{marginBottom: 10}}>
          <Text style={{fontSize: 15, fontWeight: "bold", marginBottom: 5}}>Landmark</Text>
          <TextInput 
            value={landmark}  // ✅ fixed: was value='landmark' hardcoded string
            onChangeText={setLandmark}  // ✅ fixed: added onChangeText
            placeholder='Example: near xyz street' 
            placeholderTextColor={"gray"} 
            style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}}
          />
        </View>

        {/* PIN Code */}
        <View style={{marginBottom: 15}}>
          <Text style={{fontSize: 15, fontWeight: "bold", marginBottom: 5}}>PIN Code</Text>
          <TextInput 
            value={postalCode}  // ✅ fixed: was value='pinCode' hardcoded string
            onChangeText={setPostalCode}  // ✅ fixed: added onChangeText
            placeholder='Enter PIN Code' 
            placeholderTextColor={"gray"} 
            keyboardType="numeric"
            style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5}}
          />
        </View>

        {/* Submit Button */}
        <Pressable 
          onPress={handleAddresses} 
          style={{backgroundColor: "#FFC72C", padding: 15, borderRadius: 6, justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontWeight: "bold", fontSize: 16}}>Add Address</Text>
        </Pressable>

      </View>
    </ScrollView>
  )
}

export default address