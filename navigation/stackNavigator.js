import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import loginScreen from '../screens/loginScreen';
import registerScreen from '../screens/registerScreen';
import homeScreen from '../screens/homeScreen';
import settings from '../screens/settings';
import privacyPolicy from '../screens/privacyPolicy'
import faq from '../screens/faq';
import profile from '../screens/profile';
import address from '../screens/address';
import AddAddressScreen from '../screens/AddAddressScreen';
import orderScreen from '../screens/orderScreen'
import confirmation from '../screens/confirmation';
import productInfo from '../screens/productInfo';
import cart from '../screens/cart';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function bottomTabs(){
  return(
    <Tab.Navigator>
      <Tab.Screen 
        name= "homeScreen" 
        component={homeScreen}
        options={{tabBarLabel: "Home", tabBarLabelStyle: {color: "#008E97"}, 
        headerShown: false,
        tabBarIcon: ({focused})=>
        focused?(
          <Entypo name="home" size={24} color="#008E97"/>

        ):(
          <AntDesign name="home" size={24} color="black"/>
        )
      }}/>
      <Tab.Screen
      name="profile"
      component={profile}
      options={{
        tabBarLabel: "Profile", tabBarLabelStyle: {color: "#008E97"},
        headerShown: false,
        tabBarIcon: ({focused})=>
          focused?(
            <Ionicons name="person" size={24} color="#008E97"/>
          ):(
            <Ionicons name="person-outline" size={24} color="black"/>
          )
      }}
      />
      <Tab.Screen name="cart" 
      component={cart}
      options={{
        tabBarLabel: "Cart", tabBarLabelStyle: {color: "#008E97"},
        headerShown: false,
        tabBarIcon: ({focused})=>
          focused?(
            <AntDesign name="shoppingcart" size={24} color="#008E97"/>

          ):(
            <AntDesign name="shoppingcart" size={24} color="black"/>
          )
      }}/>
    </Tab.Navigator>
  )
}

const StackNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='loginScreen'>
            <Stack.Screen name="loginScreen" component={loginScreen} />
            <Stack.Screen name="registerScreen" component={registerScreen} />
            <Stack.Screen name="main" component={bottomTabs} options={{headerShown: false}}/>
            <Stack.Screen name="bottomTab" component={bottomTabs} options={{headerShown: false}} />
            <Stack.Screen name="settings" component={settings} />
            <Stack.Screen name="privacyPolicy" component={privacyPolicy} />
            <Stack.Screen name="faq" component={faq} />
           <Stack.Screen  name="AddAddress" component={AddAddressScreen}/>
            <Stack.Screen name="address" component={address} /> 
            <Stack.Screen name="orderScreen" component={orderScreen} />
            <Stack.Screen name="confirmation" component={confirmation} />
            <Stack.Screen name="productInfo" component={productInfo} />



        </Stack.Navigator>
    
    </NavigationContainer>
  )
}

export default StackNavigator