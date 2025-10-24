import type { FC } from 'react';
import { StyleSheet, View } from 'react-native';

type PlayerProps = {
  x: number;
  y: number;
};

const Player: FC<PlayerProps> = ({ x, y }) => {
  return (
    <View
      style={[
        styles.player,
        { transform: [{ translateX: x }, { translateY: -y }] },
      ]}
    />
  );
};

export default Player;

const styles = StyleSheet.create({
  player: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff4757',
    position: 'absolute',
  },
});