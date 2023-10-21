// Controls.js
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
    console.log("handleMovement called");  
    if (moveForward) {
      controlsRef.current.moveForward(velocity);
    } else if (moveLeft) {
      controlsRef.current.moveRight(-strafeSpeed);
    } else if (moveBackward) {
      controlsRef.current.moveForward(-velocity);
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
      console.log("Controls Position:", controlsObject.position);
      console.log("Player Position:", playerRef.current.position);
    }
  };

  useFrame(() => {
    console.log("useFrame called");
  
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
