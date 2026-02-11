import React from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import RoomCreationScreen from './src/screens/RoomCreationScreen';
import DesignStudioScreen from './src/screens/DesignStudioScreen';
import SavedDesignsScreen from './src/screens/SavedDesignsScreen';
import FurnitureCatalogScreen from './src/screens/FurnitureCatalogScreen';
import theme from './src/theme/colors';
import { RootStackParamList } from './src/types';
import StyledIcon from './src/components/StyledIcon';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// ─── Tab Bar Icon ─────────────────────────────────────
const TabBarIcon = ({ iconName, focused }: { iconName: string; focused: boolean }) => (
  <View style={[
    tabStyles.iconWrap,
    focused && tabStyles.iconWrapActive,
  ]}>
    <StyledIcon
      name={iconName}
      size="sm"
      color={focused ? theme.colors.primary : theme.colors.textLight}
    />
  </View>
);

const tabStyles = StyleSheet.create({
  iconWrap: {
    width: 42,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primaryGhost,
  },
});

// ─── Main Tab Navigator ───────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.divider,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          ...theme.shadows.medium,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon iconName="home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="RoomsTab"
        component={RoomCreationScreen}
        options={{
          tabBarLabel: 'Rooms',
          tabBarIcon: ({ focused }) => <TabBarIcon iconName="room" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SavedTab"
        component={SavedDesignsScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ focused }) => <TabBarIcon iconName="saved" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root App ─────────────────────────────────────────
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primaryDark} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
            animationEnabled: true,
            gestureEnabled: true,
            animationTypeForReplace: 'push',
          }}
        >
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen name="RoomCreation" component={RoomCreationScreen} />
          <Stack.Screen name="DesignStudio" component={DesignStudioScreen} />
          <Stack.Screen name="SavedDesigns" component={SavedDesignsScreen} />
          <Stack.Screen name="FurnitureCatalog" component={FurnitureCatalogScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}