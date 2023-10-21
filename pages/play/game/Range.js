// Range.js
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import Controls from "./Controls";
import Floor from "./Floor";
import Player from "./Player";

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <shadowMaterial attach="material" color="#171717" />
    </mesh>
  );
}

function Cube(props) {
  const [ref] = useBox(() => ({
    mass: 1,
    position: [0, 5, 0],
    rotation: [0.4, 0.2, 0.5],
    ...props
  }));
  const color = props.color ? props.color : "red";
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
}

function Range() {
  const playerRef = useRef();

  return (
    <Canvas
      shadowMap
      sRGB
      gl={{ alpha: false }}
      camera={{ position: [-1, 1, 5], fov: 50, mass: 1 }}
    >
      <color attach="background" args={["grey"]} />
      <Physics>
        <Stats />
        <Controls playerRef={playerRef} />
<hemisphereLight intensity={0.35} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <Floor />
        <Player ref={playerRef}/>
        <Cube />
        <Cube position={[0, 10, -2]} color="rebeccapurple" />
        <Cube position={[0, 20, -2]} color="darkseagreen" />
      </Physics>
    </Canvas>
  );
}

export default Range;
