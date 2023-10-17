import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Player = ({ position, speed }) => {
  const playerRef = useRef();

  // State to store movement directions
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Update player position based on keys
  useFrame(() => {
    const delta = speed * 0.001;
    const direction = new THREE.Vector3();

    if (keys.forward) direction.z -= 1;
    if (keys.backward) direction.z += 1;
    if (keys.left) direction.x -= 1;
    if (keys.right) direction.x += 1;

    direction.normalize().multiplyScalar(delta);

    playerRef.current.position.add(direction);
  });

  // Event listeners for keydown and keyup
  const handleKeyDown = (event) => {
    setKeys((prev) => ({ ...prev, [event.key]: true }));
  };

  const handleKeyUp = (event) => {
    setKeys((prev) => ({ ...prev, [event.key]: false }));
  };

  return (
    <mesh ref={playerRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={new THREE.Color("red")} />
      {/* Attach event listeners to the document */}
      <primitive object={document} onClick={() => playerRef.current.focus()} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0} />
    </mesh>
  );
};

const ShootingRange = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* Add Player component with initial position and movement speed */}
      <Player position={[0, 0, 0]} speed={5} />
      <OrbitControls />
    </Canvas>
  );
};

export default ShootingRange;
