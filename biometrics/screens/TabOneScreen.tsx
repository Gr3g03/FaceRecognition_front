import { Alert, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
  };

  const alertComponent = (title: any, mess: any, btnTxt: any, btnFunc: any) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    if (!isBiometricAvailable)
      return alertComponent('Please enter your password', 'Biometric Authentication not supported', 'OK', () => fallBackToDefaultAuth());
    let supportedBiometrics;
    if (isBiometricAvailable) supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) return alertComponent('Biometric record not found', 'Please login with your password', 'OK', () => fallBackToDefaultAuth());
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });
    if (biometricAuth) {
      navigation.navigate('Modal');
      console.log('success');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      <View style={styles.textContainer}>
        <Text style={styles.welcome}>Login</Text>
      </View>
      {isBiometricSupported ? (
        <TouchableOpacity style={styles.finger} onPress={handleBiometricAuth}>
          <Ionicons name="finger-print" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <Text>Face or Fingerprint scanner is available on this device</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 150,
  },
  textContainer: {
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 40,
  },
  welcome: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 40,
  },
  finger: {
    height: 70,
    width: 70,
    borderWidth: 1,
    borderColor: '#F4AE64',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
