'use client';

import React, { useEffect } from 'react';

interface Props {
	speedFactor?: number;
	backgroundColor?: string;
	starColor?: [number, number, number];
	starCount?: number;
	warpSpeedFactor?: number; // speed while pressed; defaults to speedFactor * 4
	warpOnPress?: boolean; // enable warp-on-press; defaults to true
}

export default function Starfield(props: Props) {
	const {
		speedFactor = 0.05,
		backgroundColor = 'black',
		starColor = [255, 255, 255],
		starCount = 5000,
		warpSpeedFactor,
		warpOnPress = true,
	} = props;

	useEffect(() => {
		let animationFrameId: number;
		let handleResize: () => void = () => {};
		let press: () => void = () => {};
		let release: () => void = () => {};
		const canvas = document.getElementById('starfield') as HTMLCanvasElement;

		if (canvas) {
			const c = canvas.getContext('2d');

			if (c) {
				let w = window.innerWidth;
				let h = window.innerHeight;

				const setCanvasExtents = () => {
					canvas.width = w;
					canvas.height = h;
				};

				setCanvasExtents();

				handleResize = () => {
					w = window.innerWidth;
					h = window.innerHeight;
					setCanvasExtents();
				};

				const makeStars = (count: number) => {
					const out = [];
					for (let i = 0; i < count; i++) {
						const s = {
							x: Math.random() * 1600 - 800,
							y: Math.random() * 900 - 450,
							z: Math.random() * 1000,
						};
						out.push(s);
					}
					return out;
				};

				let stars = makeStars(starCount);

				const baseSpeed = speedFactor;
				const warpSpeed = warpSpeedFactor ?? speedFactor * 4;
				let targetSpeed = baseSpeed;
				let liveSpeed = baseSpeed;

				press = () => {
					if (warpOnPress) targetSpeed = warpSpeed;
				};
				release = () => {
					targetSpeed = baseSpeed;
				};

				const clear = () => {
					c.fillStyle = backgroundColor;
					c.fillRect(0, 0, canvas.width, canvas.height);
				};

				const putStar = (x: number, y: number, brightness: number, radius: number) => {
					const alpha = Math.min(1, brightness);
					c.fillStyle =
						'rgba(' + starColor[0] + ',' + starColor[1] + ',' + starColor[2] + ',' + alpha + ')';
					c.beginPath();
					c.arc(x, y, radius, 0, Math.PI * 2);
					c.fill();
				};

				const moveStars = (distance: number) => {
					const count = stars.length;
					for (var i = 0; i < count; i++) {
						const s = stars[i];
						s.z -= distance;
						while (s.z <= 1) {
							s.z += 1000;
						}
					}
				};

				let prevTime: number;
				const init = (time: number) => {
					prevTime = time;
					animationFrameId = requestAnimationFrame(tick);
				};

				const tick = (time: number) => {
					let elapsed = time - prevTime;
					prevTime = time;

					const k = 1 - Math.pow(0.0001, elapsed / 1000); // smooth, fps-independent
					liveSpeed += (targetSpeed - liveSpeed) * k;
					moveStars(elapsed * liveSpeed);

					clear();

					const cx = w / 2;
					const cy = h / 2;

					const count = stars.length;
					for (var i = 0; i < count; i++) {
						const star = stars[i];

						const x = cx + star.x / (star.z * 0.001);
						const y = cy + star.y / (star.z * 0.001);

						if (x < 0 || x >= w || y < 0 || y >= h) {
							continue;
						}

						const d = star.z / 1000.0;
						const b = Math.min(1, Math.max(0.25, Math.pow(1 - d, 0.65) * 1.25));
						const radius = 0.5 + (1 - d) * 1.5;

						putStar(x, y, b, radius);
					}

					animationFrameId = requestAnimationFrame(tick);
				};

				animationFrameId = requestAnimationFrame(init);

				// add window resize listener:
				window.addEventListener('resize', handleResize);

				// warp-on-press: speed up while the pointer/finger is held down
				window.addEventListener('mousedown', press);
				window.addEventListener('mouseup', release);
				window.addEventListener('touchstart', press, { passive: true });
				window.addEventListener('touchend', release);
				window.addEventListener('touchcancel', release);
			} else {
				console.error('Could not get 2d context from canvas element');
			}
		} else {
			console.error('Could not find canvas element with id "starfield"');
		}

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousedown', press);
			window.removeEventListener('mouseup', release);
			window.removeEventListener('touchstart', press);
			window.removeEventListener('touchend', release);
			window.removeEventListener('touchcancel', release);
		};
	}, [starColor, backgroundColor, speedFactor, starCount, warpSpeedFactor, warpOnPress]);

	return (
		<canvas
			id="starfield"
			style={{
				padding: 0,
				margin: 0,
				position: 'fixed',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				zIndex: 0,
				opacity: 1,
				pointerEvents: 'none',
				mixBlendMode: 'screen',
			}}
		></canvas>
	);
}