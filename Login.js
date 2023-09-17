import { Button, StyleSheet, Text, View, TouchableOpacity,} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Linking } from 'react-native';
// import * as AuthSession from 'expo-auth-session';
import { useState, useEffect } from 'react';
import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function Login ( {navigate} ) {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '7decfe78bc194deda3d160308727d5ae',
      scopes: ['user-read-email', 'playlist-modify-public'],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({preferLocalhost: true}),
    },
    discovery
  );

  React.useEffect(() => {
    console.log('redirect uri', makeRedirectUri({preferLocalhost: true}))
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);
  // const [redirectUri, setRedirectUri] = useState('');
  // const CLIENT_ID = "7decfe78bc194deda3d160308727d5ae"
  // // const REDIRECT_URI = AuthSession.makeRedirectUri()
  // const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  // const RESPONSE_TYPE = "token"
  // useEffect(() => {
  //   setRedirectUri(AuthSession.makeRedirectUri({preferLocalhost: true}));
  //   console.log('redirectUri', redirectUri)
  //   }, []);
  // () => Linking.openURL(`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=${RESPONSE_TYPE}`)

    return (
        <View style = {styles.background}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => promptAsync()}>
                <Text>Login to Spotify</Text>
            </TouchableOpacity>
            <StatusBar style="auto"/>
        </View>
    );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#06AF3C',
    height: 50,
    width: 150,
    marginTop: 250,
    marginLeft: 100,
    borderTopRightRadius:  10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
  }
});