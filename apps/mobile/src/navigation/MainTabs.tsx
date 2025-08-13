import React from "react";
import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import StartScreen from "../screens/StartScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateTemplateScreen from "../screens/CreateTemplateScreen";

export type MainTabsParamList = {
    Home: undefined;
    Start: undefined;
    History: undefined;
    Profile: undefined;
    CreateTemplate: undefined; // keep as a tab destination
};

const Tab = createBottomTabNavigator<MainTabsParamList>();
export type MainTabsNav = BottomTabNavigationProp<MainTabsParamList>;

export default function MainTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Start" component={StartScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="CreateTemplate" component={CreateTemplateScreen} />
        </Tab.Navigator>
    );
}
