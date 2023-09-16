import { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  var beforeStepCount = 0;
  const [bpm, setbpm] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  var currentStepCount2 = useRef(0);

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
      var sec = new Date().getSeconds()
      // console.log(sec)

      // beforeStepCount = currentStepCount
      // console.log('Hello')
      setTimeout(() => {  
        console.log('World!'); 
        setbpm(currentStepCount * 6)
      }, 10000);
      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
        currentStepCount2 = result.steps;
        setbpm(currentStepCount2 * 6);
        console.log(currentStepCount2); 
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    return () => subscription && subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
      <Text>BPM: {bpm}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
