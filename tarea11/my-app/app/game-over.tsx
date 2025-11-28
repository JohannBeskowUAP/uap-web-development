import { router } from 'expo-router';
import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const GameOverScreen: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over 💀</Text>
      <Pressable style={styles.button} onPress={() => router.replace('./game')}>
        <Text style={styles.text}>Play Again</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.replace('./')}>
        <Text style={styles.text}>Go Home</Text>
      </Pressable>
    </View>
  );
};

export default GameOverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
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
    marginTop: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});