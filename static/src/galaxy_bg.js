let renderer,
    scene,
    camera,
    sphereBg,
    nucleus,
    stars,
    controls,
    container = document.getElementById("canvas_container"),
    timeout_Debounce,
    noise = new SimplexNoise(),
    cameraSpeed = 0,
    blobScale = 3;

let starSpeed = 0.4;

let cardMesh, cardMaterial, nameParticles;

init();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000)
    camera.position.set(0,0,230);

    const directionalLight = new THREE.DirectionalLight("#fff", 2);
    directionalLight.position.set(0, 50, -20);
    scene.add(directionalLight);

    let ambientLight = new THREE.AmbientLight("#ffffff", 1);
    ambientLight.position.set(0, 20, 20);
    scene.add(ambientLight);

    try {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
    } catch (error) {
        // Handle renderer creation errors silently
    }

    try {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.autoRotate = false;
        controls.autoRotateSpeed = 5;
        controls.maxDistance = 360;
        controls.minDistance = 150;
        controls.enablePan = true;
    } catch (error) {
        // Handle controls creation errors silently
    }

    const loader = new THREE.TextureLoader();
    
    Promise.all([
        loadTexture(loader, '/static/images/bg_main.jpg'),
        loadTexture(loader, '/static/images/texturenucleus.jpg'),
        loadTexture(loader, "/static/images/textureStar.png"),
        loadTexture(loader, "/static/images/texture1.png"),
        loadTexture(loader, "/static/images/texture2.png"),
        loadTexture(loader, "/static/images/texture4.png")
    ]).then(([textureSphereBg, texturenucleus, textureStar, texture1, texture2, texture4]) => {
        createSphereBg(textureSphereBg);
        createNucleus(texturenucleus);
        createStars(textureStar);
        createFixedStars(texture1, texture2, texture4);
        createCard();
        setTimeout(() => {
            animate();
        }, 500);
    }).catch(error => {
        // Handle texture loading errors silently
    });
}

