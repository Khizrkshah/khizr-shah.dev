import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useEffect, useRef } from "react";

function ThreejsComponent() {
  /*const refContainer = useRef();*/
  useEffect(() => {
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 2);
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
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body

    window.addEventListener("resize", onWindowResize);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.update();

    var boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    var boxMaterial = new THREE.MeshLambertMaterial({
      color: 0xffdc91,
      wireframe: true,
    });
    var cube = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(cube);

    const color = new THREE.Color();
    const hue = THREE.MathUtils.lerp(0.6, 0.5, 1); // Calculate hue
    color.setHSL(hue, 1, 0.5);

    const geometry = new THREE.SphereGeometry(1, 25, 25);
    const material = new THREE.MeshStandardMaterial({
      color: color,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff, 10);
    spotLight.castShadow = true;
    spotLight.position.set(0, 0, 4);
    scene.add(spotLight);

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    var animate = function () {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      //sphere.position.y = Math.sin(window.performance.now() / 1000) / 2;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, []);
  return <canvas id="canvasRef" />;
}

export default ThreejsComponent;
