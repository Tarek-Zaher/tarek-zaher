'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGLTF } from '@react-three/drei'


const TILE = 1

type Move = { dx: number; dz: number }

function keyToMove(key: string): Move | null {
	if (key === 'ArrowUp' || key === 'w' || key === 'W') return { dx: 0, dz: 2 }
	if (key === 'ArrowDown' || key === 's' || key === 'S') return { dx: 0, dz: -2 }
	if (key === 'ArrowLeft' || key === 'a' || key === 'A') return { dx: 2, dz: 0 }
	if (key === 'ArrowRight' || key === 'd' || key === 'D') return { dx: -2, dz: 0 }
	return null
}

function swipeToMove(dx: number, dy: number, threshold: number = 30): Move | null {
	// Check if swipe is significant enough
	if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
		return null
	}

	// Determine primary direction
	if (Math.abs(dx) > Math.abs(dy)) {
		// Horizontal swipe
		if (dx > 0) return { dx: -2, dz: 0 } // Swipe right = move right
		else return { dx: 2, dz: 0 } // Swipe left = move left
	} else {
		// Vertical swipe
		if (dy < 0) return { dx: 0, dz: 2 } // Swipe up = move forward
		else return { dx: 0, dz: -2 } // Swipe down = move backward
	}
}

function Tiles({ width, depth }: { width: number; depth: number }) {
	const tiles = useMemo(() => {
		const out: Array<[number, number, number]> = []
		for (let z = -2; z <= depth; z++) {
			for (let x = -width; x <= width; x++) {
				out.push([x * TILE, -0.1, z * TILE])
			}
		}
		return out
	}, [width, depth])

	return (
		<group>
			{tiles.map((p, i) => (
				<mesh key={i} position={p} receiveShadow>
					<boxGeometry args={[1, 0.2, 1]} />
					<meshStandardMaterial roughness={0.95} />
				</mesh>
			))}
		</group>
	)
}

function VoxelCoupon({ position }: { position: [number, number, number] }) {
	const ref = useRef<THREE.Mesh | null>(null)

	useFrame((_, dt) => {
		if (!ref.current) return
		ref.current.rotation.y += dt * 1.2
	})

	return (
		<mesh ref={ref} position={position} castShadow>
			<boxGeometry args={[0.9, 0.45, 0.08]} />
			<meshStandardMaterial roughness={0.35} metalness={0.05} />
		</mesh>
	)
}

function VoxelCart({ position }: { position: [number, number, number] }) {
	const gltf = useGLTF('/models/cubic-shopping-cart/source/model.gltf')

	return (
		<primitive
			object={gltf.scene}
			position={position}
			rotation={[0, Math.PI, 0]}
			scale={0.1}
			castShadow
		/>
	)
}

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n))
}

