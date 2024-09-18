import * as THREE from "three";

// Function to generate a starfield with a given number of stars
export default function getStarfield({ numStars = 500 } = {}) {
  // Function to generate a random point on the surface of a sphere
  function randomSpherePoint() {
    // Random radius between 25 and 50 units
    const radius = Math.random() * 25 + 25;
    // Random values for spherical coordinates
    const u = Math.random();
    const v = Math.random();
    // Calculate spherical coordinates
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    // Convert spherical coordinates to Cartesian coordinates
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    // Return the position and color information
    return {
      pos: new THREE.Vector3(x, y, z), // Position vector in 3D space
      hue: 0.6, // Fixed hue value for color
      minDist: radius, // Minimum distance from the center (for potential use)
    };
  }

  // Arrays to hold vertex positions and colors
  const verts = [];
  const colors = [];
  const positions = [];
  let col;

  // Generate star data
  for (let i = 0; i < numStars; i += 1) {
    // Get a random star position and color
    let p = randomSpherePoint();
    const { pos, hue } = p;
    // Store the star's position and color
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random()); // Create a color with random lightness
    verts.push(pos.x, pos.y, pos.z); // Add position to vertices array
    colors.push(col.r, col.g, col.b); // Add color to colors array
  }

  // Create a new buffer geometry
  const geo = new THREE.BufferGeometry();
  // Set the position attribute of the geometry
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  // Set the color attribute of the geometry
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  // Create a material for the points
  const mat = new THREE.PointsMaterial({
    size: 0.2, // Size of each point
    vertexColors: true, // Use vertex colors for each point
    map: new THREE.TextureLoader().load("./disc.png"), // Texture for the points
  });

  // Create the points object with geometry and material
  const points = new THREE.Points(geo, mat);

  // Return the points object
  return points;
}
