import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";

const Controls = ({ playerRef }) => {
  const controlsRef = useRef();
  const isLocked = useRef(false);
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const handleJump = (velocity) => {
    const controlsObject = controlsRef.current.getObject();
    if (controlsObject && movement.jump) {
      // Apply a continuous upward force
      velocity = Math.min(velocity + 0.01, 0.2);
      controlsObject.position.y += velocity;
    }
  };

  const handleMovement = (velocity, strafeSpeed, keys) => {
    const { forward, backward, left, right, jump } = keys;

    if (forward) {
      velocity = Math.min(velocity + 0.002, 0.1);
    } else if (backward) {
      velocity = Math.max(velocity - 0.002, -0.1);
    } else {
      velocity = 0;
    }

    controlsRef.current.moveForward(velocity);

    if (left) {
      controlsRef.current.moveRight(-strafeSpeed);
    } else if (right) {
      controlsRef.current.moveRight(strafeSpeed);
    }

    handleJump(velocity);

    const gravity = 0.001;
    const controlsObject = controlsRef.current.getObject();

    if (controlsObject && controlsObject.position.y > 0) {
      controlsObject.position.y -= gravity;
    } else {
      controlsObject.position.y = 0;
    }
  };

  useFrame(() => {
    const movementSpeed = 0.1;
    const strafeSpeed = 0.1;
    handleMovement(movementSpeed, strafeSpeed, movement);
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          setMovement((prev) => ({ ...prev, forward: true }));
          break;

        case "ArrowLeft":
        case "KeyA":
          setMovement((prev) => ({ ...prev, left: true }));
          break;

        case "ArrowDown":
        case "KeyS":
          setMovement((prev) => ({ ...prev, backward: true }));
          break;

        case "ArrowRight":
        case "KeyD":
          setMovement((prev) => ({ ...prev, right: true }));
          break;

        case "Space":
          setMovement((prev) => ({ ...prev, jump: true }));
          break;

        default:
          return;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          setMovement((prev) => ({ ...prev, forward: false }));
          break;

        case "ArrowLeft":
        case "KeyA":
          setMovement((prev) => ({ ...prev, left: false }));
          break;

        case "ArrowDown":
        case "KeyS":
          setMovement((prev) => ({ ...prev, backward: false }));
          break;

        case "ArrowRight":
        case "KeyD":
          setMovement((prev) => ({ ...prev, right: false }));
          break;

        case "Space":
          setMovement((prev) => ({ ...prev, jump: false }));
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
