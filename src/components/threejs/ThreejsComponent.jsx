import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//import { GUI } from "dat.gui";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { Tween, Group } from "@tweenjs/tween.js";

import { useEffect, useRef } from "react";
import getStarfield from "./Starfield.jsx";

function ThreejsComponent() {
  useEffect(() => {
    //THREE.JS CODE START.
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 10);
    camera.rotateZ(0.5);
    camera.rotateY(1.3);
    camera.rotateX(0);

    const canvas = document.getElementById("canvasRef");
    var renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio - 0.5);

    //Resize window handler
    window.addEventListener("resize", onWindowResize);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      bloomComposer.setSize(window.innerWidth, window.innerHeight);
    }

    //Camera controls.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.update();
    controls.enabled = false;

    //Settings for Sphere object at the center of the Visualiser.
    const color = new THREE.Color();
    const hue = THREE.MathUtils.lerp(1, 0.9, 1); // Calculate hue
    color.setHSL(hue, 1, 0.5);

    const geometry = new THREE.SphereGeometry(2, 25, 25);
    const material = new THREE.MeshStandardMaterial({
      color: color,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    //uniforms for the visualiser object.
    const uniforms = {
      u_time: { type: "f", value: 0.0 },
      u_frequency: { type: "f", value: 0.0 },
      u_red: { type: "f", value: 0.9 },
      u_green: { type: "f", value: 0 },
      u_blue: { type: "f", value: 1.0 },
    };

    //Color and Bloom Controls for the Visualiser object
    const params = {
      red: 1.0,
      green: 1.0,
      blue: 1.0,
      threshold: 0.256,
      strength: 0.23,
      radius: 0.5,
    };

    //Settings for Bloom on Visualiser object.
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

    //VertexShader and FragmentShader settings for visualiser object.
    const vShader = `
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

      void main(){
       float noise = 4.0 * pnoise(position + u_time, vec3(10.0));
       float displacement = ((u_frequency + 3.0)/30.0 ) * ((noise + 1.0) / 10.0);
       vec3 newPosition = position + normal * displacement;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      
       }`;

    const fShader = `
    uniform float u_red;
    uniform float u_green;
    uniform float u_blue;

    void main(){

     gl_FragColor = vec4(vec3(u_red,u_green,u_blue),0.3);
    
    }`;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vShader,
      fragmentShader: fShader,
      transparent: true,
    });

    //Settings for Visualiser mesh object.
    const geo = new THREE.IcosahedronGeometry(3, 60);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    //mesh.material.wireframe = true;

    //AmbientLight settings.
    var ambientLight = new THREE.AmbientLight(0xffffff, 6);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    //Settings for Audio playback.
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    const volume = { x: 0 };
    const tweenUp = new Tween(volume);
    const tweenDown = new Tween(volume);
    const group = new Group();
    group.add(tweenUp);
    group.add(tweenDown);

    const rayCaster = new THREE.Raycaster();

    //Used to make sure the audio only plays when the visualiser object is clicked on.
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
          if (sound.isPlaying == false) {
            sound.play();
            // Tween the volume up (from 0 to 0.06)
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
            // Tween the volume down (from 0.06 to 0)
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

    //AudioLoader Loading the music file.
    audioLoader.load("./music.mp3", function (buffer) {
      sound.setBuffer(buffer);
      sound.setVolume(0); // Start with volume at 0

      window.addEventListener("click", onMouseClick);
    });
    const analyser = new THREE.AudioAnalyser(sound, 32);

    //GUI helper and Axes helper to see orientation.
    /*
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);
    
    const gui = new GUI();

    const colorsFolder = gui.addFolder("Colors");
    colorsFolder.add(params, "red", 0, 1).onChange(function (value) {
      uniforms.u_red.value = Number(value);
    });
    colorsFolder.add(params, "green", 0, 1).onChange(function (value) {
      uniforms.u_green.value = Number(value);
    });
    colorsFolder.add(params, "blue", 0, 1).onChange(function (value) {
      uniforms.u_blue.value = Number(value);
    });

    const bloomFolder = gui.addFolder("Bloom");
    bloomFolder.add(params, "threshold", 0, 1).onChange(function (value) {
      bloomPass.threshold = Number(value);
    });
    bloomFolder.add(params, "strength", 0, 1).onChange(function (value) {
      bloomPass.strength = Number(value);
    });
    bloomFolder.add(params, "radius", 0, 1).onChange(function (value) {
      bloomPass.radius = Number(value);
    });
    */

    const clock = new THREE.Clock();

    const stars = getStarfield({ numStars: 200 });
    scene.add(stars);

    //animate function.
    var animate = function () {
      requestAnimationFrame(animate);
      group.update();
      uniforms.u_time.value = clock.getElapsedTime();
      uniforms.u_frequency.value = analyser.getAverageFrequency();
      controls.update();
      //renderer.render(scene, camera);
      bloomComposer.render();
    };
    animate();
  }, []);
  return <canvas id="canvasRef" />;
}

export default ThreejsComponent;
