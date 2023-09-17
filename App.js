import { StyleSheet, Text, View } from 'react-native';
import Login from "./Login.js";
import Home from "./Home.js";
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <View style={styles.container}>
          <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
          <Text>Step taken in the last 24 hours: {pastStepCount}</Text>
          <Text>Walk! And watch this go up: {currentStepCount}</Text>
          <Text>BPM: {bpm}</Text
          <Text>DWDWD</Text>
        </View> */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Welcome to TempoTunes'}}
        />
        <Stack.Screen name="Home" component={Home} 
          options={{title: 'Welcome to TempoTunes'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});