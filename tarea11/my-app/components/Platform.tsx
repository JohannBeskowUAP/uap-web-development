import type { FC } from 'react';
import { StyleSheet, View } from 'react-native';

type PlatformProps = {
  x: number;
  y: number;
};

const Platform: FC<PlatformProps> = ({ x, y }) => {
  return (
    <View
      style={[
        styles.platform,
        { transform: [{ translateX: x }, { translateY: -y }] },
      ]}
    />
  );
};

export default Platform;

const styles = StyleSheet.create({
  platform: {
    width: 100,
    height: 20,
    backgroundColor: '#2ed573',
    position: 'absolute',
    borderRadius: 10,
  },
});