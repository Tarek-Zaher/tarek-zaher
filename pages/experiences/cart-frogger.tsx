'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { useCallback, useEffect, useRef, useState } from 'react'

const TILE = 2.5
const speed = 1

type Move = { dx: number; dz: number }
type LaneType = 'grass' | 'road'

function keyToMove(key: string): Move | null {
	if (key === 'ArrowUp' || key === 'w' || key === 'W') return { dx: 0, dz: speed }
	if (key === 'ArrowDown' || key === 's' || key === 'S') return { dx: 0, dz: -speed }
	if (key === 'ArrowLeft' || key === 'a' || key === 'A') return { dx: speed, dz: 0 }
	if (key === 'ArrowRight' || key === 'd' || key === 'D') return { dx: -speed, dz: 0 }
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
		if (dx > 0) return { dx: -speed, dz: 0 } 
		else return { dx: speed, dz: 0 } 
	} else {
		// Vertical swipe
		if (dy < 0) return { dx: 0, dz: speed } 
		else return { dx: 0, dz: -speed } 
	}
}

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n))
}

function Lane({ 
	z, 
	width, 
	type 
}: { 
	z: number
	width: number
	type: LaneType 
}) {
	const materialProps = 
		type === 'grass'
			? { color: '#4a7c3e', roughness: 0.95 }
			: { color: '#2a2a2a', roughness: 0.3 }

	const tiles: Array<[number, number, number]> = []
	for (let x = -width; x <= width; x++) {
		tiles.push([x * TILE, -0.1, z * TILE])
	}

	return (
		<group>
			{tiles.map((p, i) => (
				<mesh key={i} position={p} receiveShadow>
					<boxGeometry args={[2.5, 0.2, 2.5]} />
					<meshStandardMaterial {...materialProps} />
				</mesh>
			))}
		</group>
	)
}

function Terrain({ width, lanes }: { width: number; lanes: LaneType[] }) {
	return (
		<group>
			{lanes.map((type, index) => (
				<Lane 
					key={index} 
					z={index - 2} 
					width={width} 
					type={type} 
				/>
			))}
		</group>
	)
}

function VoxelCoupon({ position, spinning = true, rotationX = 0 }: { position: [number, number, number]; spinning?: boolean; rotationX?: number }) {
	const ref = useRef<THREE.Mesh | null>(null)
	const materialRef = useRef<THREE.MeshStandardMaterial | null>(null)

	useFrame((_, dt) => {
		if (!ref.current) return
		ref.current.rotation.x = rotationX
		if (spinning) {
			ref.current.rotation.y += dt * 1.2
		}
		
		// Animate the shine/glow
		if (materialRef.current) {
			const glow = 0.3 + Math.sin(Date.now() * 0.003) * 0.2
			materialRef.current.emissiveIntensity = glow
		}
	})

	return (
		<mesh ref={ref} position={position} castShadow>
			<boxGeometry args={[0.9, 0.45, 0.08]} />
			<meshStandardMaterial 
				ref={materialRef}
				color="#FFD700"
				metalness={0.8}
				roughness={0.2}
				emissive="#FFA500"
				emissiveIntensity={0.3}
			/>
		</mesh>
	)
}

function CollectingCoupon({ 
	startPos, 
	endPos, 
	onComplete 
}: { 
	startPos: [number, number, number]
	endPos: [number, number, number]
	onComplete: () => void
}) {
	const ref = useRef<THREE.Mesh | null>(null)
	const materialRef = useRef<THREE.MeshStandardMaterial | null>(null)
	const [position, setPosition] = useState<[number, number, number]>(startPos)

	useEffect(() => {
		if (!ref.current) return

		const proxy = { 
			x: startPos[0], 
			y: startPos[1], 
			z: startPos[2],
			scale: 1,
			rotation: 0
		}

		const animation = gsap.to(proxy, {
			duration: 0.4,
			x: endPos[0],
			y: endPos[1],
			z: endPos[2],
			scale: 0.5,
			rotation: Math.PI * 2,
			ease: 'power2.in',
			onUpdate: () => {
				// Add bounce effect with higher arc
				const t = animation.progress()
				const arcHeight = 2.5 // Height of the bounce arc
				const bounceY = arcHeight * Math.sin(t * Math.PI)
				
				// Use interpolated x and z from proxy, add bounce arc to y
				setPosition([
					proxy.x,
					startPos[1] + bounceY,
					proxy.z
				])
				
				if (ref.current) {
					ref.current.scale.setScalar(proxy.scale)
					ref.current.rotation.y = proxy.rotation
				}
			},
			onComplete: () => {
				onComplete()
			},
		})

		return () => {
			animation.kill()
		}
	}, [startPos, endPos])

	useFrame((_, dt) => {
		if (materialRef.current) {
			const glow = 0.3 + Math.sin(Date.now() * 0.003) * 0.2
			materialRef.current.emissiveIntensity = glow
		}
	})

	return (
		<mesh ref={ref} position={position} castShadow>
			<boxGeometry args={[0.9, 0.45, 0.08]} />
			<meshStandardMaterial 
				ref={materialRef}
				color="#FFD700"
				metalness={0.8}
				roughness={0.2}
				emissive="#FFA500"
				emissiveIntensity={0.3}
			/>
		</mesh>
	)
}

