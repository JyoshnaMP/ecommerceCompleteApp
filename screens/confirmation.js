import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
const confirmation = () => {
    const steps = [
        {title: "address", content: "address form"}, 
        {title: "delivery", content: "delivery options"},
        {title: "payment", content: "payment details"},
        {title: "place order", content: "order summary"}, 
    
    ];
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const {userId, setUserId} = useContext(userType);
    const cart = useSelector((state)=>state.cart.cart);
    const total = cart
    ?.map((item)=>item.price*item.quantity)
    .reduce((curr, prev)=>curr+prev, 0);
    useEffect(()=>{
        fetchAddressess();
    }, []);
    const fetchAddressess = async()=>{
        try{
            const response = await axios.get(
                `https://ecommercebackend-2xn3.onrender.com/addresses/${userId}`
            );
            const {addresses} = response.data;
            setAddresses(addresses);
    
        }
        catch(error) {
            console.log("error", error);
        }
    };

    const dispatch = useDispatch();
    const [selectedAddress, setSelectedAddress] = useState("");
    const [option, setOption] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const handlePlaceHolder = async()=>{
        try{
            const orderData = {
                userId: userId, 
                cartItems: cart,
                totalPrice: total,
                shippingAddress: selectedAddress,
                paymentMethod: selectedOption
            };
            const response = await axios.post("https://ecommercebackend-2xn3.onrender.com/orders", orderData);
            if(response.status === 200){
                navigation.navigate("order");
                dispatch(cleanCart());
                console.log("order created successfully", response.data);
            }
            else{
                console.log("error creating order", response.data);
            } 
        }
        catch(error){
            console.log("error", error);
        }
    }
    

  return (
   <ScrollView style={{marginTop: 55}}>
        <View style={{flex: 1, paddingHorizontal: 25, paddingTop: 40}}>
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 20, justifyContent: "space-between"}}>
            {steps?.map((step, index)=>(
                <View style={{justifyContent: "center", alignItems: "center"}}>
                {index > 0 &&(
                    <View style={[{
                        flex: 1, height: 2, backgroundColor: "green"
                    }, 
                index <= currentStep && {backgroundColor: "green"}]}/>
                )}
                <View style={[
                    {width: 30, height: 30, borderRadius: 15, backgroundColor: "#CCC", justifyContent: "center", alignItems: "center"},
                    index < currentStep & {backgroundColor: "green"}
                ]}>
                    {index < currentStep?(
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "white"}}>✅</Text>
                    ):(
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "white"}}>{index + 1}</Text>
                    )}

                </View>
                    <Text style={{textAlign: "center", marginTop: 5}}>{step.title}</Text>
                </View>
            ))}
            </View>
        </View>
        {currentStep == 0 && (
            <View style={{marginHorizontal: 20}}>
                <Text style={{fontSize: 16, fontWeight: "bold"}}>Select delivery address</Text>
                <Pressable>
                    {addresses?.map((item, index)=>(
                        <Pressable style={{borderWidth: 1, flexDirection: "row", borderColor: "#D0D0D0", padding: 10, alignItems: "center", gap: 5, paddingBottom: 15, marginVertical: 10, borderRadius: 6}}>
                            {selectAdressess & selectAdressess._id === item?._id?
                            (<FontAwesome5 name="dot-circle" size= {20} color="#008397"/> ): (
                                <Entypo name="circle" size= {20} color="green" onPress={()=>selectAdressess(item)}/>
                            )}
                            <View style={{marginLeft: 6}}>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 3}}>
                                    <Text style={{fontSize: 50, fontWeight: "bold"}}>{item?.name}</Text>
                                    <Entypo name="location-pin" size={24} color= "red" />
                                </View>
                                <Text style={{fontSize: 15, color: "#181818"}}>{item?.houseNumber}, {item?.landmark}</Text>
                                <Text style={{fontSize: 15, color: "#181818"}}>{item?.street}</Text>
                                <Text style={{fontSize: 15, color: "#181818"}}>Texas, USA</Text>
                                <Text style={{fontSize: 15, color: "#181818"}}>Phone Number: {item?.mobileNumber}</Text>
                                <Text style={{fontSize: 15, color: "#181818"}}>Postal Code: {item?.pinCode}</Text>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 10, marginTop:7}}>
                                    <TouchableOpacity style={{backgroundColor: "#F5F5F5", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: "#D0D0D0"}}>
                                        <Text>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{backgroundColor: "#F5F5F5", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: "#D0D0D0"}}>
                                        <Text>Remove</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{backgroundColor: "#F5F5F5", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: "#D0D0D0"}}>
                                        <Text>Set as Default</Text>
                                    </TouchableOpacity>

                                </View>
                                <View>
                                    {selectedAddress && selectedAddress._id===item?.id&&(
                                        <TouchableOpacity style={{backgroundColor: "#008397", padding: 10, justifyContent: "center", alignItems: "center", borderRadius: 20, marginTop: 10}}>
                                            <Text style={{color: "white", textAlign: "center"}}>Deliver to this Address</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </Pressable>
            </View>
        )}
        {currentStep == 1 && (
            <View style={{marginHorizontal: 20}}>
                <Text style={{fontSize: 20, fontWeight: "bold"}}>Choose your Delivery Options</Text>
                <View>
                    {option?(
                        <FontAwesome5 name="dot-circle" size={20} color="#008397"/>
                    ):(<Entypo name="circle" size={20} color="gray"/>)}
                    <Text style={{color: "green", fontWeight: 500}}>
                        Tomorrow by 10 PM
                    </Text>
                    <Text style={{color: "green", fontWeight: 500}}>
                        Free Delivery with a Prime Membership
                    </Text>
                </View>
                <TouchableOpacity style={{backgroundColor: "#FFC72C", padding: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", marginTop: 15}}>
                    <Text>Continue</Text>
                </TouchableOpacity>
            </View>
        )}
        {
            currentStep == 2 && (
                <View style={{marginHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Select Your Payment Method</Text>
                    <View style={{backgroundColor: "white", padding: 8, borderColor: "#D0D0D0", borderWidth: 1, flexDirection: "row", alignItems: "center", marginTop: 12, gap: 7}}>
                        {selectedOption === "cash"?(
                            <FontAwesome5 name="dot-circle" size={20} color="#008397"/>
                        ):(<Entypo name="circle" size={20} color="gray"/>)}
                        <Text>Cash On Delivery</Text>
                    </View>
                    <View style={{backgroundColor: "white", padding: 8, borderColor: "#D0D0D0", borderWidth: 1, flexDirection: "row", alignItems: "center", marginTop: 12, gap: 7}}>
                        {selectedOption === "card"?(
                            <FontAwesome5 name="dot-circle" size={20} color="gray"/>

                        ):(<Entypo onPress={()=>{
                            setSelectedOption("card"); 
                            Alert.alert("upi/debit card", "pay online", [
                                {text: "cancel",
                                    onPress: ()=>console.log("cancel is pressed"),  
                                },
                                {text: "okay",
                                    onPress: ()=>pay(),
                                }  
                            ]) 
                        }} name="circle" size={20} color="gray"/>)}
                        <Text>upi/debit or credit card</Text>
                    </View>
                    <TouchableOpacity style={{backgroundColor: "#FFC72C", padding: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", marginTop: 15}}>
                        <Text>Continue</Text>
                    </TouchableOpacity>
                </View>

            )
        }
        {currentStep === 3 && selectedOption === "cash" && (
            <View style={{marginHorizontal: 20}}>
                <Text style={{fontSize: 20, fontWeight: "bold"}}>Order Now</Text>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around", gap: 8, backgroundColor: "white", padding: 8, borderWidth: 1, borderColor: "#D0D0D0", marginTop: 10}}>
                    <View>
                        <Text style={{fontSize: 18, fontWeight: "bold"}}>Save 5% and Never Run Out!</Text>
                        <Text style={{color: "gray", fontSize: 15, marginTop: 5}}>Turn On Auto Delivery</Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="black"/>
                </View>
                <View style={{backgroundColor: "white", padding: 8, borderWidth: 1, marginTop: 10, borderColor: "#D0D0D0"}}>
                    <Text>Shipping To {selectedAddress?.name}</Text>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8}}>
                        <Text style={{fontSize: 16, fontWeight: 500, color: "gray"}}>Items</Text>
                        <Text style={{color: "gray", fontSize: 16}}>${total}</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8}}>
                        <Text style={{fontSize: 16, fontWeight: 500, color: "gray"}}>Delivery</Text>
                        <Text style={{color: "gray", fontSize: 16}}>$0</Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 8}}>
                        <Text style={{fontSize: 20, fontWeight: "bold"}}>Order Total</Text>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "#C60C30"}}>${total}</Text>
                    </View>
                </View>
                <View style={{backgroundColor: "white", padding: 8, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10}}>
                    <Text style={{fontSize: 16, color: "gray"}}>Pay With</Text>
                    <Text style={{fontSize: 16, fontWeight: "bold", marginTop: 7}}>Pay on Delivery (Cash)</Text>
                </View>
                <TouchableOpacity style={{backgroundColor: "#FFC72C", padding: 10, borderRadius: 20, justifyContent: "center", alignItems: "center", marginTop: 20}}>
                    <Text>Place Your Order</Text>
                </TouchableOpacity>
            </View>
        )}
   </ScrollView>
  )
}

export default confirmation