function Scene() {
	const bounds = useRef({ minX: -6, maxX: 6, minZ: -2, maxZ: 14 })

	const cartGrid = useRef({ x: 0, z: 0 })
	const [cartPos, setCartPos] = useState<[number, number, number]>([0, 0.25, 0])
	const movingRef = useRef(false)
	const moveQueueRef = useRef<Move | null>(null)
	const animationRef = useRef<gsap.core.Tween | null>(null)
	const touchStartRef = useRef<{ x: number; y: number } | null>(null)

	const { camera } = useThree()
	const lookAtRef = useRef(new THREE.Vector3(0, 0, 4))

	const goalGrid = useRef({ x: 0, z: 12 })

	function setCartGrid(x: number, z: number) {
		cartGrid.current.x = x
		cartGrid.current.z = z
		setCartPos([x * TILE, 0.25, z * TILE])
	}

	const tryMove = useCallback(({ dx, dz }: Move) => {
		// If already moving, queue this move
		if (movingRef.current) {
			moveQueueRef.current = { dx, dz }
			return
		}

		const nx = clamp(cartGrid.current.x + dx, bounds.current.minX, bounds.current.maxX)
		const nz = clamp(cartGrid.current.z + dz, bounds.current.minZ, bounds.current.maxZ)

		if (nx === cartGrid.current.x && nz === cartGrid.current.z) return

		movingRef.current = true
		cartGrid.current.x = nx
		cartGrid.current.z = nz

		const x = nx * TILE
		const z = nz * TILE
		const y0 = 0.25

		const proxy = { t: 0 }
		animationRef.current = gsap.to(proxy, {
			duration: 0.15,
			t: 1,
			ease: 'power2.out',
			onUpdate: () => {
				const hop = Math.sin(Math.PI * proxy.t) * 0.22
				setCartPos([x, y0 + hop, z])
			},
			onComplete: () => {
				setCartPos([x, y0, z])
				movingRef.current = false
				
				// Process queued move if there is one
				if (moveQueueRef.current) {
					const queuedMove = moveQueueRef.current
					moveQueueRef.current = null
					// Small delay to ensure state is updated
					setTimeout(() => tryMove(queuedMove), 0)
				}
			},
		})
	}, [])

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			const m = keyToMove(e.key)
			if (m) {
				e.preventDefault()
				tryMove(m)
			}
		}
		window.addEventListener('keydown', onKeyDown, { passive: false } as any)
		return () => window.removeEventListener('keydown', onKeyDown as any)
	}, [tryMove])

	useEffect(() => {
		const onTouchStart = (e: TouchEvent) => {
			if (e.touches.length === 1) {
				const touch = e.touches[0]
				touchStartRef.current = { x: touch.clientX, y: touch.clientY }
				// Prevent default to stop scrolling
				e.preventDefault()
			}
		}

		const onTouchEnd = (e: TouchEvent) => {
			if (!touchStartRef.current) return

			if (e.changedTouches.length === 1) {
				const touch = e.changedTouches[0]
				const dx = touch.clientX - touchStartRef.current.x
				const dy = touch.clientY - touchStartRef.current.y

				const m = swipeToMove(dx, dy)
				if (m) {
					e.preventDefault()
					tryMove(m)
				}
			}

			touchStartRef.current = null
		}

		const onTouchMove = (e: TouchEvent) => {
			// Always prevent scrolling during swipe gestures
			if (touchStartRef.current && e.touches.length === 1) {
				e.preventDefault()
			}
		}

		window.addEventListener('touchstart', onTouchStart, { passive: false } as any)
		window.addEventListener('touchmove', onTouchMove, { passive: false } as any)
		window.addEventListener('touchend', onTouchEnd, { passive: false } as any)

		return () => {
			window.removeEventListener('touchstart', onTouchStart as any)
			window.removeEventListener('touchmove', onTouchMove as any)
			window.removeEventListener('touchend', onTouchEnd as any)
		}
	}, [tryMove])

	useEffect(() => {
		if (!camera) return

		camera.position.set(4, 12, -10)
		lookAtRef.current.set(0, 0, 4)
		camera.lookAt(lookAtRef.current)

		setCartGrid(0, 0)
	}, [camera])

	useFrame(() => {
		if (!camera) return

		// Crossy Road style: camera behind and above, looking ahead, angled to the right
		const desiredLook = new THREE.Vector3(cartPos[0], 0.5, cartPos[2] + 3)
		lookAtRef.current.lerp(desiredLook, 0.08)

		const desiredCamPos = new THREE.Vector3(cartPos[0] - 4, 12, cartPos[2] - 10)
		camera.position.lerp(desiredCamPos, 0.06)
		camera.lookAt(lookAtRef.current)
	})

	useEffect(() => {
		if (!camera || camera.type !== 'PerspectiveCamera') return
		const perspCam = camera as THREE.PerspectiveCamera
		perspCam.fov = 50
		perspCam.near = 0.1
		perspCam.far = 200
		perspCam.updateProjectionMatrix()
	}, [camera])

	return (
		<>
			<ambientLight intensity={0.6} />
			<directionalLight position={[6, 10, 6]} intensity={1.5} castShadow />

			<Environment preset="city" />

			<Tiles width={6} depth={14} />

			<VoxelCart position={cartPos} />

			<VoxelCoupon
				position={[
					goalGrid.current.x * TILE,
					0.35,
					goalGrid.current.z * TILE,
				]}
			/>
		</>
	)
}

export default function GamePage() {
	return (
		<div style={{ width: '100vw', height: '100vh', touchAction: 'none' }}>
			<Canvas shadows dpr={[1, 2]}>
				<Scene />
			</Canvas>
		</div>
	)
}
