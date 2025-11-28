import { StyleSheet, Text, View } from 'react-native';

export default function HUD() {
  return (
    <View style={styles.hud}>
      <Text style={styles.text}>🎯 Tilt to Move</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
