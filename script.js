let userCameraP, totalScene, finalRenderer;
let allCubes = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let light;

init();
animate();

function init() {
    /*
    70 degree view and an aspect ratio to fit screen
     */
    userCameraP = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    userCameraP.position.z = 5000;
    // For a different POV:
    // userCameraP.position.y = 1000;
    totalScene = new THREE.Scene();

    // floor maker material/geometry
    const GeoFloor = new THREE.PlaneGeometry(10000, 10000);
    const GeoMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const FinalFloor = new THREE.Mesh(GeoFloor, GeoMat);
    /*
    Line below rotates base to be on the ground not as a wall
    && pushed 1000 down to be a floor not a ceiling
     */
    FinalFloor.rotation.x = Math.PI / 2;
    FinalFloor.position.y = -1000;
    FinalFloor.receiveShadow = true;
    totalScene.add(FinalFloor);

    // make a cube geometry
    const boxGeometry = new THREE.BoxGeometry(200, 200, 200);

    // cubes must be random colors/starting heights, random rotation speeds, etc.
    for (let i = 0; i < 120; i++) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        const color = RandomColorMaker();
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);


        const CubeText = new THREE.CanvasTexture(canvas);
        const CubeMat = new THREE.MeshStandardMaterial({ map: CubeText });
        const FinalCube = new THREE.Mesh(boxGeometry, CubeMat);


        FinalCube.position.x = Math.random() * 8000 - 4000;
        FinalCube.position.y = Math.random() * 4000;
        FinalCube.position.z = Math.random() * 8000 - 4000;
        FinalCube.castShadow = true;
        totalScene.add(FinalCube);

        // add the cube to the cubes array with rotation speed and velocityY
        allCubes.push({ mesh: FinalCube, rotationSpeed: Math.random() * 0.05 - 0.025, color: color, velocityY: 0 });
    }

    // light source
    light = new THREE.DirectionalLight(0xffffff, 1);
    // light position
    light.position.set(0, 4000, 2000);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    totalScene.add(light);

    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 10000;
    light.shadow.camera.left = -5000;
    light.shadow.camera.right = 5000;
    light.shadow.camera.top = 5000;
    light.shadow.camera.bottom = -5000;

    totalScene.add(new THREE.AmbientLight(0x404040));

    finalRenderer = new THREE.WebGLRenderer({ antialias: true });
    finalRenderer.setSize(window.innerWidth, window.innerHeight);
    finalRenderer.shadowMap.enabled = true;
    document.body.appendChild(finalRenderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function RandomColorMaker() {
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

    userCameraP.aspect = window.innerWidth / window.innerHeight;
    userCameraP.updateProjectionMatrix();

    finalRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    for (let i = 0; i < allCubes.length; i++) {
        const cube = allCubes[i].mesh;
        /*
        gravity effect
         ## -> speed ## cubes[i].velocityY -= 0.1;
         */
        allCubes[i].velocityY -= 0.1;
        cube.position.y += allCubes[i].velocityY;

        /*
        if( hits floor){
            reverse velocity with some energy loss for bounce effect
            - cubes[i].velocityY *= -0.8;
        }
         */
        if (cube.position.y < -800) {
            cube.position.y = -800;
            allCubes[i].velocityY *= -0.8;
        }

        // cube spinny spin
        cube.rotation.x += allCubes[i].rotationSpeed;
        cube.rotation.y += allCubes[i].rotationSpeed;
    }

    render();
}

function render() {
    finalRenderer.render(totalScene, userCameraP);
}
