import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
export default function Login () {
    return (
        <View Style = {styles.container}>
            <Text>LOL</Text>
            <StatusBar style="auto"/>
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