import { Button, StyleSheet, Text, View, TouchableOpacity,} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Linking } from 'react-native';
// import * as AuthSession from 'expo-auth-session';
import { useState, useEffect } from 'react';
import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
global.Buffer = require('buffer').Buffer;

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function Login () {
  const redirectUri = makeRedirectUri({preferLocalhost: true})
  const clientId = process.env.REACT_APP_CLIENT_ID
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      scopes: ['user-read-email', 'playlist-modify-public', 'app-remote-control', 'streaming', 'user-modify-playback-state'],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: redirectUri,
    },
    discovery
  );

  const [token, setToken] = useState('')
  const [spotifyCode, setSpotifyCode] = useState('')

    // React.useEffect(() => {
    //   const hash = window.location.hash
    //   let token = window.localStorage.getItem("token")

    //   if(!token && hash) {
    //     token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

    //     console.log('token', token)
    //   }
    // },[])

  React.useEffect(() => {
    console.log('redirect uri', makeRedirectUri({preferLocalhost: true}))
    // console.log('response', response)
    if (response?.type === 'success') {
      const { code } = response.params;
      setSpotifyCode(code)
      // requestSpotifyToken()
      refreshSpotifyToken()
    }
  }, [response]);

  // {"authentication": null, "error": null, "errorCode": null, "params": {"code": "AQCa62anD26QJCPcJA45ue_IQv1A2JShBMso1TqH4oJyvFh1avGT33Yi7S1QY8vdCmQlJUJf3EugF_YA91r-owctUN4B6b_-iVVAR7hR56DqznXtvOOJ7yN_Tcyadko6Y97rJsr-GzPF5AhG9WIfG-fDAhUwJkOzxMzmW6FnHANqdveYM2UB0Zog97ubc9I1mumii-12BFRl0BzsTQfcc10", "state": "PT5pQnfCAp"}, "type": "success", "url": "exp://localhost:8081/?code=AQCa62anD26QJCPcJA45ue_IQv1A2JShBMso1TqH4oJyvFh1avGT33Yi7S1QY8vdCmQlJUJf3EugF_YA91r-owctUN4B6b_-iVVAR7hR56DqznXtvOOJ7yN_Tcyadko6Y97rJsr-GzPF5AhG9WIfG-fDAhUwJkOzxMzmW6FnHANqdveYM2UB0Zog97ubc9I1mumii-12BFRl0BzsTQfcc10&state=PT5pQnfCAp"}
  const requestSpotifyToken = () => {
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET
    const clientInfo = clientId + ':' + clientSecret
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ` + Buffer.from(clientInfo).toString('base64')},
      // body: JSON.stringify({grant_type: 'authorization_code', code: spotifyCode, redirect_uri: redirectUri})
      body: `grant_type=authorization_code&redirect_uri=${redirectUri}&code=${spotifyCode}`
    };
    fetch(discovery.tokenEndpoint, requestOptions)
    .then(response => response.json())
    .then(response => console.log('request spotify token response', response))
  } 

  const refreshSpotifyToken = () => {
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET
    const clientInfo = clientId + ':' + clientSecret
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ` + Buffer.from(clientInfo).toString('base64')},
      // body: JSON.stringify({grant_type: 'authorization_code', code: spotifyCode, redirect_uri: redirectUri})
      body: `grant_type=refresh_token&refresh_token=AQCd9C5cRT6LLpnRKBS5-SHuLacxTuexAzTquUDG21iYvzF9_6nKM2wWd7p8os6iiBgoeMatBFqyixJAnhb-ucOfkfxS8Xa0v8vHRyEdMGLoPdQWjoGWY8BAdhS7Yyn5fbM`
    };
    fetch(discovery.tokenEndpoint, requestOptions)
    .then(response => response.json())
    .then(response => console.log('refresh spotify token response', response))
  } 

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