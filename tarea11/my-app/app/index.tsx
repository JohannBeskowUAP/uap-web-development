import { router } from 'expo-router';
import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const HomeScreen: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>
      <Pressable style={styles.button} onPress={() => router.push('./game')}>
        <Text style={styles.buttonText}>Play</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101010',
  },
  title: {
    fontSize: 40,
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});