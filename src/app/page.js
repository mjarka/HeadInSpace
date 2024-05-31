"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Helper,
  OrbitControls,
  PerspectiveCamera,
  useHelper,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Model } from "./Model";

import Slider from "./Slider";
import { BoxHelper, DirectionalLightHelper } from "three";
import { Lines } from "./Lines";

// Slider Component

// RotatingLight Component
function RotatingLight({ radius, angle, yPos, helper }) {
  const lightRef = useRef();

  // Show helper
  // useHelper(lightRef, DirectionalLightHelper, 1, "cyan");

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(angle) * radius;
      lightRef.current.position.z = Math.sin(angle) * radius;
    }
  });
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.y = yPos;
    }
  });
  return (
    <spotLight
      castShadow
      ref={lightRef}
      position={[0, yPos, 0]}
      intensity={8.5}
      shadow-mapSize-width={4096}
      shadow-mapSize-height={4096}
      shadow-bias={-0.0001}
      color="white"
    >
      {helper && (
        <Helper type={DirectionalLightHelper} args={[1, "royalblue"]} />
      )}
    </spotLight>
  );
}

// Home Component
export default function Home() {
  const [angle, setAngle] = useState(0);
  const [fov, setFov] = useState(50);
  const [cameraPosition, setCameraPosition] = useState([4, 0, 11]);
  const [yPos, setyPos] = useState(2);
  const cameraRef = useRef();
  const [showLines, setShowLines] = useState(true);
  useEffect(() => {
    if (cameraRef.current) {
      // Update camera position based on FOV change
      // For example, move the camera along the z-axis when FOV changes
      // setCameraPosition((prevPosition) => {
      //   return [
      //     4 / (2 * Math.tan((fov * Math.PI) / 180 / 2)),
      //     0 / (2 * Math.tan((fov * Math.PI) / 180 / 2)),
      //     9 / (2 * Math.tan((fov * Math.PI) / 180 / 2)),
      //   ];
      // });

      const vectorToOrigin = cameraRef.current.position
        .clone()

        .normalize();
      console.log(vectorToOrigin);
      // const distance =  cameraRef.current.position.distanceTo({ x: 0, y: 0, z: 0 })
      const distance = 11 / (2 * Math.tan((fov * Math.PI) / 180 / 2));
      const vectorDistance = vectorToOrigin.multiplyScalar(distance);

      setCameraPosition((prevPosition) => {
        return vectorDistance;
      });
      cameraRef.current.updateProjectionMatrix();
    }
  }, [fov]);

  // 4 / (2 * Math.tan((fov * Math.PI) / 180 / 2)),
  // 5 / (2 * Math.tan((fov * Math.PI) / 180 / 2)),
  // 10 / (2 * Math.tan((fov * Math.PI) / 180 / 2)),
  return (
    <main className="flex flex-col items-center justify-between  bg-gradient-radial from-gray-600 via-gray-700 to-gray-800">
      <div className="w-full h-screen">
        <div className="p-8 absolute w-full  z-10 ">
          <button
            className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => setShowLines(!showLines)}
          >
            {showLines ? "Hide Lines" : "Show Lines"}
          </button>
          <Slider
            description={`Light angle: ${Math.round(angle * (180 / Math.PI))}°`}
            value={angle}
            min={0}
            max={2 * Math.PI}
            onChange={(e) => {
              setAngle(parseFloat(e.target.value));
            }}
          />
          <Slider
            description={`Light position: `}
            value={yPos}
            min={-4}
            max={4}
            onChange={(e) => {
              setyPos(parseFloat(e.target.value));
            }}
          />
          <Slider
            description={`Field of View: ${fov}`}
            value={fov}
            min={30}
            max={110}
            onChange={(e) => {
              setFov(parseFloat(e.target.value));
            }}
          />
        </div>
        <Canvas shadows>
          <PerspectiveCamera
            position={cameraPosition}
            ref={cameraRef}
            makeDefault
            fov={fov}
          />
          <Suspense fallback={null}>
            <RotatingLight
              radius={4}
              angle={angle}
              yPos={yPos}
              helper={showLines}
            />
            <ambientLight intensity={0.04} />
            {/* Assuming Model is a component you have defined */}
            <Model />
            {showLines && <Lines />}
            <OrbitControls enableZoom={false} />
            <Environment environmentIntensity={0.2} preset="night" />
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}
