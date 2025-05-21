import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import SupplyRegisterScreen from "./screens/SupplyRegisterScreen";
import SupplyListScreen from "./screens/SupplyListScreen";
import SupplyEditScreen from "./screens/SupplyEditScreen";
import SupplyMovementScreen from "./screens/SupplyMovementScreen";
import SummaryScreen from "./screens/SummaryScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="SupplyRegister" component={SupplyRegisterScreen} />
        <Stack.Screen name="SupplyList" component={SupplyListScreen} />
        <Stack.Screen name="SupplyEdit" component={SupplyEditScreen} />
        <Stack.Screen name="SupplyMovement" component={SupplyMovementScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}