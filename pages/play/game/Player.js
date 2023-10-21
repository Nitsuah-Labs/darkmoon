// Player.js
import React, { forwardRef } from "react";
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
      <boxBufferGeometry />
      <meshLambertMaterial attach="material" color="blue" />
    </mesh>
  );
});

export default Player;