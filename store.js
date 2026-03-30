import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './redux/cartReducer';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};


const rootReducer = combineReducers({
  cart: cartReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

export default store;