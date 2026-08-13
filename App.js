import React from 'react';
import { View, StyleSheet } from 'react-native';
import TestListScreen from './src/screens/TestListScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <TestListScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});