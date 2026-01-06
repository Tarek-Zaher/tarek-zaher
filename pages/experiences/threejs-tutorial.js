import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export default function ThreeJSTutorial() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);

        const gltfLoader = new GLTFLoader();
        const url = '/models/cubic-shopping-cart/source/model.gltf';

        let controls = null;
        let animationId = null;
        const keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };

        // Handle keydown
        const handleKeyDown = (event) => {
            if (keys.hasOwnProperty(event.key)) {
                keys[event.key] = true;
                event.preventDefault();
            }
        };

        // Handle keyup
        const handleKeyUp = (event) => {
            if (keys.hasOwnProperty(event.key)) {
                keys[event.key] = false;
                event.preventDefault();
            }
        };

        gltfLoader.load(
            url,
            (gltf) => {
                const cart = gltf.scene;
                scene.add(cart);

                const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

                let xCubes = 0;
                let zCubes = 0;

                while (xCubes < 10) {
                    createXCube(cubeGeometry, 0x3F8E81, xCubes);
                    xCubes++;
                }

                while (zCubes < 10) {
                    createZCube(cubeGeometry, 0x3F8E81, zCubes);
                    zCubes++;
                }

                function createXCube(cubeGeometry, color, x) {
                    const material = new THREE.MeshBasicMaterial({ color: 0x4F6F86 });
                    const cube = new THREE.Mesh(cubeGeometry, material);
                    cube.position.x = x;
                    scene.add(cube);
                }

                function createZCube(cubeGeometry, color, z) {
                    const material = new THREE.MeshBasicMaterial({ color: 0x4F6F86 });
                    const cube = new THREE.Mesh(cubeGeometry, material);
                    cube.position.z = z;
                    scene.add(cube);
                }

                // Add sphere at origin
                const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.set(0, 1, 0);
                scene.add(sphere);

                camera.position.z = 45;
                camera.position.y = 25;

                // Enable orbital controls
                controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true; // Smooth camera movement
                controls.dampingFactor = 0.05;
                controls.target.copy(sphere.position); // Look at the sphere

                // Add event listeners
                window.addEventListener('keydown', handleKeyDown);
                window.addEventListener('keyup', handleKeyUp);

                // Camera movement speed
                const moveSpeed = 0.2;

                function animate() {
                    // Move sphere based on arrow keys
                    if (keys.ArrowUp) {
                        cart.position.z -= moveSpeed;
                    }
                    if (keys.ArrowDown) {
                        cart.position.z += moveSpeed;
                    }
                    if (keys.ArrowLeft) {
                        cart.position.x -= moveSpeed;
                    }
                    if (keys.ArrowRight) {
                        cart.position.x += moveSpeed;
                    }

                    // Make camera look at the sphere
                    controls.target.copy(sphere.position);

                    // Update controls (required for damping to work)
                    controls.update();

                    renderer.render(scene, camera);
                }
                renderer.setAnimationLoop(animate);
            },
            undefined,
            (error) => {
                console.error('Error loading GLTF model:', error);
            }
        );

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (controls) {
                controls.dispose();
            }
            renderer.setAnimationLoop(null);
            renderer.dispose();
            if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}