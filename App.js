import StackNavigator from './navigation/stackNavigator';
import { store, persistor } from './store';
import { UserContext } from './userContext';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserContext>
          <StackNavigator/>
        </UserContext>
      </PersistGate>
    </Provider>
  );
}