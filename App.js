import { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import Login from "./Login.js";
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [bpm, setbpm] = useState(0);

  const isCalculating = useRef(false);
  const canFinishCalculation = useRef(false);
  const prevSteps = useRef(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }
      // console.log(sec)

      // beforeStepCount = currentStepCount
      // console.log('Hello')
      console.log(prevSteps.current);
      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
        if (!isCalculating.current && !canFinishCalculation.current) {
          console.log("wdwd");
          isCalculating.current = true;
          prevSteps.current = result.steps;
          setTimeout(() => {  
            isCalculating.current = false;
            canFinishCalculation.current = true;
          }, 10000);
        }
        if (canFinishCalculation.current) {
          setbpm((result.steps - prevSteps.current) * 5.7);
          console.log((result.steps - prevSteps.current) * 5.7);
          canFinishCalculation.current = false;
        }
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    return () => subscription && subscription.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <View style={styles.container}>
          <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
          <Text>Step taken in the last 24 hours: {pastStepCount}</Text>
          <Text>Walk! And watch this go up: {currentStepCount}</Text>
          <Text>BPM: {bpm}</Text>
          <Text>DWDWD</Text>
        </View> */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Welcome'}}
        />
        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
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