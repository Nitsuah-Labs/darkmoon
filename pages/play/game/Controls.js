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
    const deceleration = 0.001; // Try a smaller deceleration value
  
    // Update velocity based on acceleration and deceleration
    if (moveForward) {
      // Increase velocity when moving forward
      velocity = Math.min(velocity + acceleration, 0.1);
    } else if (moveBackward) {
      // Decrease velocity when moving backward
      const deceleratedVelocity = velocity > 0 ? Math.max(velocity - deceleration, 0) : Math.min(velocity + deceleration, 0);
      velocity = deceleratedVelocity;
    } else {
      // Decelerate when not moving
      velocity = 0;
      // const deceleratedVelocity = velocity > 0 ? Math.max(velocity - deceleration, 0) : Math.min(velocity + deceleration, 0);
      // velocity = deceleratedVelocity;
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
        controlsObject.position.y += 0.5;
        setJump(false);
      }
    }
  
    // Gravity simulation
    const gravity = 0.02; // Adjust the gravity value as needed

    const controlsObject = controlsRef.current.getObject();
    if (controlsObject) {
      if (controlsObject.position.y > 0) {
        // Apply gravity if the player is above the ground
        controlsObject.position.y -= gravity;
      } else {
        // Reset position to ground level
        controlsObject.position.y = 0;
      }
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
          return;

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
