import { router } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const PLAYER_RADIUS = 20;
const GRAVITY = 0.5;
const JUMP_FORCE = -20;
const PLATFORM_COUNT = 7;
const PLATFORM_HEIGHT = 12;
const TILT_SENSITIVITY = 25;

type Player = {
  x: number;
  y: number;
  vy: number;
};

type Platform = {
  x: number;
  y: number;
  width: number;
};

export default function GameScreen() {
  const [player, setPlayer] = useState<Player>({
    x: width / 2 - PLAYER_RADIUS,
    y: height / 2,
    vy: 0,
  });

  const [platforms, setPlatforms] = useState<Platform[]>(
    Array.from({ length: PLATFORM_COUNT }).map((_, i) => ({
      x: Math.random() * (width - 100),
      y: height - i * 120,
      width: 100,
    }))
  );

  const [gameOver, setGameOver] = useState(false);

  const tiltRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const scrollOffset = useRef<number>(0);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(16);
    const sub = DeviceMotion.addListener(({ rotation }) => {
      if (rotation?.gamma != null) {
        tiltRef.current = rotation.gamma;
      }
    });
    return () => {
      sub && sub.remove();
    };
  }, []);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => router.replace('./game-over'), 0);
    }
  }, [gameOver]);

  useEffect(() => {
    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 16.6;
      lastTime = now;

      setPlayer((p) => {
        let vy = p.vy + GRAVITY * delta;
        let y = p.y + vy * delta;

        let x = p.x + tiltRef.current * TILT_SENSITIVITY * delta;
        x = Math.max(0, Math.min(width - PLAYER_RADIUS * 2, x));

        platforms.forEach((plat) => {
          const withinX = x + PLAYER_RADIUS > plat.x && x < plat.x + plat.width;
          const touchingY =
            vy > 0 &&
            y + PLAYER_RADIUS >= plat.y &&
            y + PLAYER_RADIUS <= plat.y + PLATFORM_HEIGHT;

          if (withinX && touchingY) {
            vy = JUMP_FORCE;
            y = plat.y - PLAYER_RADIUS;
          }
        });

        if (y < height / 2) {
          const diff = height / 2 - y;
          y = height / 2;
          scrollOffset.current += diff;

          setPlatforms((plats) =>
            plats.map((plat) => ({
              ...plat,
              y: plat.y + diff,
            }))
          );
        }

        setPlatforms((plats) =>
          plats.map((plat) =>
            plat.y > height
              ? {
                  x: Math.random() * (width - 100),
                  y: plat.y - height - 120,
                  width: 100,
                }
              : plat
          )
        );

        if (y + PLAYER_RADIUS * 2 >= height) {
          if (animRef.current) cancelAnimationFrame(animRef.current);
          setGameOver(true);
        }

        return { x, y, vy };
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [platforms]);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          left: player.x,
          top: player.y,
          width: PLAYER_RADIUS * 2,
          height: PLAYER_RADIUS * 2,
          borderRadius: PLAYER_RADIUS,
          backgroundColor: 'deepskyblue',
        }}
      />
      {platforms.map((p, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.width,
            height: PLATFORM_HEIGHT,
            backgroundColor: '#4caf50',
            borderRadius: 5,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 40, color: '#fff', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});