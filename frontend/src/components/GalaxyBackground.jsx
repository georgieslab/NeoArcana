import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * GalaxyBackground Component
 * 
 * Implements the iconic Cosmic Arcana galaxy background with:
 * 1. 3D WebGL Engine (faithful port of static/src/galaxy_bg.js):
 *    - Central 3D planet (Icosahedron with texturenucleus.jpg)
 *    - 50 converging stars with dynamic velocity physics
 *    - Rotating cosmic sphere background (bg_main.jpg)
 *    - Fixed starfield clouds (texture1, texture2, texture4)
 *    - Safe WebGL context lifecycle handling for React 19 StrictMode
 * 
 * 2. High-Performance 2D Canvas Fallback Engine:
 *    - Automatically activates if browser WebGL is disabled or unavailable
 *    - Renders the central planet with texturenucleus.jpg and atmospheric glow
 *    - 50 stars converging dynamically toward the central planet
 *    - Zero lag, zero dependencies, zero yellow squares
 */
export default function GalaxyBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId;
    let isCleanedUp = false;
    let starSpeed = 2;

    // Window helpers declaration
    const setupWindowHelpers = (zoomFn) => {
      window.zoomBackground = zoomFn;
      window.changeStarSpeed = (speed) => {
        starSpeed = speed;
      };
      window.startCardSpinAnimation = () => {};
      window.createNameParticles = () => {};
      window.moveCardToTop = () => {};
      window.updateCardFront = () => {};
      window.positionCard = () => {};
    };

    // Helper: test if WebGL is currently allowed and functioning in browser
    function canCreateWebGLContext() {
      try {
        const test = document.createElement('canvas');
        const gl = test.getContext('webgl2') || test.getContext('webgl');
        return !!gl;
      } catch {
        return false;
      }
    }

    // ========================================================
    // ENGINE 1: 3D THREE.JS WEBGL (from static/src/galaxy_bg.js)
    // ========================================================
    function startThreeEngine() {
      let renderer, scene, camera, sphereBg, nucleus, stars, controls;
      let cardMesh, cardMaterial;

      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, w / h, 0.01, 1000);
      camera.position.set(0, 0, 230);

      const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
      directionalLight.position.set(0, 50, -20);
      scene.add(directionalLight);

      const ambientLight = new THREE.AmbientLight('#ffffff', 1);
      ambientLight.position.set(0, 20, 20);
      scene.add(ambientLight);

      // Create WebGL Renderer with safe fallbacks
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      try {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = false;
        controls.autoRotateSpeed = 5;
        controls.maxDistance = 360;
        controls.minDistance = 150;
        controls.enablePan = true;
      } catch {
        // OrbitControls optional
      }

      function randomPointSphere(radius) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const dx = radius * Math.sin(phi) * Math.cos(theta);
        const dy = radius * Math.sin(phi) * Math.sin(theta);
        const dz = radius * Math.cos(phi);
        return new THREE.Vector3(dx, dy, dz);
      }

      const loader = new THREE.TextureLoader();
      const loadTexture = (url) =>
        new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });

      function createSphereBg(texture) {
        if (!texture) return;
        texture.anisotropy = 16;
        const geometry = new THREE.SphereGeometry(150, 40, 40);
        const material = new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          map: texture,
        });
        sphereBg = new THREE.Mesh(geometry, material);
        scene.add(sphereBg);
      }

      function createNucleus(texture) {
        const geometry = new THREE.IcosahedronGeometry(30, 10);
        const material = new THREE.MeshPhongMaterial({
          map: texture || undefined,
          color: texture ? 0xffffff : 0x8a6cb8,
          emissive: 0x2a1a4a,
          emissiveIntensity: 0.3,
        });
        nucleus = new THREE.Mesh(geometry, material);
        scene.add(nucleus);
      }

      function createStars(texture) {
        const starsGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(50 * 3);
        const velocities = new Float32Array(50);
        const startPositions = new Float32Array(50 * 3);

        for (let i = 0; i < 50; i++) {
          const pt = randomPointSphere(150);
          positions[i * 3] = pt.x;
          positions[i * 3 + 1] = pt.y;
          positions[i * 3 + 2] = pt.z;

          velocities[i] = THREE.MathUtils.randInt(50, 200);

          startPositions[i * 3] = pt.x;
          startPositions[i * 3 + 1] = pt.y;
          startPositions[i * 3 + 2] = pt.z;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
        starsGeometry.setAttribute('startPosition', new THREE.BufferAttribute(startPositions, 3));

        const starsMaterial = new THREE.PointsMaterial({
          size: 5,
          color: '#ffffff',
          transparent: true,
          opacity: 0.85,
          map: texture || undefined,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
      }

      function createStarField(texture, size, total) {
        const pointGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(total * 3);

        for (let i = 0; i < total; i++) {
          const radius = THREE.MathUtils.randInt(149, 70);
          const pt = randomPointSphere(radius);
          positions[i * 3] = pt.x;
          positions[i * 3 + 1] = pt.y;
          positions[i * 3 + 2] = pt.z;
        }

        pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const pointMaterial = new THREE.PointsMaterial({
          size: size,
          map: texture || undefined,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,
        });
        return new THREE.Points(pointGeometry, pointMaterial);
      }

      function createFixedStars(texture1, texture2, texture4) {
        scene.add(createStarField(texture1, 15, 20));
        scene.add(createStarField(texture2, 5, 5));
        scene.add(createStarField(texture4, 7, 5));
      }

      function createCard() {
        const geometry = new THREE.PlaneGeometry(20, 30);
        const backTexture = loader.load('/static/images/card-back.jpg');

        cardMaterial = new THREE.ShaderMaterial({
          uniforms: {
            tBack: { value: backTexture },
            tFront: { value: null },
            mixRatio: { value: 0 },
            gradientColor1: { value: new THREE.Color('#cdc0f2') },
            gradientColor2: { value: new THREE.Color('#F4A261') },
            gradientColor3: { value: new THREE.Color('#5b5087') },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D tBack;
            uniform sampler2D tFront;
            uniform float mixRatio;
            uniform vec3 gradientColor1;
            uniform vec3 gradientColor2;
            uniform vec3 gradientColor3;
            varying vec2 vUv;
            void main() {
              vec4 backColor = texture2D(tBack, vUv);
              vec3 gradient = mix(
                mix(gradientColor1, gradientColor2, vUv.y),
                gradientColor3,
                abs(vUv.x - 0.5) * 2.0
              );
              vec4 frontColor = texture2D(tFront, vUv);
              vec4 gradientColor = vec4(gradient, 1.0);
              vec4 mixedFront = mix(gradientColor, frontColor, step(0.01, frontColor.a));
              gl_FragColor = mix(backColor, mixedFront, mixRatio);
            }
          `,
        });

        cardMesh = new THREE.Mesh(geometry, cardMaterial);
        cardMesh.position.set(0, 0, 10);
        scene.add(cardMesh);
      }

      // Load textures & start 3D loop
      Promise.all([
        loadTexture('/static/images/bg_main.jpg'),
        loadTexture('/static/images/texturenucleus.jpg'),
        loadTexture('/static/images/textureStar.png'),
        loadTexture('/static/images/texture1.png'),
        loadTexture('/static/images/texture2.png'),
        loadTexture('/static/images/texture4.png'),
      ])
        .then(([texBg, texNucleus, texStar, tex1, tex2, tex4]) => {
          if (isCleanedUp) return;
          createSphereBg(texBg);
          createNucleus(texNucleus);
          createStars(texStar);
          createFixedStars(tex1, tex2, tex4);
          createCard();
          container.classList.add('loaded');
          setTimeout(() => {
            if (!isCleanedUp) animate();
          }, 300);
        })
        .catch(() => {
          if (!isCleanedUp) {
            createNucleus(null);
            createStars(null);
            container.classList.add('loaded');
            animate();
          }
        });

      function animate() {
        if (isCleanedUp) return;
        animId = requestAnimationFrame(animate);

        if (stars && stars.geometry) {
          const positionsStars = stars.geometry.attributes.position.array;
          const velocitiesStars = stars.geometry.attributes.velocity.array;
          const startPositionsStars = stars.geometry.attributes.startPosition.array;

          for (let i = 0; i < positionsStars.length; i += 3) {
            const vIdx = i / 3;
            positionsStars[i] += ((0 - positionsStars[i]) / velocitiesStars[vIdx]) * starSpeed;
            positionsStars[i + 1] += ((0 - positionsStars[i + 1]) / velocitiesStars[vIdx]) * starSpeed;
            positionsStars[i + 2] += ((0 - positionsStars[i + 2]) / velocitiesStars[vIdx]) * starSpeed;

            velocitiesStars[vIdx] -= 0.3;

            if (Math.abs(positionsStars[i]) <= 5 && Math.abs(positionsStars[i + 2]) <= 5) {
              positionsStars[i] = startPositionsStars[i];
              positionsStars[i + 1] = startPositionsStars[i + 1];
              positionsStars[i + 2] = startPositionsStars[i + 2];
              velocitiesStars[vIdx] = THREE.MathUtils.randInt(50, 300);
            }
          }

          stars.geometry.attributes.position.needsUpdate = true;
          stars.geometry.attributes.velocity.needsUpdate = true;
        }

        if (nucleus) nucleus.rotation.y += 0.002;

        if (sphereBg) {
          sphereBg.rotation.x += 0.002;
          sphereBg.rotation.y += 0.002;
          sphereBg.rotation.z += 0.002;
        }

        scene.children.forEach((child) => {
          if (child instanceof THREE.Points && child !== stars) {
            child.rotation.y += 0.0009;
          }
        });

        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
      }

      // 3D Zoom helper
      setupWindowHelpers((amount, duration = 1000) => {
        if (!camera) return;
        const startZ = camera.position.z;
        const endZ = startZ * (1 - amount);
        const startTime = Date.now();

        function animateZoom() {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          camera.position.z = startZ + (endZ - startZ) * progress;
          if (progress < 1 && !isCleanedUp) {
            requestAnimationFrame(animateZoom);
          }
        }
        animateZoom();
      });

      // Cleanup function for 3D engine
      return () => {
        isCleanedUp = true;
        cancelAnimationFrame(animId);
        if (controls) controls.dispose();
        if (renderer) {
          if (typeof renderer.forceContextLoss === 'function') {
            renderer.forceContextLoss();
          }
          renderer.dispose();
          if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        }
        if (nucleus) {
          nucleus.geometry?.dispose();
          nucleus.material?.dispose();
        }
        if (sphereBg) {
          sphereBg.geometry?.dispose();
          sphereBg.material?.dispose();
        }
        if (stars) {
          stars.geometry?.dispose();
          stars.material?.dispose();
        }
        if (cardMesh) {
          cardMesh.geometry?.dispose();
          cardMaterial?.dispose();
        }
      };
    }

    // ========================================================
    // ENGINE 2: HIGH-PERFORMANCE 2D CANVAS FALLBACK
    // (Used when browser hardware acceleration / WebGL is off)
    // ========================================================
    function start2DEngine() {
      const canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      container.appendChild(canvas);
      container.classList.add('loaded');

      const ctx = canvas.getContext('2d');
      if (!ctx) return () => {};

      let width = (canvas.width = container.clientWidth || window.innerWidth);
      let height = (canvas.height = container.clientHeight || window.innerHeight);

      // Load nucleus texture image
      const nucleusImg = new Image();
      nucleusImg.src = '/static/images/texturenucleus.jpg';
      let nucleusLoaded = false;
      nucleusImg.onload = () => {
        nucleusLoaded = true;
      };

      // 50 Converging Stars (identical math to galaxy_bg.js)
      const starCount = 50;
      const starsData = [];
      const getPlanetRadius = () => Math.min(width, height) * 0.11;
      const getMaxRadius = () => Math.hypot(width / 2, height / 2) * 0.95;

      for (let i = 0; i < starCount; i++) {
        starsData.push({
          angle: Math.random() * Math.PI * 2,
          dist: getPlanetRadius() + Math.random() * (getMaxRadius() - getPlanetRadius()),
          velocity: 50 + Math.random() * 150,
          size: 1.2 + Math.random() * 2.2,
          opacity: 0.4 + Math.random() * 0.6,
        });
      }

      // Distant twinkling background stars
      const distantStars = [];
      for (let i = 0; i < 40; i++) {
        distantStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.8 + Math.random() * 1.5,
          opacity: Math.random(),
          pulse: 0.008 + Math.random() * 0.015,
        });
      }

      let planetRotation = 0;
      let zoomScale = 1;
      let targetZoomScale = 1;

      // 2D Zoom helper
      setupWindowHelpers((amount) => {
        targetZoomScale = Math.max(0.6, Math.min(2.5, 1 + amount * 0.8));
      });

      function render2D() {
        if (isCleanedUp) return;
        animId = requestAnimationFrame(render2D);

        // Smooth zoom interpolation
        zoomScale += (targetZoomScale - zoomScale) * 0.04;

        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const pRadius = getPlanetRadius() * zoomScale;
        const maxRad = getMaxRadius() * zoomScale;

        // 1. Draw distant twinkling stars
        distantStars.forEach((star) => {
          star.opacity += star.pulse;
          if (star.opacity > 1 || star.opacity < 0.2) star.pulse = -star.pulse;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(205, 192, 242, ${Math.max(0, Math.min(1, star.opacity))})`;
          ctx.fill();
        });

        // 2. Draw 50 Converging Stars flying toward the center planet
        starsData.forEach((s) => {
          s.dist -= (s.dist / s.velocity) * starSpeed * 3;
          s.velocity -= 0.3;

          // Star reached central planet -> reset to outer boundary
          if (s.dist <= pRadius * 0.7 || s.velocity <= 2) {
            s.dist = maxRad;
            s.velocity = 50 + Math.random() * 200;
            s.angle = Math.random() * Math.PI * 2;
          }

          const sx = cx + Math.cos(s.angle) * s.dist;
          const sy = cy + Math.sin(s.angle) * s.dist;

          // Star glow
          ctx.beginPath();
          ctx.arc(sx, sy, s.size * zoomScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#cdc0f2';
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 3. Draw Central Planet (Nucleus)
        ctx.save();
        ctx.translate(cx, cy);

        // Outer atmospheric corona glow
        const corona = ctx.createRadialGradient(0, 0, pRadius * 0.8, 0, 0, pRadius * 1.5);
        corona.addColorStop(0, 'rgba(165, 154, 209, 0.45)');
        corona.addColorStop(0.5, 'rgba(107, 78, 113, 0.25)');
        corona.addColorStop(1, 'transparent');
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(0, 0, pRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Planet body with clip circle
        ctx.beginPath();
        ctx.arc(0, 0, pRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        planetRotation += 0.0025;
        ctx.rotate(planetRotation);

        if (nucleusLoaded) {
          ctx.drawImage(nucleusImg, -pRadius, -pRadius, pRadius * 2, pRadius * 2);
        } else {
          const planetGrad = ctx.createLinearGradient(-pRadius, -pRadius, pRadius, pRadius);
          planetGrad.addColorStop(0, '#5b5087');
          planetGrad.addColorStop(0.5, '#2b1b47');
          planetGrad.addColorStop(1, '#0e0821');
          ctx.fillStyle = planetGrad;
          ctx.fillRect(-pRadius, -pRadius, pRadius * 2, pRadius * 2);
        }

        // Spherical shading overlay for 3D sphere look
        const sphereShade = ctx.createRadialGradient(
          -pRadius * 0.35,
          -pRadius * 0.35,
          pRadius * 0.1,
          0,
          0,
          pRadius
        );
        sphereShade.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        sphereShade.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
        sphereShade.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
        ctx.fillStyle = sphereShade;
        ctx.beginPath();
        ctx.arc(0, 0, pRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      render2D();

      const handleResize2D = () => {
        width = canvas.width = container.clientWidth || window.innerWidth;
        height = canvas.height = container.clientHeight || window.innerHeight;
      };
      window.addEventListener('resize', handleResize2D);

      return () => {
        isCleanedUp = true;
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize2D);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      };
    }

    // ========================================================
    // ENGINE INITIALIZER: Try 3D WebGL, fallback to 2D
    // ========================================================
    let cleanupEngine = null;

    if (canCreateWebGLContext()) {
      try {
        cleanupEngine = startThreeEngine();
      } catch (err) {
        console.warn('WebGL init failed, activating 2D celestial engine:', err);
        cleanupEngine = start2DEngine();
      }
    } else {
      console.info('WebGL disabled or unavailable, running 2D celestial engine.');
      cleanupEngine = start2DEngine();
    }

    return () => {
      if (cleanupEngine) cleanupEngine();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="canvas_container"
      className="loaded"
    />
  );
}
