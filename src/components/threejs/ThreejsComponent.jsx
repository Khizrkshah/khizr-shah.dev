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
    renderer.setPixelRatio(window.devicePixelRatio - 1); // Adjust for device pixel ratio

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
      threshold: 0.1,
      strength: 0.3,
      radius: 0.2,
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

      vec3 mod289(vec3 x)
      {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec4 mod289(vec4 x)
      {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec4 permute(vec4 x)
      {
        return mod289(((x*34.0)+10.0)*x);
      }
      
      vec4 taylorInvSqrt(vec4 r)
      {
        return 1.79284291400159 - 0.85373472095314 * r;
      }
      
      vec3 fade(vec3 t) {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
      }

      // Classic Perlin noise, periodic variant
      float pnoise(vec3 P, vec3 rep)
      {
        vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
        vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
        Pi0 = mod289(Pi0);
        Pi1 = mod289(Pi1);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 * (1.0 / 7.0);
        vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 * (1.0 / 7.0);
        vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
        return 2.2 * n_xyz;
      }

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
      sound.setVolume(0.4); // Start with volume at 0
      sound.setLoop(true);

      canvas.addEventListener("click", onMouseClick); // Add click event listener
    });

    const analyser = new THREE.AudioAnalyser(sound, 32); // Create audio analyser

    // Create a new THREE.Clock to keep track of elapsed time
    const clock = new THREE.Clock();

    // Create a starfield with 100 stars and add it to the scene
    const stars = getStarfield({ numStars: 100 });
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

    // Also handle the page focus and blur events
    window.addEventListener("focus", () => {
      listener.context
        .resume()
        .then(() => {
          if (isAudioResumed) {
            // Reset uniforms
            uniforms.u_time.value = 0.0;
            uniforms.u_frequency.value = analyser.getAverageFrequency();
          }
        })
        .catch((err) => {
          console.error("Error resuming audio context on focus:", err);
        });
    });

    window.addEventListener("blur", () => {
      if (sound.isPlaying) {
        sound.stop(); // Stop the sound when the window loses focus
        listener.context.suspend(); // Suspend the audio context

        // Reset uniforms
        uniforms.u_time.value = 0.0;
        uniforms.u_frequency.value = 0.0;
      }
    });
  }, []);

  // Return a canvas element where the Three.js scene will be rendered
  return <canvas id="canvasRef" />;
}

// Export the ThreejsComponent to be used in other parts of the application
export default ThreejsComponent;
