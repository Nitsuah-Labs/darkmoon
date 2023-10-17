import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const ShootingRange = () => {
  const boxRef = useRef();

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={boxRef} onClick={(e) => console.log("click")} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={new THREE.Color("lightblue")} />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
};

export default ShootingRange;
