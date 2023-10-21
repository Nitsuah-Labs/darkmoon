// Player.js
import React, { forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";

const Player = forwardRef((props, ref) => {
  const [playerRef, api] = useBox(() => ({
    mass: 1,
    position: [0, 5, 0],
    rotation: [0, 0, 0],
    ...props,
    ref, // Assign the ref here
  }));

  return (
    <mesh receiveShadow castShadow ref={playerRef}>
      {/* Customize the player geometry/material as needed */}
      <boxBufferGeometry />
      <meshLambertMaterial attach="material" color="blue" />
    </mesh>
  );
});

export default Player;
