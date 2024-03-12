// src/routes.tsx

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Home } from './screens/Home';
import { Usuario } from './screens/Cadastro/Usuario';

const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    background: 'white',
  },
};

const Routes = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
            title: 'Lista de usuários'
          }}
        />
        <Tab.Screen
          name="Usuario"
          component={Usuario}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-multiple-plus" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
