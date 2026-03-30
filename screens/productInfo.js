import { View, Text, TouchableOpacity, TextInput, ImageBackground, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import {useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from '../redux/cartReducer'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

const productInfo = () => {
    const route = useRoute();
    const {width} = Dimensions.get("window");
    const height = width;
    const navigation = useNavigation();
    const [addedToCart, setAddedToCart] = useState(false);
    const dispatch = useDispatch();
    const addItemToCart = (item)=>{
        setAddedToCart(true);
        dispatch(addToCart(item));
        setTimeout(()=>{
            setAddedToCart(false);

        }, 60000);
    };
    const cart = useSelector((state)=>state.cart.cart);
    console.log(cart);


  return (
    <ScrollView style={{flex: 1, marginTop: 50, backgroundColor: "white"}} showsVerticalScrollIndicator = {false}>
        <View style={{backgroundColor: "#00CED1", padding: 10, flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity style={{flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "white", borderRadius: 3, height: 38, marginHorizontal: 7, flex: 1}}>
                <AntDesign name="search1" size={22} color="black" style={{paddingLeft: 10}}/>
                <TextInput placeholder="Search Amazon.in"/>
            </TouchableOpacity>
            <Feather name="mic" size={24} color= "black"/>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator = {false}>
            {route.params.carouselImages.map((item, index)=>(
                <ImageBackground style={{width, height, marginTop: 25, resizeMode: "contain"}} source={{uri: item}} key={index}>
                    <View style={{flexDirection: "row", padding: 20, alignItems: "center", justifyContent: "space-between"}}>
                        <View style={{height: 40, width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", flexDirection: "row", backgroundColor: "#C60C30"}}>
                            <Text style={{color: "whiite", textAlign: "center", fontWeight: 600, fontSize: 12}}>20% off</Text>
                        </View>
                        <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                            <MaterialCommunityIcons name= "share-variant" size={24} color="black"/>
                        </View>
                    </View>
                    <View style={{width: 40, height: 40, marginTop: "auto", marginLeft: 20, marginBottom: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: "#E0E0E0"}}>
                        <AntDesign name="hearto" size={24} color="black" />
                    </View>

                </ImageBackground>

            ))}
            

        </ScrollView>
        <View style={{padding: 10}}>
            <Text style={{fontSize: 15, fontWeight: 500}}>{route?.params?.title}</Text>
            <Text style={{fontSize: 18, fontWeight: "bold", marginTop: 6}}>${route?.params?.price}</Text>

        </View>
        <Text style={{height: 1, borderWidth: 1, borderColor: "#D0D0D0"}}/>
        <View style={{flexDirection: "row", alignItems: "center", padding: 10}}>
            <Text>Color: </Text>
            <Text style={{fontSize: 15, fontWeight: "bold"}}>{route?.params?.color}</Text>
        </View>
        <View style={{alignItems: "center", padding: 10, flexDirection: "row"}}>
            <Text>Size: </Text>
            <Text stlye={{fontSize: 15, fontWeight: "bold"}}>{route?.params?.size}</Text>
        </View>
        <Text style={{height: 1, borderWidth: 1, borderColor: "#D0D0D0"}}/>
        <View style={{padding: 10}}>

            <Text style={{fontSize: 15, fontWeight: "bold", marginVertical: 5}}>Total: ${route.params.price}</Text>
            <Text stlye={{color: "#00CED1"}}>Free Delivery Tomorrow by 3pm, order within 10 hrs 30 mins</Text>
            <View style={{flexDirection: "row", marginVertical: 5, alignItems: "center", gap: 5}}>
                <Ionicons name="location" size={24} color="black"/>
                <Text style={{fontSize: 15, fontWeight: 500}}>Delivery to Charvi- Coppell 75019</Text>
            </View>
        </View>
        <Text style={{color: "green", fontWeight: 500, marginHorizontal: 10}}>In-Stock</Text>
        <TouchableOpacity onPress={()=>addItemToCart(route?.params?.item)} style={{backgroundColor: "#FFC72C", padding: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", marginHorizontal: 10, marginVertical: 10}}>
            {addedToCart?(
                <View>
                    <Text>Added To Cart</Text>
            </View>):(
                <Text>Add To Cart</Text>
            )}
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: "#FFAC1C", padding: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", marginHorizontal: 10, marginVertical: 10}}>
            <Text>Buy Now</Text>
        </TouchableOpacity>
    </ScrollView>
  )
}

export default productInfo