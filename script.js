let camera, scene, renderer;
let cubes = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let light;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 5000;

    scene = new THREE.Scene();

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(10000, 10000);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -1000;
    floor.receiveShadow = true;
    scene.add(floor);

    const geometry = new THREE.BoxGeometry(200, 200, 200);

    for (let i = 0; i < 12; i++) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        const color = getRandomColor();
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = Math.random() * 8000 - 4000;
        cube.position.y = Math.random() * 4000;
        cube.position.z = Math.random() * 8000 - 4000;
        cube.castShadow = true;
        scene.add(cube);
        cubes.push({ mesh: cube, rotationSpeed: Math.random() * 0.05 - 0.025, color: color, velocityY: 0 });
    }

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 4000, 2000); // Fixed position for the light
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 10000;
    light.shadow.camera.left = -5000;
    light.shadow.camera.right = 5000;
    light.shadow.camera.top = 5000;
    light.shadow.camera.bottom = -5000;

    scene.add(new THREE.AmbientLight(0x404040));

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < cubes.length; i++) {
        const cube = cubes[i].mesh;

        // Apply gravity
        cubes[i].velocityY -= 0.1;
        cube.position.y += cubes[i].velocityY;

        // Check collision with the floor
        if (cube.position.y < -800) {
            cube.position.y = -800; // Bounce off the floor
            cubes[i].velocityY *= -0.8; // Reverse velocity with some loss
        }

        // Add rotation to the cubes
        cube.rotation.x += cubes[i].rotationSpeed;
        cube.rotation.y += cubes[i].rotationSpeed;
    }

    render();
}

function render() {
    renderer.render(scene, camera);
}
