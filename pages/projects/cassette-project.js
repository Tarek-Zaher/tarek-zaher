import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { useState, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import DitherGradientBackground from '../../components/ambient-backgrounds/dither-gradient';

const CASSETTE_TARGET_SIZE = { x: 4.0, y: 2.55, z: 0.5 };
const CASSETTE_COUNT = 6;
const COLLIDER_HALF = [
    CASSETTE_TARGET_SIZE.x / 2,
    CASSETTE_TARGET_SIZE.y / 2,
    CASSETTE_TARGET_SIZE.z / 2,
];

function buildCassetteModel(scene) {
    const inner = scene.clone(true);
    inner.rotation.x = -Math.PI / 2;
    const outer = new THREE.Group();
    outer.add(inner);
    outer.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(outer);
    const size = box.getSize(new THREE.Vector3());
    outer.scale.set(
        CASSETTE_TARGET_SIZE.x / size.x,
        CASSETTE_TARGET_SIZE.y / size.y,
        CASSETTE_TARGET_SIZE.z / size.z,
    );
    outer.updateMatrixWorld(true);

    const center = new THREE.Box3().setFromObject(outer).getCenter(new THREE.Vector3());
    outer.position.sub(center);
    return outer;
}

// Decorative rotating cassette with wireframe overlay — no physics
function WireframeCassette() {
    const group = useRef();
    const { scene } = useGLTF('/models/cassette-tape.glb');

    const mat = useMemo(() => new THREE.LineBasicMaterial({ color: '#e0d0ff' }), []);
    const bodyEdges   = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(4.0, 2.55, 0.5)), []);
    const windowEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.8, 1.3, 0.6)), []);
    const reelEdges   = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.48, 0.48, 0.6, 24)), []);
    const hubEdges    = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 12)), []);

    useFrame((state) => {
        group.current.rotation.y = state.clock.elapsedTime * 0.4;
    });

    return (
        // z=1 keeps it visually in front of the falling cassettes
        <group ref={group} position={[0, 0, 0]}>
            <lineSegments geometry={bodyEdges}   material={mat} />
            <lineSegments geometry={windowEdges} material={mat} position={[0, -0.35, 0]} />
            <lineSegments geometry={reelEdges}   material={mat} position={[-0.95, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments geometry={hubEdges}    material={mat} position={[-0.95, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments geometry={reelEdges}   material={mat} position={[0.95, -0.35, 0]}  rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments geometry={hubEdges}    material={mat} position={[0.95, -0.35, 0]}  rotation={[Math.PI / 2, 0, 0]} />
            {/* Front face label — sits in the label area above the tape window */}
            <Text
                font="/fonts/GladoliaDEMO-Regular.otf"
                position={[0, 0.75, 0.28]}
                fontSize={0.2}
                maxWidth={3.6}
                textAlign="center"
                anchorX="center"
                anchorY="middle"
                color="#e0d0ff"
                outlineColor="#e0d0ff"
                outlineBlur={0.06}
                outlineOpacity={0.6}
            >
                an Elliot Khan project
            </Text>
        </group>
    );
}

function FallingCassette({ startPosition, startRotation }) {
    const { scene } = useGLTF('/models/cassette-tape.glb');
    const rbRef = useRef();
    const isDragging = useRef(false);
    const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const { camera, gl } = useThree();

    const model = useMemo(() => buildCassetteModel(scene), [scene]);

    useEffect(() => {
        const onUp = () => {
            if (!isDragging.current || !rbRef.current) return;
            isDragging.current = false;
            rbRef.current.setBodyType(0, true); // Dynamic
            // Scale down the throw velocity so cassettes feel heavy, not floaty
            const v = rbRef.current.linvel();
            rbRef.current.setLinvel({ x: v.x * 0.5, y: v.y * 0.2, z: 0 }, true);
            rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        };
        window.addEventListener('pointerup', onUp);
        return () => window.removeEventListener('pointerup', onUp);
    }, []);

    useFrame(({ pointer }) => {
        if (!isDragging.current || !rbRef.current) return;
        raycaster.setFromCamera(pointer, camera);
        const target = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(dragPlane.current, target)) {
            rbRef.current.setNextKinematicTranslation(target);
        }
    });

    function handlePointerDown(e) {
        e.stopPropagation();
        if (!rbRef.current) return;
        isDragging.current = true;
        const pos = rbRef.current.translation();
        dragPlane.current.constant = -pos.z;
        rbRef.current.setBodyType(2, true); // KinematicPositionBased
        gl.domElement.setPointerCapture(e.nativeEvent.pointerId);
    }

    return (
        <RigidBody
            ref={rbRef}
            position={startPosition}
            rotation={startRotation}
            colliders={false}
            restitution={0.2}
            friction={0.9}
            linearDamping={0.8}
            angularDamping={0.6}
        >
            <CuboidCollider args={COLLIDER_HALF} />
            <group onPointerDown={handlePointerDown}>
                <primitive object={model} />
            </group>
        </RigidBody>
    );
}

useGLTF.preload('/models/cassette-tape.glb');

// useThree-aware wrapper so walls/floor are positioned relative to the real viewport size.
// This makes the layout correct on both desktop and mobile without hardcoding pixel values.
function PhysicsScene() {
    const { viewport } = useThree();
    const hw = viewport.width / 2;
    const hh = viewport.height / 2;

    // Generate spawn positions once on mount based on the current viewport
    const cassettes = useRef(null);
    if (!cassettes.current) {
        cassettes.current = Array.from({ length: CASSETTE_COUNT }, (_, i) => ({
            startPosition: [
                (Math.random() - 0.5) * viewport.width * 0.8,
                hh + 2 + i * 3.5,
                (Math.random() - 0.5) * 1.5,
            ],
            startRotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
            ],
        }));
    }

    return (
        <Physics gravity={[0, -9.81, 0]}>
            {/* Floor sits right at the bottom edge of the viewport */}
            <RigidBody type="fixed" position={[0, -hh, 0]}>
                <CuboidCollider args={[hw * 3, 0.5, 10]} />
            </RigidBody>
            {/* Side walls just outside the viewport edges */}
            <RigidBody type="fixed" position={[-(hw + 1), 0, 0]}>
                <CuboidCollider args={[0.5, hh * 4, 10]} />
            </RigidBody>
            <RigidBody type="fixed" position={[hw + 1, 0, 0]}>
                <CuboidCollider args={[0.5, hh * 4, 10]} />
            </RigidBody>
            {cassettes.current.map((props, i) => (
                <FallingCassette key={i} {...props} />
            ))}
        </Physics>
    );
}

export default function CassetteProject() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useGSAP(() => {
        gsap.set(['html', 'body'], { backgroundColor: '#1A1423' });
    });

    return (
        <div className="relative text-slate-100 min-h-[100vh]">
            <DitherGradientBackground palette={0} overlay="rgba(0,0,0,0.4)" />

            {/* Physics canvas — fixed full-viewport, sits behind all content.
                pan-y allows the page to scroll vertically on mobile while still
                letting horizontal/diagonal cassette drags work. */}
            {mounted && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1, touchAction: 'pan-y' }}>
                    <Canvas style={{ touchAction: 'pan-y' }} camera={{ position: [0, 0, 15], fov: 50 }}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[4, 10, 5]} intensity={1.2} />
                        <Suspense fallback={null}>
                            <PhysicsScene />
                        </Suspense>
                    </Canvas>
                </div>
            )}

            {/* Content — pointer-events-none passes drag clicks through to the canvas */}
            <div className="relative z-10 pointer-events-none">
                <h1 className="text-6xl md:text-8xl text-center pt-16 font-gladiola text-slate-100 text-shadow-md text-shadow-[#8080D5]">
                    Cassette Project
                </h1>
                <div className="pointer-events-auto" style={{ width: '100%', height: '420px' }}>
                    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                        <ambientLight intensity={0.55} />
                        <directionalLight position={[4, 6, 5]} intensity={1.1} />
                        <Suspense fallback={null}>
                            <WireframeCassette />
                        </Suspense>
                        <OrbitControls enableZoom={false} enablePan={false} />
                    </Canvas>
                </div>
                <h2 className="text-4xl md:text-5xl text-slate-100 text-center mt-8 font-gladiola">How It Works:</h2>
                <div className="flex flex-col md:flex-row justify-center text-center font-lexend text-xl pt-8 pb-72 md:pb-8 gap-8 md:gap-4">
                    <div className="p-6 md:p-6 md:basis-md border-1 border-white shadow-xl shadow-white">
                        <h6 className="pb-2">1</h6>
                        <h5>Members have cassette players</h5>
                    </div>
                    <div className="p-6 md:p-6 md:basis-md pointer-events-auto border-1 border-white shadow-xl shadow-white">
                        <h6 className="pb-2">2</h6>
                        <h5 className="">Members record personal audio tapes</h5>
                    </div>
                    <div className="p-6 md:p-6 md:basis-md border-1 border-white shadow-xl shadow-white">
                        <h6 className="pb-2">3</h6>
                        <h5>Members lend tapes to each other from their personal lending libraries</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}
