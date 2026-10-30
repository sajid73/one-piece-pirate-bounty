"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function PosterMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 850;
    const x = c.getContext("2d")!;

    x.fillStyle = "#f5e6c8";
    x.fillRect(0, 0, 600, 850);
    const g = x.createRadialGradient(300, 425, 100, 300, 425, 500);
    g.addColorStop(0, "rgba(245,230,200,0)");
    g.addColorStop(1, "rgba(180,150,100,0.3)");
    x.fillStyle = g;
    x.fillRect(0, 0, 600, 850);

    x.fillStyle = "#2b1810";

    // WANTED header
    x.font = "bold 72px serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("WANTED", 300, 55);

    // Rule
    x.strokeStyle = "#2b1810";
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(42, 92);
    x.lineTo(558, 92);
    x.stroke();

    // Photo frame
    x.fillStyle = "#3d2b1f";
    x.fillRect(38, 96, 524, 448);
    x.fillStyle = "#2a1f14";
    x.fillRect(42, 100, 516, 440);
    x.fillStyle = "#4a3828";
    x.font = "bold 90px serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("?", 300, 320);

    // DEAD OR ALIVE with spacing
    x.fillStyle = "#2b1810";
    x.font = "bold 21px serif";
    x.textBaseline = "middle";
    x.fillText("D E A D   O R   A L I V E", 300, 567);

    // Name with middle dot
    x.font = "bold 42px serif";
    x.fillText("YOUR·NAME", 300, 606);

    // Bounty
    x.font = "bold 28px serif";
    x.fillText("$3,000,000,000-", 300, 658);

    // Footer
    x.globalAlpha = 0.5;
    x.font = "8.5px serif";
    x.textAlign = "left";
    x.textBaseline = "top";
    x.fillText("ANY INFORMATION LEADING TO THE CAPTURE OF THE", 47, 705);
    x.fillText("INDIVIDUAL ABOVE SHOULD BE REPORTED TO YOUR", 47, 717);
    x.fillText("LOCAL BOUNTY OFFICE IMMEDIATELY.", 47, 729);
    x.globalAlpha = 1;

    // MARINE
    x.fillStyle = "#2b1810";
    x.font = "bold 34px serif";
    x.textAlign = "right";
    x.textBaseline = "middle";
    x.fillText("MARINE", 555, 790);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.rotation.y = THREE.MathUtils.lerp(
      mesh.current.rotation.y,
      pointer.x * 0.15,
      0.05,
    );
    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      -pointer.y * 0.1,
      0.05,
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={mesh} castShadow>
        <planeGeometry args={[3, 4.25]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

const DUST_COUNT = 40;
const DUST_POS = new Float32Array(DUST_COUNT * 3);
for (let _i = 0; _i < DUST_COUNT; _i++) {
  DUST_POS[_i * 3] = (Math.sin(_i * 127.1 + 311.7) * 0.5 + 0.5 - 0.5) * 12;
  DUST_POS[_i * 3 + 1] = (Math.sin(_i * 269.5 + 183.3) * 0.5 + 0.5 - 0.5) * 12;
  DUST_POS[_i * 3 + 2] = (Math.sin(_i * 419.2 + 371.9) * 0.5 + 0.5 - 0.5) * 8;
}

function Dust() {
  const ref = useRef<THREE.Points>(null);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(DUST_POS, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.04} color="#c9a84c" transparent opacity={0.4} />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} color="#ffeedd" />
      <pointLight position={[-3, -2, 4]} intensity={0.4} color="#c9a84c" />
      <PosterMesh />
      <Dust />
    </Canvas>
  );
}