function VoxelCart({ position, rotation }: { position: [number, number, number]; rotation: number }) {
	const gltf = useGLTF('/models/cubic-shopping-cart/source/model.gltf')

	return (
		<primitive
			object={gltf.scene}
			position={position}
			rotation={[0, rotation, 0]}
			scale={0.1}
			castShadow
		/>
	)
}

function Scene({ onCouponCollected }: { onCouponCollected: () => void }) {

	const cartGrid = useRef({ x: 0, z: -2 })
	const [cartPos, setCartPos] = useState<[number, number, number]>([0, 0.25, -2 * TILE])
	const [cartRotation, setCartRotation] = useState<number>(Math.PI)
	const [collectedCoupons, setCollectedCoupons] = useState<number>(0)
	const [collectingCoupon, setCollectingCoupon] = useState<{
		startPos: [number, number, number]
		endPos: [number, number, number]
	} | null>(null)
	const movingRef = useRef(false)
	const moveQueueRef = useRef<Move | null>(null)
	const animationRef = useRef<gsap.core.Tween | null>(null)
	const rotationAnimationRef = useRef<gsap.core.Tween | null>(null)
	const currentRotationRef = useRef<number>(Math.PI)
	const touchStartRef = useRef<{ x: number; y: number; time: number; hasMoved: boolean } | null>(null)
	const { camera } = useThree()
	const lookAtRef = useRef(new THREE.Vector3(0, 0, 4))

	const lanes: LaneType[] = [
		'grass',
		'grass',
		'road',
		'road',
		'road',
		'grass',
		'road',
		'road',
		'road',
		'grass',
		'road',
		'road',
		'road',
		'grass',
		'grass',
		'grass',
		'grass',
	]

	const [goalGrid, setGoalGrid] = useState({ x: 0, z: 12 })
	const goalGridRef = useRef({ x: 0, z: 12 })

	// Keep ref in sync with state
	useEffect(() => {
		goalGridRef.current = goalGrid
	}, [goalGrid])

	function setCartGrid(x: number, z: number) {
		cartGrid.current.x = x
		cartGrid.current.z = z
		setCartPos([x * TILE, 0.25, z * TILE])
	}

	const maxZ = lanes.length - 3 // -2 offset + length
	const bounds = useRef({ minX: -6, maxX: 6, minZ: -2, maxZ })

	const spawnNewCoupon = useCallback(() => {
		// Generate random position within bounds
		// Try up to 50 times to avoid spawning on cart position
		for (let i = 0; i < 50; i++) {
			const x = Math.floor(Math.random() * (bounds.current.maxX - bounds.current.minX + 1)) + bounds.current.minX
			const z = Math.floor(Math.random() * (bounds.current.maxZ - bounds.current.minZ + 1)) + bounds.current.minZ
			
			// Don't spawn on the cart's current position
			if (x !== cartGrid.current.x || z !== cartGrid.current.z) {
				goalGridRef.current = { x, z }
				setGoalGrid({ x, z })
				return
			}
		}
		// Fallback: just use a random position even if it might be on the cart
		const x = Math.floor(Math.random() * (bounds.current.maxX - bounds.current.minX + 1)) + bounds.current.minX
		const z = Math.floor(Math.random() * (bounds.current.maxZ - bounds.current.minZ + 1)) + bounds.current.minZ
		goalGridRef.current = { x, z }
		setGoalGrid({ x, z })
	}, [])

	const tryMove = useCallback(({ dx, dz }: Move) => {
		// If already moving, queue this move
		if (movingRef.current) {
			moveQueueRef.current = { dx, dz }
			return
		}

		const nx = clamp(cartGrid.current.x + dx, bounds.current.minX, bounds.current.maxX)
		const nz = clamp(cartGrid.current.z + dz, bounds.current.minZ, bounds.current.maxZ)

		if (nx === cartGrid.current.x && nz === cartGrid.current.z) return

		// Calculate rotation based on movement direction
		let targetRotation = 0
		if (dz < 0) targetRotation = 0 // Moving up
		else if (dz > 0) targetRotation = Math.PI // Moving down
		else if (dx > 0) targetRotation = -Math.PI / 2 // Moving right 
		else if (dx < 0) targetRotation = Math.PI / 2 // Moving left 

		movingRef.current = true
		cartGrid.current.x = nx
		cartGrid.current.z = nz

		const x = nx * TILE
		const z = nz * TILE
		const y0 = 0.25

		// Animate rotation - use shortest path
		const startRotation = currentRotationRef.current
		let diff = targetRotation - startRotation
		// Normalize to shortest path (-PI to PI)
		while (diff > Math.PI) diff -= 2 * Math.PI
		while (diff < -Math.PI) diff += 2 * Math.PI
		const newRotation = startRotation + diff
		
		const rotationProxy = { r: startRotation }
		rotationAnimationRef.current?.kill()
		rotationAnimationRef.current = gsap.to(rotationProxy, {
			duration: 0.1,
			r: newRotation,
			ease: 'power2.out',
			onUpdate: () => {
				currentRotationRef.current = rotationProxy.r
				setCartRotation(rotationProxy.r)
			},
			onComplete: () => {
				currentRotationRef.current = newRotation
				setCartRotation(newRotation)
			},
		})

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
				
				// Check for collision with coupon
				if (cartGrid.current.x === goalGridRef.current.x && 
					cartGrid.current.z === goalGridRef.current.z) {
					// Start collection animation
					const couponPos: [number, number, number] = [
						goalGridRef.current.x * TILE,
						0.35,
						goalGridRef.current.z * TILE,
					]
					// Use the final cart position (x, y0, z are the destination)
					const cartPosition: [number, number, number] = [x, y0 + 0.3, z]
					
					setCollectingCoupon({
						startPos: couponPos,
						endPos: cartPosition,
					})
					
					spawnNewCoupon()
					onCouponCollected()
					console.log('Coupon collected!')
				}
				
				// Process queued move if there is one
				if (moveQueueRef.current) {
					const queuedMove = moveQueueRef.current
					moveQueueRef.current = null
					// Small delay to ensure state is updated
					setTimeout(() => tryMove(queuedMove), 0)
				}
			},
		})
	}, [spawnNewCoupon, onCouponCollected])

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
				touchStartRef.current = { 
					x: touch.clientX, 
					y: touch.clientY,
					time: Date.now(),
					hasMoved: false
				}
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
				const touchDuration = Date.now() - touchStartRef.current.time
				const distance = Math.sqrt(dx * dx + dy * dy)
				
				// Tap detection: quick touch (< 300ms) with minimal movement (< 10px)
				const isTap = !touchStartRef.current.hasMoved && 
				              touchDuration < 300 && 
				              distance < 10

				if (isTap) {
					// Tap: move forward
					e.preventDefault()
					tryMove({ dx: 0, dz: speed })
				} else {
					// Swipe: use existing swipe logic
					const m = swipeToMove(dx, dy)
					if (m) {
						e.preventDefault()
						tryMove(m)
					}
				}
			}

			touchStartRef.current = null
		}

		const onTouchMove = (e: TouchEvent) => {
			// Always prevent scrolling during swipe gestures
			if (touchStartRef.current && e.touches.length === 1) {
				e.preventDefault()
				// Mark that movement occurred
				if (!touchStartRef.current.hasMoved) {
					const touch = e.touches[0]
					const dx = touch.clientX - touchStartRef.current.x
					const dy = touch.clientY - touchStartRef.current.y
					const distance = Math.sqrt(dx * dx + dy * dy)
					// If moved more than 5px, it's not a tap
					if (distance > 5) {
						touchStartRef.current.hasMoved = true
					}
				}
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

		setCartGrid(0, -2)
	}, [camera])

	useFrame(() => {
		if (!camera) return

		const desiredLook = new THREE.Vector3(cartPos[0], 0.5, cartPos[2] + 4)
		lookAtRef.current.lerp(desiredLook, 0.08)

		const desiredCamPos = new THREE.Vector3(cartPos[0] - 4, 12, cartPos[2] - 16)
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

			<Terrain width={6} lanes={lanes} />

			<VoxelCart position={cartPos} rotation={cartRotation} />

			{/* Collected coupons stacked in cart */}
			{Array.from({ length: collectedCoupons }).map((_, i) => (
				<VoxelCoupon
					key={`collected-${i}`}
					position={[
						cartPos[0],
						1 + (i * 0.1),
						cartPos[2],
					]}
					spinning={false}
					rotationX={Math.PI / 2}
				/>
			))}

			{/* Collecting coupon animation */}
			{collectingCoupon && (
				<CollectingCoupon
					startPos={collectingCoupon.startPos}
					endPos={collectingCoupon.endPos}
					onComplete={() => {
						setCollectingCoupon(null)
						setCollectedCoupons(prev => prev + 1)
					}}
				/>
			)}

			{/* Current coupon on ground */}
			{!collectingCoupon && (
				<VoxelCoupon
					position={[
						goalGrid.x * TILE,
						0.35,
						goalGrid.z * TILE,
					]}
				/>
			)}
		</>
	)
}

export default function GamePage() {
	const [score, setScore] = useState(0)

	const handleCouponCollected = () => {
		setScore(prev => prev + 1)
	}

	return (
		<div style={{ width: '100vw', height: '100vh', touchAction: 'none', position: 'relative' }}>
			<div style={{
				position: 'absolute',
				top: '20px',
				left: '20px',
				zIndex: 100,
				color: 'white',
				fontSize: '24px',
				fontWeight: 'bold',
				textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
				fontFamily: 'Arial, sans-serif'
			}}>
				<div>DISCOUNT: {score}%</div>
			</div>
			<Canvas shadows dpr={[1, 2]}>
				<Scene onCouponCollected={handleCouponCollected} />
			</Canvas>
		</div>
	)
}
