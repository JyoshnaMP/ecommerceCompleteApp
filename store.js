import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './redux/cartReducer';


export default configureStore({
    reducer: {
        cart: cartReducer
    }
})