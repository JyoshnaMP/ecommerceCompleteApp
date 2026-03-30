import { View, Text } from 'react-native'
import React from 'react'

const orderScreen = () => {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white"}}>
        <View style={{width: "85%", padding: 30, borderRadius: 15, backgroundColor: "#F5F7FA", alignItems: "center"}}>
            <Text>✅</Text>
            <Text style={{fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center"}}>Order Placed Successfully</Text>
            <Text style={{fontSize: 15, textAlign: "center"}}>Thank you for your order</Text>
        </View>
      
    </View>
  )
}

export default orderScreen