function createCard() {
  const geometry = new THREE.PlaneGeometry(20, 30); // Adjust size as needed
  const textureLoader = new THREE.TextureLoader();
  const backTexture = textureLoader.load('/static/images/card-back.jpg');

  cardMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tBack: { value: backTexture },
      tFront: { value: null }, // We'll set this later when we have the card image
      mixRatio: { value: 0 },
      gradientColor1: { value: new THREE.Color('#cdc0f2') },
      gradientColor2: { value: new THREE.Color('#F4A261') },
      gradientColor3: { value: new THREE.Color('#5b5087') }
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
    `
  });

  cardMesh = new THREE.Mesh(geometry, cardMaterial);
  cardMesh.position.set(0, 0, 10); // Initial position
  scene.add(cardMesh);
}

function positionCard() {
  if (!cardMesh) return;

  const containerRect = document.getElementById('three-js-card-container').getBoundingClientRect();
  const { width, height } = containerRect;

  // Convert screen coordinates to Three.js world coordinates
  const vector = new THREE.Vector3();
  vector.set(
    (containerRect.left / window.innerWidth) * 2 - 1,
    -(containerRect.top / window.innerHeight) * 2 + 1,
    0.5
  );
  vector.unproject(camera);

  cardMesh.position.set(vector.x, vector.y, 10);
  cardMesh.scale.set(width / 100, height / 100, 1); // Adjust scale as needed
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function startCardSpinAnimation(duration) {
  if (!cardMesh) {
    return;
  }

  const startRotation = cardMesh.rotation.y;
  const endRotation = startRotation + Math.PI * 4; // Four full rotations
  const startTime = Date.now();

  function animateCard() {
    const now = Date.now();
    const elapsedTime = now - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easedProgress = easeInOutQuad(progress);

    cardMesh.rotation.y = startRotation + (endRotation - startRotation) * easedProgress;
    cardMaterial.uniforms.mixRatio.value = Math.sin(easedProgress * Math.PI) * 0.5 + 0.5;

    renderer.render(scene, camera);

    if (progress < 1) {
      requestAnimationFrame(animateCard);
    } else {
      cardMesh.rotation.y = startRotation;
      cardMaterial.uniforms.mixRatio.value = 0; // Show back side at the end
      renderer.render(scene, camera);
    }
  }

  animateCard();
}

function updateCardFront(imageUrl) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(imageUrl, (texture) => {
    cardMaterial.uniforms.tFront.value = texture;
  });
}

function createNameParticles(name) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const particles = name.length * 100;

  for (let i = 0; i < particles; i++) {
    positions.push((Math.random() - 0.5) * 100);
    positions.push((Math.random() - 0.5) * 100);
    positions.push((Math.random() - 0.5) * 100);

    colors.push(Math.random(), Math.random(), Math.random());
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({ size: 1, vertexColors: true });
  nameParticles = new THREE.Points(geometry, material);
  scene.add(nameParticles);
}

function animateNameParticles() {
  const positions = nameParticles.geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += (Math.random() - 0.5) * 0.3;
    positions[i + 1] += (Math.random() - 0.5) * 0.3;
    positions[i + 2] += (Math.random() - 0.5) * 0.3;
  }

  nameParticles.geometry.attributes.position.needsUpdate = true;
}

container.classList.add('loaded');

function loadTexture(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

function createSphereBg(texture) {
  texture.anisotropy = 16;
  let geometrySphereBg = new THREE.SphereBufferGeometry(150, 40, 40);
  let materialSphereBg = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: texture,
  });
  sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
  scene.add(sphereBg);
}

function createNucleus(texture) {
  texture.anisotropy = 16;
  let icosahedronGeometry = new THREE.IcosahedronGeometry(30, 10);
  let lambertMaterial = new THREE.MeshPhongMaterial({ map: texture });
  nucleus = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
  scene.add(nucleus);
}

function createStars(texture) {
  let starsGeometry = new THREE.BufferGeometry();
  let positions = new Float32Array(50 * 3);
  let velocities = new Float32Array(50);
  let startPositions = new Float32Array(50 * 3);

  for (let i = 0; i < 50; i++) {
    let particleStar = randomPointSphere(150);
    positions[i * 3] = particleStar.x;
    positions[i * 3 + 1] = particleStar.y;
    positions[i * 3 + 2] = particleStar.z;

    velocities[i] = THREE.MathUtils.randInt(50, 200);

    startPositions[i * 3] = particleStar.x;
    startPositions[i * 3 + 1] = particleStar.y;
    startPositions[i * 3 + 2] = particleStar.z;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
  starsGeometry.setAttribute('startPosition', new THREE.BufferAttribute(startPositions, 3));

  let starsMaterial = new THREE.PointsMaterial({
    size: 5,
    color: "#ffffff",
    transparent: true,
    opacity: 0.8,
    map: texture,
    blending: THREE.AdditiveBlending,
  });
  starsMaterial.depthWrite = false;
  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

function createFixedStars(texture1, texture2, texture4) {
  scene.add(createStarField(texture1, 15, 20));
  scene.add(createStarField(texture2, 5, 5));
  scene.add(createStarField(texture4, 7, 5));
}

function createStarField(texture, size, total) {
  let pointGeometry = new THREE.BufferGeometry();
  let positions = new Float32Array(total * 3);

  for (let i = 0; i < total; i++) {
    let radius = THREE.MathUtils.randInt(149, 70); 
    let particles = randomPointSphere(radius);
    positions[i * 3] = particles.x;
    positions[i * 3 + 1] = particles.y;
    positions[i * 3 + 2] = particles.z;
  }

  pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  let pointMaterial = new THREE.PointsMaterial({
    size: size,
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  });
  return new THREE.Points(pointGeometry, pointMaterial);
}

function animate() {
  requestAnimationFrame(animate);

  if (stars && stars.geometry) {
    let positionsStars = stars.geometry.attributes.position.array;
    let velocitiesStars = stars.geometry.attributes.velocity.array;
    let startPositionsStars = stars.geometry.attributes.startPosition.array;

    for (let i = 0; i < positionsStars.length; i += 3) {
      positionsStars[i] += (0 - positionsStars[i]) / velocitiesStars[i / 3] * starSpeed;
      positionsStars[i + 1] += (0 - positionsStars[i + 1]) / velocitiesStars[i / 3] * starSpeed;
      positionsStars[i + 2] += (0 - positionsStars[i + 2]) / velocitiesStars[i / 3] * starSpeed;

      velocitiesStars[i / 3] -= 0.3;

      if (Math.abs(positionsStars[i]) <= 5 && Math.abs(positionsStars[i + 2]) <= 5) {
        positionsStars[i] = startPositionsStars[i];
        positionsStars[i + 1] = startPositionsStars[i + 1];
        positionsStars[i + 2] = startPositionsStars[i + 2];
        velocitiesStars[i / 3] = THREE.MathUtils.randInt(50, 300);
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

  scene.children.forEach(child => {
    if (child instanceof THREE.Points && child !== stars) {
      child.rotation.y += 0.0009;
    }
  });

  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);

  if (nameParticles) {
    animateNameParticles();
  }
}

function randomPointSphere(radius) {
  let theta = 2 * Math.PI * Math.random();
  let phi = Math.acos(2 * Math.random() - 1);
  let dx = 0 + (radius * Math.sin(phi) * Math.cos(theta));
  let dy = 0 + (radius * Math.sin(phi) * Math.sin(theta));
  let dz = 0 + (radius * Math.cos(phi));
  return new THREE.Vector3(dx, dy, dz);
}

window.addEventListener("resize", () => {
  clearTimeout(timeout_Debounce);
  timeout_Debounce = setTimeout(onWindowResize, 80);
});

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

container.addEventListener('wheel', (event) => {
  event.preventDefault();
  camera.position.z += event.deltaY * 0.1;
  camera.position.z = Math.max(150, Math.min(camera.position.z, 350));
});

function changeStarSpeed(speed) {
  starSpeed = speed;
}

changeStarSpeed(2);

function moveCardToTop() {
  if (!cardMesh) return;

  const startPosition = cardMesh.position.clone();
  const endPosition = new THREE.Vector3(0, 50, 0); // Adjust this value as needed
  const duration = 2000; // 2 seconds
  const startTime = Date.now();

  function animateCardMovement() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);

    cardMesh.position.lerpVectors(startPosition, endPosition, progress);

    if (progress < 1) {
      requestAnimationFrame(animateCardMovement);
    }
  }

  animateCardMovement();
}

function zoomBackground(amount, duration) {
  const startZ = camera.position.z;
  const endZ = startZ * (1 - amount);
  const startTime = Date.now();

  function animate() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    camera.position.z = startZ + (endZ - startZ) * progress;
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  animate();
}

window.startCardSpinAnimation = startCardSpinAnimation;

window.createNameParticles = createNameParticles;

window.zoomBackground = zoomBackground;

window.moveCardToTop = moveCardToTop;

window.updateCardFront = updateCardFront;

window.positionCard = positionCard;