import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './navigation/stackNavigator';
import { store, persistor } from './store'; // ✅ import persistor too
import {UserContext} from './userContext';
import {Provider} from "react-redux";
import {ModalPortal} from "react-native-modals";
import { PersistGate } from 'redux-persist/integration/react'; // ✅ new import

export default function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>  {/* ✅ wraps everything */}
          <UserContext>
            <StackNavigator/>
            <ModalPortal/>
          </UserContext>
        </PersistGate>
      </Provider> 
    </>
  );
}