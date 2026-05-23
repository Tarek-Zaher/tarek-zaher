import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { useState, useEffect } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import BlurBackground from '../../components/ambient-backgrounds/blur';

function Cassette() {
    const group = useRef();

    useFrame((state) => {
        group.current.rotation.y = state.clock.elapsedTime * 0.4;
    });

    const mat = useMemo(() => new THREE.LineBasicMaterial({ color: '#e0d0ff' }), []);

    const bodyEdges = useMemo(() =>
        new THREE.EdgesGeometry(new THREE.BoxGeometry(4.0, 2.55, 0.5)), []);

    const windowEdges = useMemo(() =>
        new THREE.EdgesGeometry(new THREE.BoxGeometry(2.8, 1.3, 0.6)), []);

    const reelEdges = useMemo(() =>
        new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.48, 0.48, 0.6, 24)), []);

    const hubEdges = useMemo(() =>
        new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 12)), []);

    return (
        <group ref={group}>
            <lineSegments geometry={bodyEdges} material={mat} />
            <lineSegments geometry={windowEdges} material={mat} position={[0, -0.35, 0]} />
            <lineSegments geometry={reelEdges} material={mat} position={[-0.95, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments geometry={hubEdges} material={mat} position={[-0.95, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments geometry={reelEdges} material={mat} position={[0.95, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments geometry={hubEdges} material={mat} position={[0.95, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
    );
}

export default function CassetteProject() {

    const [personalness, setPersonalness] = useState(0);

    useGSAP(() => {
        gsap.set(['html', 'body'], {
            backgroundColor: '#1A1423',
        });
    });

    return (
        <div class="relative text-slate-100 h-[100vh]">
            <BlurBackground />
            <div class="relative z-1">
                <h1 class="text-8xl text-slate-100 text-center pt-8 font-bold">Cassette Project</h1>
                <div style={{ width: '100%', height: '420px' }}>
                    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                        <Cassette />
                        <OrbitControls enableZoom={false} />
                    </Canvas>
                </div>
                <h2 class="text-5xl text-slate-100 text-center">How It Works:</h2>
                <div class="flex flex-row justify-center text-center">
                    <div class="p-12 basis-md">
                        <h5>Members have cassette players</h5>
                    </div>
                    <div class="p-12 basis-md">
                        <h5 class="text-xl">Members record personal audio tapes</h5>
                        <output id="value" class="block mt-4">{personalness}</output>
                        <input 
                        class="" 
                        type="range" 
                        id="personalness" 
                        name="personalness" 
                        min="0" max="11" value={personalness}
                        onInput={(e) => setPersonalness(Number(e.target.value))}
                        />
                        <label class="block" for="personalness">Personalness</label>
                    </div>
                    <div class="p-12 basis-md">
                        <h5>Members lend tapes to each other from their personal lending libraries</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}