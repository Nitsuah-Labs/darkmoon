import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";

const Controls = ({ playerRef }) => {
  const controlsRef = useRef();
  const isLocked = useRef(false);
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const [jump, setJump] = useState(false);

  const handleMovement = (velocity, strafeSpeed) => {
    // Introduce variables for acceleration and deceleration
    const acceleration = 0.002; // Try a smaller acceleration value
    const deceleration = 0.05; // Try a higher deceleration value
  
    // Update velocity based on acceleration and deceleration
    if (moveForward) {
      // Increase velocity when moving forward
      velocity = Math.min(velocity + acceleration, 0.1);
    } else if (moveBackward) {
      // Decrease velocity when moving backward
      velocity = Math.max(velocity - acceleration, -0.1);
    } else {
      // Decelerate when not moving
      const deceleratedVelocity = velocity > 0 ? Math.max(velocity - deceleration, 0) : Math.min(velocity + deceleration, 0);
      // Use the decelerated velocity only if it's not too small
      velocity = Math.abs(deceleratedVelocity) > 0.0001 ? deceleratedVelocity : 0;
    }
  
    // Update controls based on velocity
    controlsRef.current.moveForward(velocity);
  
    if (moveLeft) {
      controlsRef.current.moveRight(-strafeSpeed);
    } else if (moveRight) {
      controlsRef.current.moveRight(strafeSpeed);
    }
  
    if (jump) {
      const controlsObject = controlsRef.current.getObject();
      if (controlsObject) {
        controlsObject.position.y += 0.2;
        setJump(false);
      }
    }
  
    // Update player position based on the controls
    const controlsObject = controlsRef.current.getObject();
    if (controlsObject && playerRef.current) {
      playerRef.current.position.copy(controlsObject.position);
    }
  };

  useFrame(() => {
    const movementSpeed = 0.1;
    const strafeSpeed = 0.1;
    handleMovement(movementSpeed, strafeSpeed);
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          setMoveForward(true);
          break;

        case "ArrowLeft":
        case "KeyA":
          setMoveLeft(true);
          break;

        case "ArrowDown":
        case "KeyS":
          setMoveBackward(true);
          break;

        case "ArrowRight":
        case "KeyD":
          setMoveRight(true);
          break;

        case "Space":
          setJump(true);
          break;

        default:
          return;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          setMoveForward(false);
          break;

        case "ArrowLeft":
        case "KeyA":
          setMoveLeft(false);
          break;

        case "ArrowDown":
        case "KeyS":
          setMoveBackward(false);
          break;

        case "ArrowRight":
        case "KeyD":
          setMoveRight(false);
          break;

        default:
          return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <PointerLockControls
      ref={controlsRef}
      onUpdate={() => {
        if (controlsRef.current) {
          controlsRef.current.addEventListener("lock", () => {
            console.log("lock");
            isLocked.current = true;
          });
          controlsRef.current.addEventListener("unlock", () => {
            console.log("unlock");
            isLocked.current = false;
          });
        }
      }}
    />
  );
};

export default Controls;
