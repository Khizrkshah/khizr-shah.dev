import * as THREE from "three";

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
    camera.position.z = 5;

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
    /*var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);*/

    const geometry = new THREE.SphereGeometry(1, 25, 25);
    const material = new THREE.MeshLambertMaterial({
      color: 0xffdc91,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    var ambientLight = new THREE.AmbientLight(0xffffff, 2);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.castShadow = true;
    spotLight.position.set(0, 64, 32);
    scene.add(spotLight);

    var animate = function () {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      sphere.position.y = Math.sin(window.performance.now() / 1000) / 2;
      renderer.render(scene, camera);
    };
    animate();
  }, []);
  return <canvas id="canvasRef" />;
}

export default ThreejsComponent;
