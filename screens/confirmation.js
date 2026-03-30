import { View, Text, ScrollView, Pressable, TouchableOpacity, Alert } from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { UserType } from '../userContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios'; 
import { cleanCart } from '../redux/cartReducer'; 

const confirmation = () => {
    const steps = [
        {title: "Address", content: "address form"}, 
        {title: "Delivery", content: "delivery options"},
        {title: "Payment", content: "payment details"},
        {title: "Order", content: "order summary"}, 
    ];

    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const {userId, setUserId} = useContext(UserType); 
    const cart = useSelector((state)=>state.cart.cart);
    const total = cart
        ?.map((item)=>item.price * item.quantity)
        .reduce((curr, prev)=>curr + prev, 0);
    const dispatch = useDispatch();
    const [selectedAddress, setSelectedAddress] = useState("");
    const [option, setOption] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

   
    useEffect(()=>{
        const loadUserId = async()=>{
            try {
                if (!userId) {
                    const token = await AsyncStorage.getItem("authToken");
                    if (token) {
                        const decoded = jwtDecode(token);
                        setUserId(decoded.userId);
                    }
                }
            } catch(error) {
                console.log("error loading userId", error);
            }
        };
        loadUserId();
    }, []);

    
    useEffect(()=>{
        if (!userId) return;
        fetchAddresses();
    }, [userId]);

    const fetchAddresses = async()=>{
        try{
            const response = await axios.get(
                `https://ecommerce-oa46.onrender.com/addresses/${userId}` 
            );
            const {addresses} = response.data;
            setAddresses(addresses);
        }
        catch(error) {
            console.log("error fetching addresses", error);
        }
    };

    const handlePlaceOrder = async()=>{
        try{
            const orderData = {
                userId: userId, 
                cartItems: cart,
                totalPrice: total,
                shippingAddress: selectedAddress,
                paymentMethod: selectedOption
            };
            const response = await axios.post(
                "https://ecommerce-oa46.onrender.com/orders", 
                orderData
            );
            if(response.status === 200){
                navigation.navigate("orderScreen"); 
                dispatch(cleanCart());
                console.log("order created successfully");
            }
        }
        catch(error){
            console.log("error placing order", error);
        }
    };

    return (
        <ScrollView style={{marginTop: 55}}>

           <View style={{paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10}}>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    {steps?.map((step, index)=>(
                        <View key={index} style={{alignItems: "center", flex: 1}}>
                           
                            <View style={{flexDirection: "row", alignItems: "center", width: "100%"}}>
                           
                                <View style={{flex: 1, height: 2, backgroundColor: index <= currentStep ? "green" : "#CCC"}}/>
                                
                               
                                <View style={{
                                    width: 34, 
                                    height: 34, 
                                    borderRadius: 17, 
                                    backgroundColor: index < currentStep ? "green" : index === currentStep ? "#008397" : "#CCC",
                                    justifyContent: "center", 
                                    alignItems: "center",
                                    borderWidth: 2,
                                    borderColor: index <= currentStep ? "green" : "#CCC",
                                }}>
                                    {index < currentStep ? (
                                        <FontAwesome5 name="check" size={14} color="white"/> // ✅ proper check icon not emoji
                                    ) : (
                                        <Text style={{fontSize: 14, fontWeight: "bold", color: "white"}}>{index + 1}</Text>
                                    )}
                                </View>

                                {/* Right line */}
                                <View style={{flex: 1, height: 2, backgroundColor: index < currentStep ? "green" : "#CCC"}}/>
                            </View>
                            {/* Label */}
                            <Text style={{textAlign: "center", marginTop: 6, fontSize: 11, color: index <= currentStep ? "green" : "gray", fontWeight: index === currentStep ? "bold" : "normal"}}>
                                {step.title}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

         
            {currentStep === 0 && (
                <View style={{marginHorizontal: 20}}>
                    <Text style={{fontSize: 16, fontWeight: "bold"}}>Select Delivery Address</Text>
                    
                    {addresses?.length === 0 && (
                        <View style={{marginTop: 20, alignItems: "center"}}>
                            <Text style={{color: "gray"}}>No addresses found</Text>
                            <TouchableOpacity 
                                onPress={()=>navigation.navigate("address")}
                                style={{backgroundColor: "#FFC72C", padding: 10, borderRadius: 5, marginTop: 10}}>
                                <Text style={{fontWeight: "bold"}}>Add New Address</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {addresses?.map((item, index)=>(
                        <Pressable 
                            key={index}
                            onPress={()=>setSelectedAddress(item)} // ✅ fixed: was calling undefined selectAdressess
                            style={{borderWidth: 1, flexDirection: "row", borderColor: "#D0D0D0", padding: 10, alignItems: "center", gap: 5, paddingBottom: 15, marginVertical: 10, borderRadius: 6}}>
                            {selectedAddress && selectedAddress._id === item?._id ? (
                                <FontAwesome5 name="dot-circle" size={20} color="#008397"/>
                            ) : (
                                <Entypo name="circle" size={20} color="green"/>
                            )}
                            <View style={{marginLeft: 6}}>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 3}}>
                                    <Text style={{fontSize: 16, fontWeight: "bold"}}>{item?.name}</Text> {/* ✅ fixed: fontSize 50 -> 16 */}
                                    <Entypo name="location-pin" size={24} color="red"/>
                                </View>
                                <Text style={{fontSize: 14, color: "#181818"}}>{item?.houseNumber}, {item?.landmark}</Text>
                                <Text style={{fontSize: 14, color: "#181818"}}>{item?.street}</Text>
                                <Text style={{fontSize: 14, color: "#181818"}}>PIN: {item?.pinCode}</Text>
                                <Text style={{fontSize: 14, color: "#181818"}}>Phone: {item?.mobileNumber}</Text>

                                {selectedAddress && selectedAddress._id === item?._id && (
                                    <TouchableOpacity 
                                        onPress={()=>setCurrentStep(1)} // ✅ go to next step
                                        style={{backgroundColor: "#008397", padding: 10, justifyContent: "center", alignItems: "center", borderRadius: 20, marginTop: 10}}>
                                        <Text style={{color: "white", textAlign: "center"}}>Deliver to this Address</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}

           
            {currentStep === 1 && (
                <View style={{marginHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Choose Delivery Option</Text>
                    <Pressable 
                        onPress={()=>setOption(true)}
                        style={{flexDirection: "row", alignItems: "center", gap: 10, marginTop: 15, borderWidth: 1, borderColor: "#D0D0D0", padding: 10, borderRadius: 5}}>
                        {option ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397"/>
                        ) : (
                            <Entypo name="circle" size={20} color="gray"/>
                        )}
                        <View>
                            <Text style={{color: "green", fontWeight: "bold"}}>Tomorrow by 10 PM</Text>
                            <Text style={{color: "green"}}>Free Delivery with Prime</Text>
                        </View>
                    </Pressable>
                    <TouchableOpacity 
                        onPress={()=>setCurrentStep(2)}
                        style={{backgroundColor: "#FFC72C", padding: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", marginTop: 15}}>
                        <Text style={{fontWeight: "bold"}}>Continue</Text>
                    </TouchableOpacity>
                </View>
            )}

         
            {currentStep === 2 && (
                <View style={{marginHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Select Payment Method</Text>
                    
                    <Pressable 
                        onPress={()=>setSelectedOption("cash")}
                        style={{backgroundColor: "white", padding: 8, borderColor: "#D0D0D0", borderWidth: 1, flexDirection: "row", alignItems: "center", marginTop: 12, gap: 7, borderRadius: 5}}>
                        {selectedOption === "cash" ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397"/>
                        ) : (
                            <Entypo name="circle" size={20} color="gray"/>
                        )}
                        <Text>Cash On Delivery</Text>
                    </Pressable>

                    <Pressable 
                        onPress={()=>{
                            setSelectedOption("card");
                            Alert.alert("UPI/Debit Card", "Pay Online", [
                                {text: "Cancel", onPress: ()=>console.log("cancelled")},
                                {text: "Okay", onPress: ()=>console.log("pay")}  
                            ]);
                        }}
                        style={{backgroundColor: "white", padding: 8, borderColor: "#D0D0D0", borderWidth: 1, flexDirection: "row", alignItems: "center", marginTop: 12, gap: 7, borderRadius: 5}}>
                        {selectedOption === "card" ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397"/>
                        ) : (
                            <Entypo name="circle" size={20} color="gray"/>
                        )}
                        <Text>UPI / Debit or Credit Card</Text>
                    </Pressable>

                    <TouchableOpacity 
                        onPress={()=>setCurrentStep(3)}
                        style={{backgroundColor: "#FFC72C", padding: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", marginTop: 15}}>
                        <Text style={{fontWeight: "bold"}}>Continue</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Step 4 - Place Order */}
            {currentStep === 3 && selectedOption === "cash" && (
                <View style={{marginHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Order Summary</Text>
                    
                    <View style={{backgroundColor: "white", padding: 8, borderWidth: 1, marginTop: 10, borderColor: "#D0D0D0", borderRadius: 5}}>
                        <Text style={{fontWeight: "bold", fontSize: 16}}>Shipping To: {selectedAddress?.name}</Text>
                        <Text style={{color: "gray", marginTop: 4}}>{selectedAddress?.houseNumber}, {selectedAddress?.street}</Text>
                        <Text style={{color: "gray"}}>PIN: {selectedAddress?.pinCode}</Text>

                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12}}>
                            <Text style={{fontSize: 16, color: "gray"}}>Items Total</Text>
                            <Text style={{color: "gray", fontSize: 16}}>₹{total}</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8}}>
                            <Text style={{fontSize: 16, color: "gray"}}>Delivery</Text>
                            <Text style={{color: "green", fontSize: 16}}>FREE</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, borderTopWidth: 1, borderColor: "#D0D0D0", paddingTop: 8}}>
                            <Text style={{fontSize: 20, fontWeight: "bold"}}>Order Total</Text>
                            <Text style={{fontSize: 17, fontWeight: "bold", color: "#C60C30"}}>₹{total}</Text>
                        </View>
                    </View>

                    <View style={{backgroundColor: "white", padding: 8, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5}}>
                        <Text style={{fontSize: 16, color: "gray"}}>Payment Method</Text>
                        <Text style={{fontSize: 16, fontWeight: "bold", marginTop: 5}}>Cash on Delivery</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={handlePlaceOrder}
                        style={{backgroundColor: "#FFC72C", padding: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom: 30}}>
                        <Text style={{fontWeight: "bold", fontSize: 16}}>Place Your Order</Text>
                    </TouchableOpacity>
                </View>
            )}

        </ScrollView>
    );
};

export default confirmation;