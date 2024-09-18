import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { Tween, Group } from "@tweenjs/tween.js";

import { useEffect, useRef } from "react";
import getStarfield from "./Starfield.jsx";

function ThreejsComponent() {
  useEffect(() => {
    // Initialize scene and camera
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near plane
      1000 // Far plane
    );
    camera.position.set(5, 3, 10); // Set initial camera position
    camera.rotateZ(0.5); // Rotate camera
    camera.rotateY(1.3);
    camera.rotateX(0);

    // Get canvas element and create renderer
    const canvas = document.getElementById("canvasRef");
    var renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, // Smooth edges
      alpha: true, // Transparent background
    });

    renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size
    renderer.setClearColor(0xffffff, 0); // Set background color
    renderer.setPixelRatio(window.devicePixelRatio - 0.5); // Adjust for device pixel ratio

    // Handle window resize
    window.addEventListener("resize", onWindowResize);

    function onWindowResize() {
      // Update camera and renderer on window resize
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      bloomComposer.setSize(window.innerWidth, window.innerHeight);
    }

    // Initialize camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true; // Enable auto-rotation
    controls.autoRotateSpeed = 0.6; // Speed of auto-rotation
    controls.update(); // Update controls
    controls.enabled = false; // Disable controls (optional)

    // Create a sphere at the center of the visualizer
    const color = new THREE.Color();
    const hue = THREE.MathUtils.lerp(1, 0.9, 1); // Calculate hue
    color.setHSL(hue, 1, 0.5); // Set color with HSL

    const geometry = new THREE.SphereGeometry(2, 25, 25); // Sphere geometry
    const material = new THREE.MeshStandardMaterial({
      color: color, // Apply color
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere); // Add sphere to scene

    // Define uniforms for shaders
    const uniforms = {
      u_time: { type: "f", value: 0.0 },
      u_frequency: { type: "f", value: 0.0 },
      u_red: { type: "f", value: 0.9 },
      u_green: { type: "f", value: 0 },
      u_blue: { type: "f", value: 1.0 },
    };

    // Define parameters for bloom effect
    const params = {
      red: 1.0,
      green: 1.0,
      blue: 1.0,
      threshold: 0.256,
      strength: 0.23,
      radius: 0.5,
    };

    // Configure bloom effect
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight)
    );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const outputPass = new OutputPass();
    bloomComposer.addPass(outputPass);

    // Vertex and fragment shaders for visualizer object
    const vShader = `
      // Vertex shader code
      uniform float u_time;

      vec3 mod289(vec3 x) { ... }
      vec4 mod289(vec4 x) { ... }
      vec4 permute(vec4 x) { ... }
      vec4 taylorInvSqrt(vec4 r) { ... }
      vec3 fade(vec3 t) { ... }
      float pnoise(vec3 P, vec3 rep) { ... }
      uniform float u_frequency;

      void main() {
        float noise = 4.0 * pnoise(position + u_time, vec3(10.0));
        float displacement = ((u_frequency + 3.0) / 30.0) * ((noise + 1.0) / 10.0);
        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fShader = `
      // Fragment shader code
      uniform float u_red;
      uniform float u_green;
      uniform float u_blue;

      void main() {
        gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 0.3);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vShader,
      fragmentShader: fShader,
      transparent: true, // Enable transparency
    });

    // Create and add the visualizer mesh
    const geo = new THREE.IcosahedronGeometry(3, 60); // Icosahedron geometry
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Add ambient light to the scene
    var ambientLight = new THREE.AmbientLight(0xffffff, 6); // White light
    ambientLight.castShadow = true; // Enable shadows
    scene.add(ambientLight);

    // Set up audio playback
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    const volume = { x: 0 }; // Initial volume
    const tweenUp = new Tween(volume);
    const tweenDown = new Tween(volume);
    const group = new Group();
    group.add(tweenUp);
    group.add(tweenDown);

    const rayCaster = new THREE.Raycaster();

    // Play audio on mesh click
    function onMouseClick(event) {
      const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
      );

      rayCaster.setFromCamera(coords, camera);
      const intersections = rayCaster.intersectObjects(scene.children, true);
      if (intersections.length > 0) {
        console.log(intersections);
        if (intersections[0].object.type == "Mesh") {
          if (sound.isPlaying === false) {
            sound.play();
            // Tween volume up
            tweenUp
              .to({ x: 0.06 }, 1000)
              .onUpdate(function (object) {
                if (isFinite(object.x)) {
                  sound.setVolume(object.x);
                } else {
                  console.error("Non-finite value for volume:", object.x);
                }
              })
              .start();
          } else {
            // Tween volume down
            tweenDown
              .to({ x: 0 }, 1000)
              .onUpdate(function (object) {
                if (isFinite(object.x)) {
                  sound.setVolume(object.x);
                } else {
                  console.error("Non-finite value for volume:", object.x);
                }
              })
              .onComplete(function () {
                sound.pause();
              })
              .start();
          }
        } else {
          console.log("only star clicked");
        }
      }
    }

    // Load and set up audio
    audioLoader.load("./music.mp3", function (buffer) {
      sound.setBuffer(buffer);
      sound.setVolume(0); // Start with volume at 0

      canvas.addEventListener("click", onMouseClick); // Add click event listener
    });

    const analyser = new THREE.AudioAnalyser(sound, 32); // Create audio analyser

    // Create a new THREE.Clock to keep track of elapsed time
    const clock = new THREE.Clock();

    // Create a starfield with 200 stars and add it to the scene
    const stars = getStarfield({ numStars: 200 });
    scene.add(stars);

    // Animation function that continuously updates and renders the scene
    var animate = function () {
      // Request the next frame to animate continuously
      requestAnimationFrame(animate);

      // Update the tween animations in the group
      group.update();

      // Update the 'u_time' uniform with the elapsed time since the clock started
      uniforms.u_time.value = clock.getElapsedTime();

      // Update the 'u_frequency' uniform with the average frequency from the audio analyser
      uniforms.u_frequency.value = analyser.getAverageFrequency();

      // Update the camera controls (like auto-rotation)
      controls.update();

      // Render the scene with bloom effects applied
      bloomComposer.render();
    };

    // Start the animation loop
    animate();
  }, []);

  // Return a canvas element where the Three.js scene will be rendered
  return <canvas id="canvasRef" />;
}

// Export the ThreejsComponent to be used in other parts of the application
export default ThreejsComponent;
