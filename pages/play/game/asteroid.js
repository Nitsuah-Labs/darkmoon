import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Target = () => {
  const [hit, setHit] = useState(false);
  const ref = useRef();

  useFrame(() => {
    // Rotate the target
    ref.current.rotation.y += 0.01;
  });

  const handleClick = () => {
    // Check if the target was clicked
    setHit(true);
  };

  return (
    <mesh ref={ref} onClick={handleClick}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hit ? 'red' : 'green'} />
    </mesh>
  );
};

const ShootingRange = () => {
  const [gun, setGun] = useState(null);

  useEffect(() => {
    // Load the gun model
    const loader = new GLTFLoader();
    loader.load('/models/gun.glb', setGun);
  }, []);

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      {gun && <primitive object={gun} position={[0, 0, -5]} />}
      <Target position={[0, 0, -10]} />
    </Canvas>
  );
};

export default ShootingRange;
