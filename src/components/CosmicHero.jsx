/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const CosmicParticles = () => {
	const containerRef = useRef(null);
	const sceneRef = useRef(null);
	const cameraRef = useRef(null);
	const rendererRef = useRef(null);
	const particlesRef = useRef(null);
	const starsRef = useRef(null);
	const composerRef = useRef(null);
	const clockRef = useRef(new THREE.Clock());
	const animationIdRef = useRef(null);

	const timeRef = useRef(0);
	const currentPatternRef = useRef(0);
	const transitionProgressRef = useRef(0);
	const isTransitioningRef = useRef(false);
	const screenMouseRef = useRef(new THREE.Vector2(10000, 10000));
	const worldMouseRef = useRef(new THREE.Vector3());
	const lastWorldMouseRef = useRef(new THREE.Vector3());
	const patternNameRef = useRef(null);

	const particleCount = 25000;
	const starCount = 6000;
	const transitionSpeed = 0.015;
	const patternNames = [
		"Cosmic Sphere",
		"Spiral Nebula",
		"Quantum Helix",
		"Stardust Grid",
		"Celestial Torus",
	];

	// Pattern creation functions
	const createSphere = useCallback((i, count) => {
		const t = i / count;
		const phi = Math.acos(2 * t - 1);
		const theta = 2 * Math.PI * (i / count) * Math.sqrt(count);
		return new THREE.Vector3(
			Math.sin(phi) * Math.cos(theta) * 40,
			Math.sin(phi) * Math.sin(theta) * 40,
			Math.cos(phi) * 40
		);
	}, []);

	const createSpiral = useCallback((i, count) => {
		const t = i / count;
		const numArms = 3;
		const armIndex = i % numArms;
		const angleOffset = ((2 * Math.PI) / numArms) * armIndex;
		const angle = Math.pow(t, 0.7) * 15 + angleOffset;
		const radius = t * 55;
		const height = Math.sin(t * Math.PI * 2) * 5;
		return new THREE.Vector3(
			Math.cos(angle) * radius,
			Math.sin(angle) * radius,
			height
		);
	}, []);

	const createGrid = useCallback((i, count) => {
		const sideLength = Math.ceil(Math.cbrt(count));
		const spacing = 80 / sideLength;
		const halfGrid = ((sideLength - 1) * spacing) / 2;
		const iz = Math.floor(i / (sideLength * sideLength));
		const iy = Math.floor((i % (sideLength * sideLength)) / sideLength);
		const ix = i % sideLength;

		if (
			ix === Math.floor(sideLength / 2) &&
			iy === Math.floor(sideLength / 2) &&
			iz === Math.floor(sideLength / 2) &&
			sideLength % 2 !== 0
		) {
			return new THREE.Vector3(spacing * 0.1, spacing * 0.1, spacing * 0.1);
		}

		return new THREE.Vector3(
			ix * spacing - halfGrid,
			iy * spacing - halfGrid,
			iz * spacing - halfGrid
		);
	}, []);

	const createHelix = useCallback((i, count) => {
		const numHelices = 2;
		const helixIndex = i % numHelices;
		const t = Math.floor(i / numHelices) / Math.floor(count / numHelices);
		const angle = t * Math.PI * 10;
		const radius = 20;
		const height = (t - 0.5) * 80;
		const angleOffset = helixIndex * Math.PI;

		return new THREE.Vector3(
			Math.cos(angle + angleOffset) * radius,
			Math.sin(angle + angleOffset) * radius,
			height
		);
	}, []);

	const createTorus = useCallback((i, count) => {
		const R = 40;
		const r = 15;
		const angle1 = Math.random() * Math.PI * 2;
		const angle2 = Math.random() * Math.PI * 2;

		return new THREE.Vector3(
			(R + r * Math.cos(angle2)) * Math.cos(angle1),
			(R + r * Math.cos(angle2)) * Math.sin(angle1),
			r * Math.sin(angle2)
		);
	}, []);

	const patterns = [
		createSphere,
		createSpiral,
		createHelix,
		createGrid,
		createTorus,
	];

	const colorPalettes = [
		[
			new THREE.Color(0x0077ff),
			new THREE.Color(0x00aaff),
			new THREE.Color(0x44ccff),
			new THREE.Color(0x0055cc),
		],
		[
			new THREE.Color(0x8800cc),
			new THREE.Color(0xcc00ff),
			new THREE.Color(0x660099),
			new THREE.Color(0xaa33ff),
		],
		[
			new THREE.Color(0x00cc66),
			new THREE.Color(0x33ff99),
			new THREE.Color(0x99ff66),
			new THREE.Color(0x008844),
		],
		[
			new THREE.Color(0xff9900),
			new THREE.Color(0xffcc33),
			new THREE.Color(0xff6600),
			new THREE.Color(0xffaa55),
		],
		[
			new THREE.Color(0xff3399),
			new THREE.Color(0xff66aa),
			new THREE.Color(0xff0066),
			new THREE.Color(0xcc0055),
		],
	];

	const createStarfield = useCallback(() => {
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);
		const starInfo = new Float32Array(starCount);
		const color = new THREE.Color();
		const starRadius = 700;

		for (let i = 0; i < starCount; i++) {
			const u = Math.random();
			const v = Math.random();
			const theta = 2 * Math.PI * u;
			const phi = Math.acos(2 * v - 1);

			positions[i * 3] = starRadius * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = starRadius * Math.sin(phi) * Math.sin(theta);
			positions[i * 3 + 2] = starRadius * Math.cos(phi);

			const rand = Math.random();
			if (rand < 0.7) {
				color.setHSL(0, 0, Math.random() * 0.2 + 0.7);
			} else if (rand < 0.9) {
				color.setHSL(0.6, 0.7, Math.random() * 0.2 + 0.6);
			} else {
				color.setHSL(0.1, 0.7, Math.random() * 0.2 + 0.6);
			}

			colors[i * 3] = color.r;
			colors[i * 3 + 1] = color.g;
			colors[i * 3 + 2] = color.b;
			starInfo[i] = Math.random();
		}

		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geometry.setAttribute("starInfo", new THREE.BufferAttribute(starInfo, 1));

		const material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				pointSize: { value: 2.5 },
			},
			vertexShader: `
        attribute float starInfo;
        varying vec3 vColor;
        varying float vStarInfo;
        uniform float pointSize;
        
        void main() {
          vColor = color;
          vStarInfo = starInfo;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = pointSize * (150.0 / -mvPosition.z);
        }
      `,
			fragmentShader: `
        uniform float time;
        varying vec3 vColor;
        varying float vStarInfo;
        
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float dist = length(uv);
          if (dist > 0.5) discard;
          
          float speed = vStarInfo * 2.0 + 0.5;
          float offset = vStarInfo * 3.14 * 2.0;
          float twinkle = sin(time * speed + offset) * 0.2 + 0.8;
          float alpha = pow(1.0 - dist * 2.0, 1.5);
          
          gl_FragColor = vec4(vColor, alpha * twinkle * 0.5);
        }
      `,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			vertexColors: true,
		});

		const starPoints = new THREE.Points(geometry, material);
		starPoints.renderOrder = -1;
		return starPoints;
	}, [starCount]);

	const createParticleSystem = useCallback(() => {
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3);
		const sizes = new Float32Array(particleCount);
		const indices = new Float32Array(particleCount);
		const particleTypes = new Float32Array(particleCount);

		const initialPattern = patterns[0];
		const initialPalette = colorPalettes[0];

		for (let i = 0; i < particleCount; i++) {
			indices[i] = i;
			particleTypes[i] = Math.floor(Math.random() * 3);

			const pos = initialPattern(i, particleCount);
			positions[i * 3] = pos.x;
			positions[i * 3 + 1] = pos.y;
			positions[i * 3 + 2] = pos.z;

			const colorIndex = Math.floor(Math.random() * initialPalette.length);
			const baseColor = initialPalette[colorIndex];
			const variation = 0.85 + Math.random() * 0.3;
			const finalColor = baseColor.clone().multiplyScalar(variation * 0.8);

			colors[i * 3] = finalColor.r;
			colors[i * 3 + 1] = finalColor.g;
			colors[i * 3 + 2] = finalColor.b;

			sizes[i] = 1.0 + Math.random() * 1.5;
		}

		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
		geometry.setAttribute("index", new THREE.BufferAttribute(indices, 1));
		geometry.setAttribute(
			"particleType",
			new THREE.BufferAttribute(particleTypes, 1)
		);
		(geometry as any).userData.currentColors = new Float32Array(colors);

		const material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				mousePos: { value: new THREE.Vector3(10000, 10000, 0) },
			},
			vertexShader: `
        uniform float time;
        uniform vec3 mousePos;
        attribute float size;
        attribute float index;
        attribute float particleType;
        varying vec3 vColor;
        varying float vDistanceToMouse;
        varying float vType;
        varying float vIndex;
        
        float rand(vec2 co) {
          return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
        }
        
        void main() {
          vColor = color;
          vType = particleType;
          vIndex = index;
          
          vec3 pos = position;
          float T = time * 0.5;
          float idx = index * 0.01;
          
          float noiseFactor1 = sin(idx * 30.0 + T * 15.0) * 0.4 + 0.6;
          vec3 offset1 = vec3(
            cos(T * 1.2 + idx * 5.0) * noiseFactor1,
            sin(T * 0.9 + idx * 6.0) * noiseFactor1,
            cos(T * 1.1 + idx * 7.0) * noiseFactor1
          ) * 0.4;
          
          float noiseFactor2 = rand(vec2(idx, idx * 0.5)) * 0.5 + 0.5;
          float speedFactor = 0.3;
          vec3 offset2 = vec3(
            sin(T * speedFactor * 1.3 + idx * 1.1) * noiseFactor2,
            cos(T * speedFactor * 1.7 + idx * 1.2) * noiseFactor2,
            sin(T * speedFactor * 1.1 + idx * 1.3) * noiseFactor2
          ) * 0.8;
          
          pos += offset1 + offset2;
          
          vec3 toMouse = mousePos - pos;
          float dist = length(toMouse);
          vDistanceToMouse = 0.0;
          float interactionRadius = 30.0;
          float falloffStart = 5.0;
          
          if (dist < interactionRadius) {
            float influence = smoothstep(interactionRadius, falloffStart, dist);
            vec3 repelDir = normalize(pos - mousePos);
            pos += repelDir * influence * 15.0;
            vDistanceToMouse = influence;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float perspectiveFactor = 700.0 / -mvPosition.z;
          gl_PointSize = size * perspectiveFactor * (1.0 + vDistanceToMouse * 0.5);
        }
      `,
			fragmentShader: `
        uniform float time;
        varying vec3 vColor;
        varying float vDistanceToMouse;
        varying float vType;
        varying float vIndex;
        
        vec3 rgb2hsl(vec3 c) {
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }
        
        vec3 hsl2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float dist = length(uv);
          if (dist > 1.0) discard;
          
          float alpha = 0.0;
          vec3 baseColor = vColor;
          
          vec3 hsl = rgb2hsl(baseColor);
          float hueShift = sin(time * 0.05 + vIndex * 0.001) * 0.02;
          hsl.x = fract(hsl.x + hueShift);
          baseColor = hsl2rgb(hsl);
          vec3 finalColor = baseColor;
          
          if (vType < 0.5) {
            float core = smoothstep(0.2, 0.15, dist) * 0.6;
            float glow = pow(max(0.0, 1.0 - dist), 3.0) * 0.3;
            alpha = core + glow;
          } else if (vType < 1.5) {
            float ringWidth = 0.1;
            float ringCenter = 0.65;
            float ringShape = exp(-pow(dist - ringCenter, 2.0) / (2.0 * ringWidth * ringWidth));
            alpha = smoothstep(0.1, 0.5, ringShape) * 0.5;
            alpha += smoothstep(0.3, 0.0, dist) * 0.06;
          } else {
            float pulse = sin(dist * 5.0 - time * 2.0 + vIndex * 0.1) * 0.1 + 0.9;
            alpha = pow(max(0.0, 1.0 - dist), 2.5) * pulse * 0.6;
          }
          
          finalColor = mix(finalColor, finalColor * 1.1 + 0.05, vDistanceToMouse * 0.8);
          alpha *= 0.7;
          alpha = clamp(alpha, 0.0, 1.0);
          
          gl_FragColor = vec4(finalColor * alpha, alpha);
        }
      `,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			vertexColors: true,
		});

		return new THREE.Points(geometry, material);
	}, [particleCount, patterns, colorPalettes]);

	const updatePatternName = useCallback((name: string, instant = false) => {
		const el = patternNameRef.current;
		if (!el) return;

		el.textContent = name;
		if (instant) {
			el.style.transition = "none";
			el.style.opacity = "1";
		} else {
			el.style.transition = "opacity 0.5s ease";
			el.style.opacity = "1";
			setTimeout(() => {
				if (el) el.style.opacity = "0";
			}, 2500);
		}
	}, []);

	const completeCurrentTransition = useCallback(() => {
		const particles = particlesRef.current;
		if (
			!isTransitioningRef.current ||
			!particles ||
			!(particles as any).userData.toPositions ||
			!(particles as any).userData.toColors
		) {
			isTransitioningRef.current = false;
			transitionProgressRef.current = 0;
			if (particles) {
				delete (particles as any).userData.fromPositions;
				delete (particles as any).userData.toPositions;
				delete (particles as any).userData.fromColors;
				delete (particles as any).userData.toColors;
			}
			return;
		}

		const positions = particles.geometry.attributes.position.array;
		const colors = particles.geometry.attributes.color.array;

		positions.set(particles.userData.toPositions);
		colors.set(particles.userData.toColors);
		particles.geometry.userData.currentColors = new Float32Array(
			particles.userData.toColors
		);

		particles.geometry.attributes.position.needsUpdate = true;
		particles.geometry.attributes.color.needsUpdate = true;

		currentPatternRef.current = particles.userData.targetPattern;

		delete particles.userData.fromPositions;
		delete particles.userData.toPositions;
		delete particles.userData.fromColors;
		delete particles.userData.toColors;

		isTransitioningRef.current = false;
		transitionProgressRef.current = 0;
	}, []);

	const transitionToPattern = useCallback(
		(newPattern: number) => {
			const particles = particlesRef.current;
			if (!particles) return;

			isTransitioningRef.current = true;

			const posAttr = particles.geometry.attributes.position;
			const colAttr = particles.geometry.attributes.color;
			const curPos = new Float32Array(posAttr.array);
			const curCol = particles.geometry.userData.currentColors
				? new Float32Array(particles.geometry.userData.currentColors)
				: new Float32Array(colAttr.array);

			const newPos = new Float32Array(curPos.length);
			const patternFn = patterns[newPattern];

			for (let i = 0; i < particleCount; i++) {
				const p = patternFn(i, particleCount);
				newPos[i * 3] = p.x;
				newPos[i * 3 + 1] = p.y;
				newPos[i * 3 + 2] = p.z;
			}

			const newCol = new Float32Array(curCol.length);
			const palette = colorPalettes[newPattern];

			for (let i = 0; i < particleCount; i++) {
				const idx = Math.floor(Math.random() * palette.length);
				const base = palette[idx];
				const variation = 0.85 + Math.random() * 0.3;
				const final = base.clone().multiplyScalar(variation * 0.8);

				newCol[i * 3] = final.r;
				newCol[i * 3 + 1] = final.g;
				newCol[i * 3 + 2] = final.b;
			}

			(particles as any).userData.fromPositions = curPos;
			(particles as any).userData.toPositions = newPos;
			(particles as any).userData.fromColors = curCol;
			(particles as any).userData.toColors = newCol;
			(particles as any).userData.targetPattern = newPattern;

			transitionProgressRef.current = 0;
		},
		[particleCount, patterns, colorPalettes]
	);

	const forcePatternChange = useCallback(() => {
		if (isTransitioningRef.current) {
			completeCurrentTransition();
		}

		const nextPattern = (currentPatternRef.current + 1) % patterns.length;
		transitionToPattern(nextPattern);
		updatePatternName(patternNames[nextPattern]);
	}, [
		patterns.length,
		patternNames,
		completeCurrentTransition,
		transitionToPattern,
		updatePatternName,
	]);

	const updateScreenMouse = useCallback((clientX: number, clientY: number) => {
		screenMouseRef.current.x = (clientX / window.innerWidth) * 2 - 1;
		screenMouseRef.current.y = -(clientY / window.innerHeight) * 2 + 1;
	}, []);

	const handleMouseMove = useCallback(
		(event) => {
			updateScreenMouse(event.clientX, event.clientY);
		},
		[updateScreenMouse]
	);

	const handleMouseClick = useCallback(
		(event) => {
			event.preventDefault();
			forcePatternChange();
		},
		[forcePatternChange]
	);

	const handleTouchStart = useCallback(
		(event) => {
			event.preventDefault();
			if (event.touches.length > 0) {
				updateScreenMouse(event.touches[0].clientX, event.touches[0].clientY);
			}
			forcePatternChange();
		},
		[updateScreenMouse, forcePatternChange]
	);

	const handleTouchMove = useCallback(
		(event) => {
			event.preventDefault();
			if (event.touches.length > 0) {
				updateScreenMouse(event.touches[0].clientX, event.touches[0].clientY);
			}
		},
		[updateScreenMouse]
	);

	const handleResize = useCallback(() => {
		const camera = cameraRef.current;
		const renderer = rendererRef.current;
		const composer = composerRef.current;

		if (!camera || !renderer || !composer) return;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		composer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
	}, []);

	const animate = useCallback(() => {
		animationIdRef.current = requestAnimationFrame(animate);

		const renderer = rendererRef.current;
		const composer = composerRef.current;
		const camera = cameraRef.current;
		const scene = sceneRef.current;
		const particles = particlesRef.current;
		const stars = starsRef.current;

		if (!renderer || !composer || !camera || !scene) return;

		const deltaTime = clockRef.current.getDelta();
		timeRef.current += deltaTime;

		// Update mouse position
		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(screenMouseRef.current, camera);
		const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
		const intersectPoint = new THREE.Vector3();

		if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
			if (screenMouseRef.current.x < 9000) {
				lastWorldMouseRef.current.copy(worldMouseRef.current);
				worldMouseRef.current.lerp(intersectPoint, 0.1);
			}
		}

		// Update uniforms
		if (stars && stars.material.uniforms.time) {
			stars.material.uniforms.time.value =
				timeRef.current;
		}

		if (
			particles &&
			particles.material.uniforms.time &&
			particles.material.uniforms.mousePos
		) {
			particles.material.uniforms.time.value =
				timeRef.current;
			particles.material.uniforms.mousePos.value.copy(
				worldMouseRef.current
			);
		}

		// Handle transitions
		if (
			isTransitioningRef.current &&
			particles &&
			particles.userData.fromPositions &&
			particles.userData.toPositions &&
			particles.userData.fromColors &&
			particles.userData.toColors
		) {
			transitionProgressRef.current += transitionSpeed;

			if (transitionProgressRef.current >= 1.0) {
				transitionProgressRef.current = 1.0;
				completeCurrentTransition();
			} else {
				const positions = particles.geometry.attributes.position
					.array as Float32Array;
				const colors = particles.geometry.attributes.color
					.array as Float32Array;
				const fromPos = (particles as any).userData.fromPositions;
				const toPos = (particles as any).userData.toPositions;
				const fromCol = (particles as any).userData.fromColors;
				const toCol = (particles as any).userData.toColors;

				const t = transitionProgressRef.current;
				const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

				if (
					fromPos.length === positions.length &&
					toPos.length === positions.length &&
					fromCol.length === colors.length &&
					toCol.length === colors.length
				) {
					for (let i = 0; i < positions.length / 3; i++) {
						const index = i * 3;
						positions[index] =
							fromPos[index] * (1 - ease) + toPos[index] * ease;
						positions[index + 1] =
							fromPos[index + 1] * (1 - ease) + toPos[index + 1] * ease;
						positions[index + 2] =
							fromPos[index + 2] * (1 - ease) + toPos[index + 2] * ease;
						colors[index] = fromCol[index] * (1 - ease) + toCol[index] * ease;
						colors[index + 1] =
							fromCol[index + 1] * (1 - ease) + toCol[index + 1] * ease;
						colors[index + 2] =
							fromCol[index + 2] * (1 - ease) + toCol[index + 2] * ease;
					}

					particles.geometry.attributes.position.needsUpdate = true;
					particles.geometry.attributes.color.needsUpdate = true;
					(particles.geometry as any).userData.currentColors = new Float32Array(
						colors
					);
				} else {
					console.error(
						"Transition data length mismatch during interpolation!"
					);
					completeCurrentTransition();
				}
			}
		}

		// Camera movement
		const baseRadius = 100;
		const radiusVariation = Math.sin(timeRef.current * 0.1) * 15;
		const cameraRadius = baseRadius + radiusVariation;
		const angleX = timeRef.current * 0.08;
		const angleY = timeRef.current * 0.06;

		camera.position.x = Math.cos(angleX) * cameraRadius;
		camera.position.z = Math.sin(angleX) * cameraRadius;
		camera.position.y = Math.sin(angleY) * 35 + 5;
		camera.lookAt(0, 0, 0);

		// Rotate stars
		if (stars) {
			stars.rotation.y += 0.0001;
		}

		composer.render(deltaTime);
	}, [completeCurrentTransition, transitionSpeed]);

	useEffect(() => {
		if (!containerRef.current) return;

		// Initialize Three.js
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			65,
			window.innerWidth / window.innerHeight,
			0.1,
			1500
		);
		camera.position.z = 100;

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		containerRef.current.appendChild(renderer.domElement);

		// Create starfield and particles
		const stars = createStarfield();
		scene.add(stars);

		const particles = createParticleSystem();
		scene.add(particles);

		// Set up post-processing
		const composer = new EffectComposer(renderer);
		composer.addPass(new RenderPass(scene, camera));

		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			1.8,
			0.6,
			0.8
		);
		composer.addPass(bloomPass);

		const outputPass = new OutputPass();
		composer.addPass(outputPass);

		// Store references
		sceneRef.current = scene;
		cameraRef.current = camera;
		rendererRef.current = renderer;
		particlesRef.current = particles;
		starsRef.current = stars;
		composerRef.current = composer;

		// Add event listeners
		window.addEventListener("resize", handleResize);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mousedown", handleMouseClick);
		document.addEventListener("touchstart", handleTouchStart, {
			passive: false,
		});
		document.addEventListener("touchmove", handleTouchMove, { passive: false });

		// Initialize pattern name
		updatePatternName(patternNames[currentPatternRef.current], true);

		// Start animation
		animate();

		// Cleanup
		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}

			window.removeEventListener("resize", handleResize);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mousedown", handleMouseClick);
			document.removeEventListener("touchstart", handleTouchStart);
			document.removeEventListener("touchmove", handleTouchMove);

			if (containerRef.current && renderer.domElement) {
				containerRef.current.removeChild(renderer.domElement);
			}

			renderer.dispose();
			scene.clear();
		};
	}, [
		createStarfield,
		createParticleSystem,
		handleResize,
		handleMouseMove,
		handleMouseClick,
		handleTouchStart,
		handleTouchMove,
		updatePatternName,
		patternNames,
		animate,
	]);

	return (
		<div
			style={{
				position: "fixed",
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<div
				ref={containerRef}
				style={{
					position: "fixed",
					width: "100%",
					height: "100%",
					background:
						"linear-gradient(180deg, #00050a 0%, #000a14 50%, #001020 100%)",
					overflow: "hidden",
				}}
			/>

			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					background:
						"radial-gradient(circle at 50% 50%, rgba(0, 100, 180, 0.02) 0%, rgba(30, 0, 100, 0.03) 50%, transparent 75%)",
					mixBlendMode: "screen",
					opacity: 0.5,
				}}
			/>

			<div
				ref={patternNameRef}
				style={{
					position: "fixed",
					top: "20px",
					left: "50%",
					transform: "translateX(-50%)",
					color: "white",
					fontFamily: "sans-serif",
					fontSize: "16px",
					pointerEvents: "none",
					zIndex: 100,
					opacity: 0,
					transition: "opacity 0.5s ease",
					textAlign: "center",
					backgroundColor: "rgba(0,0,0,0.4)",
					padding: "8px 18px",
					borderRadius: "25px",
					textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
				}}
			>
				Cosmic Sphere
			</div>

			<div
				style={{
					position: "fixed",
					bottom: "15px",
					left: "15px",
					color: "rgba(255, 255, 255, 0.7)",
					fontFamily: "sans-serif",
					fontSize: "12px",
					backgroundColor: "rgba(0, 0, 0, 0.3)",
					padding: "5px 10px",
					borderRadius: "3px",
					zIndex: 100,
					pointerEvents: "none",
					lineHeight: 1.4,
				}}
			>
				Hover to interact
				<br />
				Click/Tap to change pattern
			</div>
		</div>
	);
};

export default CosmicParticles;