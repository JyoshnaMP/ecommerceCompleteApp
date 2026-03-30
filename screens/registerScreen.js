import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const registerScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigation = useNavigation();
  const handleRegister = ()=>{
    const user = {
      name: name, email: email, password: password
    }; 
  axios
  .post('https://ecommerce-oa46.onrender.com/register', user)
  .then((response)=>{
    console.log(response);
    Alert.alert('Registration successful', 'you have been registered successfully');
    setName("");
    setEmail("");
    setPassword("");
    navigation.navigate("loginScreen");
  })
  .catch((error)=>{
    Alert.alert("registration error", "an error occured while registering");
    console.log("registration failed", error);
  });

  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value = {name}
          onChangeText={(text)=>setName(text)}
          style={styles.input}
          placeholder="input your name"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={(text)=>setEmail(text)}
          style={styles.input}
          placeholder="input your email"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          onChangeText={(text)=>setPassword(text)}
          style={styles.input}
          placeholder="input your Password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('loginScreen')}>
        <Text style={styles.signInText}>already have an account? sign in!!</Text>
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
  signUpButton: {
    backgroundColor: '#8CBD8C',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInText: {
    color: '#173317'  ,
    fontSize: 16,
  },
});

export default registerScreen;