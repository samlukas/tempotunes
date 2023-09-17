import { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';


export default function Login ( {navigate} ) {

    const [headerMessageBeforeRun, setHeaderMessageBeforeRun] = useState(true);
    const [SPMMessageOn, setSPMMessage] = useState(true);
    const [SPMDisplay, setSPMDisplay] = useState(true);

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
        <View style = {styles.container}>
            {
                headerMessageBeforeRun ? (
                    <Text style = {styles.messages}>Welcome, start running! {"\n"} Within 30 seconds of running your rhythmic beats will come!</Text>
                    ): null
            }
            {
                SPMMessageOn ? (
                    <Text style = {styles.bpm}>SPM</Text>
                    ): null
            }
            {
                SPMMessageOn ? (
                    <Text style = {styles.bpm_footnote}>(updated roughly every 10 seconds)</Text>
                    ): null
            }
            {
                SPMDisplay ? (
                    <Text style = {styles.bpm}>{bpm}</Text>
                    ): null
            }
            <TouchableOpacity>
                <Text>wdwd</Text>
            </TouchableOpacity>
            <StatusBar style="auto"/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    messages: {
        marginTop: 100,
        textAlign: 'center',
        backgroundColor: '#06AF3C',
        borderTopRightRadius:  10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    bpm: {
        marginTop:60,
        fontSize: 30,
        textAlign: 'center',
        color: 'white',
    },
    bpm_footnote: {
        textAlign: 'center',
        color: 'white',
    }
});