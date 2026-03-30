import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './navigation/stackNavigator';
import store from './store';
import {UserContext} from './userContext';
import {Provider} from "react-redux";
import {ModalPortal} from "react-native-modals";


export default function App() {
  return (
    <>
    <Provider store = {store}>
      <UserContext>
    <StackNavigator/>
    <ModalPortal/>
    </UserContext>
    </Provider> 
    </>
  );
}