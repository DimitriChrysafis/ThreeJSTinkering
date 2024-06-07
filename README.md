# 🎲 Falling Cubes with Three.js
this is a fun little 3D scene created with Three.js where colorful cubes fall from the sky, bounce off the floor, and spin around. 
![](example.gif)

## 🛠️ How It Works

### Setting Up the Scene
created a camera with a nice wide view and position it to see the whole scene:
```javascript
camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 5000;
```
