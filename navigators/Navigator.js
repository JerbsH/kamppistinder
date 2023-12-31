import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import MyFiles from '../views/MyFiles';
import SwipeCards from '../views/SwipeCards';
import Single from '../views/Single';
import Modify from '../views/Modify';
import Comments from '../views/Comments';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const heartIcon = () => (
  <Icon name="heart-outline" style={styles.icon} fill="#000" />
);
const personIcon = () => (
  <Icon name="person-outline" style={styles.icon} fill="#000" />
);
const swipeIcon = () => (
  <Icon name="search-outline" style={styles.icon} fill="#000" />
);

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
});

const Tabscreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Swipe Cards"
        component={SwipeCards}
        options={{
          tabBarIcon: swipeIcon,
          tabBarActiveTintColor: '#000',
          tabBarActiveBackgroundColor: '#ffa575',
          tabBarInactiveTintColor: '#000',
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: personIcon,
          tabBarActiveTintColor: '#000',
          tabBarActiveBackgroundColor: '#ffa575',
          tabBarInactiveTintColor: '#000',
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="My Likes"
        component={Home}
        options={{
          tabBarIcon: heartIcon,
          tabBarActiveTintColor: '#000',
          tabBarActiveBackgroundColor: '#ffa575',
          tabBarInactiveTintColor: '#000',
          headerTitleAlign: 'center',
        }}
      />
    </Tab.Navigator>
  );
};

const Stackscreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={Tabscreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="My files" component={MyFiles} />
          <Stack.Screen name="Single"
           component={Single}
           options={{

          headerTitle: ""
           }} />
          <Stack.Screen name="Modify file" component={Modify} />
          <Stack.Screen name="Comments" component={Comments}/>

        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stackscreen />
    </NavigationContainer>
  );
};

export default Navigator;
