import { View, Text, ScrollView, Pressable, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { UserType } from '../userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { cleanCart } from '../redux/cartReducer';
import { WebView } from 'react-native-webview';

const BASE_URL = "https://ecommerce-oa46.onrender.com";
const RAZORPAY_KEY = "rzp_test_SaBwDGP1zy39sV";

const confirmation = () => {
    const steps = [
        { title: "Address" },
        { title: "Delivery" },
        { title: "Payment" },
        { title: "Order" },
    ];

    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const cart = useSelector((state) => state.cart.cart);
    const total = cart
        ?.map((item) => item.price * item.quantity)
        .reduce((curr, prev) => curr + prev, 0);

console.log("cart", JSON.stringify(cart, null, 2));  // ✅ add here
console.log("total", total);  // ✅ add here
    const dispatch = useDispatch();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [option, setOption] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [showRazorpay, setShowRazorpay] = useState(false); // controls Modal

    // Load userId from token
    useEffect(() => {
        const loadUserId = async () => {
            try {
                if (!userId) {
                    const token = await AsyncStorage.getItem("authToken");
                    if (token) {
                        const decoded = jwtDecode(token);
                        setUserId(decoded.userId);
                    }
                }
            } catch (error) {
                console.log("error loading userId", error);
            }
        };
        loadUserId();
    }, []);

    // Fetch addresses once userId is available
    useEffect(() => {
        if (!userId) return;
        fetchAddresses();
    }, [userId]);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/addresses/${userId}`);
            const { addresses } = response.data;
            setAddresses(addresses);
        } catch (error) {
            console.log("error fetching addresses", error);
        }
    };

    // Place order in backend
    const placeOrderInBackend = async (paymentMethod) => {
        try {
            const orderData = {
                userId: userId,
                cartItems: cart,
                totalPrice: total,
                shippingAddress: {
                    name: selectedAddress.name,
                    mobileNumber: selectedAddress.mobileNumber,
                    houseNo: selectedAddress.houseNumber,
                    street: selectedAddress.street,
                    landmark: selectedAddress.landmark,
                    postalCode: selectedAddress.postalCode,
                },
                paymentMethod: paymentMethod,
            };
            const response = await axios.post(`${BASE_URL}/orders`, orderData);
            if (response.status === 200) {
                dispatch(cleanCart());
                Alert.alert("Success", "Order placed successfully!", [
                    { text: "OK", onPress: () => navigation.navigate("orderScreen") }
                ]);
            }
        } catch (error) {
            console.log("error placing order", error);
            Alert.alert("Error", "Failed to place order. Please try again.");
        }
    };

    // Cash on delivery
    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            Alert.alert("Error", "Please select a delivery address");
            return;
        }
        placeOrderInBackend("Cash on Delivery");
    };

    // Razorpay WebView message handler
    const handleRazorpayMessage = async (event) => {
        const data = event.nativeEvent.data;
        if (data.startsWith("SUCCESS")) {
            const paymentId = data.split(":")[1];
            console.log("Payment successful, paymentId:", paymentId);
            setShowRazorpay(false);
            await placeOrderInBackend(`Razorpay:${paymentId}`);
        } else if (data === "DISMISSED") {
            setShowRazorpay(false);
            Alert.alert("Payment Cancelled", "You cancelled the payment.");
        } else if (data === "FAILED") {
            setShowRazorpay(false);
            Alert.alert("Payment Failed", "Please try again.");
        }
    };

    // Razorpay HTML
    const razorpayHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#fff;">
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            <script>
                var options = {
                    key: "${RAZORPAY_KEY}",
                    amount: ${total * 100},
                    currency: "INR",
                    name: "My Shop",
                    description: "Order Payment",
                    theme: { color: "#00CED1" },
                    handler: function(response) {
                        window.ReactNativeWebView.postMessage("SUCCESS:" + response.razorpay_payment_id);
                    },
                    modal: {
                        ondismiss: function() {
                            window.ReactNativeWebView.postMessage("DISMISSED");
                        }
                    }
                };
                var rzp = new Razorpay(options);
                rzp.on("payment.failed", function(response) {
                    window.ReactNativeWebView.postMessage("FAILED");
                });
                rzp.open();
            </script>
        </body>
        </html>
    `;

    return (
        <ScrollView style={{ marginTop: 55 }}>

            {/* ── Razorpay Modal ── */}
            <Modal
                visible={showRazorpay}
                animationType="slide"
                onRequestClose={() => setShowRazorpay(false)}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        onPress={() => setShowRazorpay(false)}
                        style={{ padding: 15, backgroundColor: "#00CED1", alignItems: "flex-start" }}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>✕ Close</Text>
                    </TouchableOpacity>
                    <WebView
                        source={{ html: razorpayHtml }}
                        onMessage={handleRazorpayMessage}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <ActivityIndicator
                                size="large"
                                color="#00CED1"
                                style={{ flex: 1, marginTop: 300 }}
                            />
                        )}
                    />
                </View>
            </Modal>

            {/* ── Progress Bar ── */}
            <View style={{ paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {steps.map((step, index) => (
                        <View key={index} style={{ flex: 1, alignItems: "center" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                                <View style={{
                                    flex: 1, height: 2,
                                    backgroundColor: index === 0 ? "transparent" : index <= currentStep ? "green" : "#CCC"
                                }} />
                                <View style={{
                                    width: 34, height: 34, borderRadius: 17,
                                    backgroundColor: index < currentStep ? "green" : index === currentStep ? "#008397" : "#CCC",
                                    justifyContent: "center", alignItems: "center",
                                }}>
                                    {index < currentStep ? (
                                        <FontAwesome5 name="check" size={14} color="white" />
                                    ) : (
                                        <Text style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>{index + 1}</Text>
                                    )}
                                </View>
                                <View style={{
                                    flex: 1, height: 2,
                                    backgroundColor: index === steps.length - 1 ? "transparent" : index < currentStep ? "green" : "#CCC"
                                }} />
                            </View>
                            <Text style={{
                                marginTop: 6, fontSize: 11,
                                color: index <= currentStep ? "green" : "gray",
                                fontWeight: index === currentStep ? "bold" : "normal"
                            }}>
                                {step.title}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* ── Step 1: Address ── */}
            {currentStep === 0 && (
                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
                        Select Delivery Address
                    </Text>
                    {addresses?.length === 0 && (
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: "gray" }}>No addresses found</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("address")}
                                style={{ backgroundColor: "#FFC72C", padding: 10, borderRadius: 5, marginTop: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>Add New Address</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {addresses?.map((item, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setSelectedAddress(item)}
                            style={{
                                borderWidth: 1,
                                borderColor: selectedAddress?._id === item?._id ? "#008397" : "#D0D0D0",
                                padding: 12, marginVertical: 8, borderRadius: 8,
                                backgroundColor: selectedAddress?._id === item?._id ? "#f0fafc" : "white",
                                flexDirection: "row", gap: 10, alignItems: "flex-start"
                            }}>
                            {selectedAddress?._id === item?._id ? (
                                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                            ) : (
                                <Entypo name="circle" size={20} color="gray" />
                            )}
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item?.name}</Text>
                                    <Entypo name="location-pin" size={18} color="red" />
                                </View>
                                <Text style={{ color: "#555", marginTop: 3 }}>{item?.houseNumber}, {item?.landmark}</Text>
                                <Text style={{ color: "#555" }}>{item?.street}</Text>
                                <Text style={{ color: "#555" }}>PIN: {item?.postalCode}</Text>
                                <Text style={{ color: "#555" }}>Phone: {item?.mobileNumber}</Text>
                                {selectedAddress?._id === item?._id && (
                                    <TouchableOpacity
                                        onPress={() => setCurrentStep(1)}
                                        style={{
                                            backgroundColor: "#008397", padding: 10,
                                            borderRadius: 20, alignItems: "center", marginTop: 10
                                        }}>
                                        <Text style={{ color: "white", fontWeight: "bold" }}>
                                            Deliver to this Address
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}

            {/* ── Step 2: Delivery ── */}
            {currentStep === 1 && (
                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
                        Choose Delivery Option
                    </Text>
                    <Pressable
                        onPress={() => setOption(true)}
                        style={{
                            flexDirection: "row", alignItems: "center", gap: 10,
                            borderWidth: 1, borderColor: option ? "#008397" : "#D0D0D0",
                            padding: 12, borderRadius: 8,
                            backgroundColor: option ? "#f0fafc" : "white"
                        }}>
                        {option ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                        ) : (
                            <Entypo name="circle" size={20} color="gray" />
                        )}
                        <View>
                            <Text style={{ color: "green", fontWeight: "bold" }}>Tomorrow by 10 PM</Text>
                            <Text style={{ color: "green" }}>FREE Delivery with Prime</Text>
                        </View>
                    </Pressable>
                    <TouchableOpacity
                        onPress={() => {
                            if (!option) { Alert.alert("Please select a delivery option"); return; }
                            setCurrentStep(2);
                        }}
                        style={{
                            backgroundColor: "#FFC72C", padding: 12,
                            borderRadius: 20, alignItems: "center", marginTop: 15
                        }}>
                        <Text style={{ fontWeight: "bold" }}>Continue</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ── Step 3: Payment ── */}
            {currentStep === 2 && (
                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
                        Select Payment Method
                    </Text>
                    <Pressable
                        onPress={() => setSelectedOption("cash")}
                        style={{
                            padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 10,
                            borderColor: selectedOption === "cash" ? "#008397" : "#D0D0D0",
                            backgroundColor: selectedOption === "cash" ? "#f0fafc" : "white",
                            flexDirection: "row", alignItems: "center", gap: 10,
                        }}>
                        {selectedOption === "cash" ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                        ) : (
                            <Entypo name="circle" size={20} color="gray" />
                        )}
                        <View>
                            <Text style={{ fontWeight: "bold" }}>Cash on Delivery</Text>
                            <Text style={{ color: "gray", fontSize: 12 }}>Pay when your order arrives</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        onPress={() => setSelectedOption("card")}
                        style={{
                            padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 10,
                            borderColor: selectedOption === "card" ? "#008397" : "#D0D0D0",
                            backgroundColor: selectedOption === "card" ? "#f0fafc" : "white",
                            flexDirection: "row", alignItems: "center", gap: 10,
                        }}>
                        {selectedOption === "card" ? (
                            <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                        ) : (
                            <Entypo name="circle" size={20} color="gray" />
                        )}
                        <View>
                            <Text style={{ fontWeight: "bold" }}>UPI / Debit / Credit Card</Text>
                            <Text style={{ color: "gray", fontSize: 12 }}>Pay securely via Razorpay</Text>
                        </View>
                    </Pressable>
                    <TouchableOpacity
                        onPress={() => {
                            if (!selectedOption) { Alert.alert("Please select a payment method"); return; }
                            setCurrentStep(3);
                        }}
                        style={{
                            backgroundColor: "#FFC72C", padding: 12,
                            borderRadius: 20, alignItems: "center", marginTop: 10
                        }}>
                        <Text style={{ fontWeight: "bold" }}>Continue</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ── Step 4: Order Summary ── */}
            {currentStep === 3 && (
                <View style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 40 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>Order Summary</Text>

                    <View style={{ backgroundColor: "white", padding: 12, borderWidth: 1, borderColor: "#D0D0D0", borderRadius: 8, marginBottom: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15, marginBottom: 4 }}>
                            Shipping To: {selectedAddress?.name}
                        </Text>
                        <Text style={{ color: "gray" }}>{selectedAddress?.houseNumber}, {selectedAddress?.street}</Text>
                        <Text style={{ color: "gray" }}>PIN: {selectedAddress?.postalCode}</Text>
                        <Text style={{ color: "gray" }}>Phone: {selectedAddress?.mobileNumber}</Text>
                    </View>

                    <View style={{ backgroundColor: "white", padding: 12, borderWidth: 1, borderColor: "#D0D0D0", borderRadius: 8, marginBottom: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text style={{ color: "gray", fontSize: 15 }}>Items Total</Text>
                            <Text style={{ color: "gray", fontSize: 15 }}>₹{total}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text style={{ color: "gray", fontSize: 15 }}>Delivery</Text>
                            <Text style={{ color: "green", fontSize: 15, fontWeight: "bold" }}>FREE</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#D0D0D0", paddingTop: 8 }}>
                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Order Total</Text>
                            <Text style={{ fontSize: 17, fontWeight: "bold", color: "#C60C30" }}>₹{total}</Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: "white", padding: 12, borderWidth: 1, borderColor: "#D0D0D0", borderRadius: 8, marginBottom: 20 }}>
                        <Text style={{ color: "gray", fontSize: 14 }}>Payment Method</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 15, marginTop: 4 }}>
                            {selectedOption === "cash" ? "Cash on Delivery" : "UPI / Card (Razorpay)"}
                        </Text>
                    </View>

                    {/* Cash on Delivery Button */}
                    {selectedOption === "cash" && (
                        <TouchableOpacity
                            onPress={handlePlaceOrder}
                            style={{ backgroundColor: "#FFC72C", padding: 14, borderRadius: 20, alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Place Your Order</Text>
                        </TouchableOpacity>
                    )}

                    {/* Razorpay Button - opens Modal with WebView */}
                    {selectedOption === "card" && (
                        <TouchableOpacity
                            onPress={() => setShowRazorpay(true)}
                            style={{ backgroundColor: "#004B8D", padding: 14, borderRadius: 20, alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, color: "white" }}>
                                Pay ₹{total} via Razorpay
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

        </ScrollView>
    );
};

export default confirmation;