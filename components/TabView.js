import * as React from 'react';
import { Pressable, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to our Home Screen</Text>
      <Text>Checkout screens from the tab below</Text>
    </View>
  );
}
function Conference({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Conference Details</Text>
       <Pressable
        onPress={() => navigation.navigate('Story')}
        style={{ padding: 10, marginBottom: 10, marginTop: 10 }}
      >
      <Text>Go to Story</Text>
      </Pressable>
    </View>
  );
}
function Story({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Our Story</Text>
       <Pressable
        onPress={() => navigation.navigate('Conference')}
        style={{ padding: 10, marginBottom: 10, marginTop: 10 }}
      >
      <Text>Go to Conference</Text>
      </Pressable>
    </View>
  );
}
const Tab = createBottomTabNavigator();
function App() {
  return (
     <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Conference') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            } else if (route.name === 'Story') {
              iconName = focused ? 'ios-people' : 'ios-people';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={Home}  />
        <Tab.Screen name="Conference" component={Conference} />
        <Tab.Screen name="Story" component={Story} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default TabView;