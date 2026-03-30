import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; 

const loginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation(); 
  useEffect(()=>{
    const checkLoginStatus = async()=>{
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.replace("main");
        }

      }
      catch (err){
        console.log("error message", err);
      }
    };
    checkLoginStatus();
  }, []);
  const handleLogin = ()=>{
    const user = {
      email: email, password: password, 
    };
    axios
    .post('https://ecommerce-oa46.onrender.com/login', user)
    .then((response)=>{
      console.log(response);
      const token = response.data.token;
      AsyncStorage.setItem("authToken", token);
      navigation.replace("main");
    })
    .catch((error)=>{
      Alert.alert("loginError", "invalid email");
      console.log(error);

    })
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value = {email}
          onChangeText = {(text)=>setEmail(text)}
          style={styles.input}
          placeholder="enter your email"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value = {password}
          onChangeText={(text)=>setPassword(text)}
          
          style={styles.input}
          placeholder="enter your password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      
      <TouchableOpacity onPress={() => navigation.navigate('registerScreen')}> 
        <Text style={styles.registerText}>create an account if not created!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#8CBD8C',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#173317',
    fontSize: 16,
  },
});

export default loginScreen;