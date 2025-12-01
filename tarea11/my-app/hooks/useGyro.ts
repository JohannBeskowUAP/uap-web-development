import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';

type RotationData = {
  x: number;
  y: number;
  z: number;
};

export function useGyro(): RotationData {
  const [rotation, setRotation] = useState<RotationData>({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    Gyroscope.setUpdateInterval(100);
    const sub = Gyroscope.addListener((data) => setRotation(data));
    return () => {
      sub && sub.remove();
    };
  }, []);

  return rotation;
}