import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Target = ({ position, updateHitCount, updateMissCount }) => {
  const [hit, setHit] = useState(false);
  const ref = useRef();
  const direction = useRef({ x: Math.random() - 0.5, y: Math.random() - 0.5 });

  useFrame(({ camera }) => {
    // Rotate the target based on the camera's frame angle
    const angle = Math.atan2(camera.position.x, camera.position.z);
    ref.current.rotation.y = angle;

    // Move the target closer to the camera
    const distance = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
    ref.current.position.x = Math.sin(angle) * distance * 0.5;
    ref.current.position.z = -Math.cos(angle) * distance * 0.5;

    // Move the target up and down
    const speed = 0.01;
    ref.current.position.y += speed * direction.current.y;

    if (ref.current.position.y > 2 || ref.current.position.y < -2) {
      direction.current.y *= -1;
    }
  });

  const handleClick = (event) => {
    // Check if the target was clicked
    if (event.object === ref.current) {
      setHit(true);
      updateHitCount();
      setTimeout(() => {
        setHit(false);
      }, 3000); // Reset the hit state after 3 seconds
    }
  };

  return (
    <mesh ref={ref} position={position} onClick={(event) => handleClick(event)}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hit ? 'red' : 'green'} />
    </mesh>
  );
};

const Background = () => {
  const { camera } = useThree();
  const ref = useRef();

  useEffect(() => {
    const handleMissClick = () => {
      updateMissCount();
    };

    ref.current.addEventListener('click', handleMissClick);

    return () => {
      ref.current.removeEventListener('click', handleMissClick);
    };
  }, []);

  return (
    <mesh ref={ref} position={[0, 0, -10]}>
      <planeBufferGeometry args={[100, 100]} />
      <meshStandardMaterial color="red" transparent opacity={0.5} depthWrite={false} />
    </mesh>
  );
};

const ShootingRange = () => {
  const [ship, setShip] = useState(null);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);

  useEffect(() => {
    // Load the ship model
    const loader = new GLTFLoader();
    loader.load('/models/TR-3B.glb', setShip);
  }, []);

  const updateHitCount = () => {
    setHitCount((prevCount) => prevCount + 1);
  };

  const updateMissCount = () => {
    setMissCount((prevCount) => prevCount + 1);
  };

  const accuracy = (hitCount / (hitCount + missCount)) * 100;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          zIndex: 1,
          color: 'white',
          pointerEvents: 'none',
        }}
      >
        <p>Hits: {hitCount}</p>
        <p>Misses: {missCount}</p>
        <p>Accuracy: {accuracy.toFixed(2)}%</p>
      </div>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        {ship && <primitive object={ship} position={[0, 0, -5]} />}
        <Background />
        <Target position={[0, 0, -20]} updateHitCount={updateHitCount} updateMissCount={updateMissCount} />
        <Target position={[0, 0, -15]} updateHitCount={updateHitCount} updateMissCount={updateMissCount} />
        <Target position={[0, 0, -10]} updateHitCount={updateHitCount} updateMissCount={updateMissCount} />
      </Canvas>
    </div>
  );
};

export default ShootingRange;
