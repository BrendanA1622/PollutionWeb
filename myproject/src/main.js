import './style.css'
import * as THREE  from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,0);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'),});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(10);
renderer.render( scene, camera );


////////////// MAKING O ATOMS
const geometry = new THREE.SphereGeometry(6,64,64)
const oxyMat = new THREE.MeshBasicMaterial( {
  map: new THREE.TextureLoader().load('./images/OxygenAtom7.png'),
  color: 0xFFFFFF
});
oxyMat.toneMapped = false;
const oxygen = new THREE.Mesh( geometry, oxyMat );
oxygen.position.set(0,0,0);
scene.add(oxygen)
const oxygen2 = new THREE.Mesh( geometry, oxyMat );
oxygen2.position.set(100,0,0);
scene.add(oxygen2)

////////////// MAKING BLANK O
const blankGeometry = new THREE.SphereGeometry(5.99,64,64)
const blankOxyMat = new THREE.MeshBasicMaterial( {
  color: 0xff4747
});
blankOxyMat.toneMapped = false;
const blankOxygen = new THREE.Mesh( blankGeometry, blankOxyMat );
blankOxygen.position.set(0,0,0);
scene.add(blankOxygen)
const blankOxygen2 = new THREE.Mesh( blankGeometry, blankOxyMat );
blankOxygen2.position.set(100,0,0);  
scene.add(blankOxygen2)

/////////////// BONDS FORMED
const bondGeometry = new THREE.CylinderGeometry(1.0,1.0,6.0,12,12)
const bondMat = new THREE.MeshBasicMaterial( {
  color: 0xff4747
});
const sigmaBond = new THREE.Mesh( bondGeometry, bondMat );
sigmaBond.rotateZ(Math.PI/2.0);
sigmaBond.position.y = 1.7;
const piBond = new THREE.Mesh( bondGeometry, bondMat );
piBond.rotateZ(Math.PI/2.0);
piBond.position.y = -1.7;
scene.add(sigmaBond, piBond)

/////////////// Displaying O2 Molecule Panel
const o2texture = new THREE.TextureLoader().load('./images/OxygenMoleculeDescriptor.png');
const o2geometry = new THREE.PlaneGeometry(24, 18); // Adjust size as needed
const o2material = new THREE.MeshBasicMaterial({ map: o2texture, transparent: true, opacity: 0.0 });
const o2panel = new THREE.Mesh(o2geometry, o2material);
o2panel.position.y = 10.0;
scene.add(o2panel);


////////////////////////// WATER 3D MODEL /////////////////////////
const loader = new GLTFLoader();

loader.load('./blenderModels/water3.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  model.position.set(0, 0, 0);
  model.scale.set(6.0, 6.0, 6.0);
}, undefined, (error) => {
    console.error('Error loading the model:', error);
});




const centerPoint = new THREE.PointLight(0xffffff,10)
centerPoint.position.set(0,0,0)
// scene.add(pointLight)

renderer.outputEncoding = THREE.sRGBEncoding;
const ambientLight = new THREE.AmbientLight(0xffffff, 4.9);
scene.add(ambientLight)



const lightHelper = new THREE.PointLightHelper(centerPoint)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)




const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 15;
controls.enableZoom = false;
// controls.zoomSpeed = 0.3;
// controls.enableRotate = false;
controls.enablePan = false;



window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})




const stars = [];
const explodeAzimuth = [];
const explodePolar = [];
function addStar() {
  const geometryS = new THREE.SphereGeometry(0.3, 12, 12);
  const materialS = new THREE.MeshBasicMaterial( { color: 0xfff671, opacity: 1.0, transparent: true });
  // const material = new THREE.MeshStandardMaterial( { color: 0xFFFFFF });
  const star = new THREE.Mesh( geometryS, materialS );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 300 ) );

  star.position.set(0, 0, 0);
  explodeAzimuth.push(Math.random() * (Math.PI * 2));
  explodePolar.push(Math.random() * (Math.PI * 2));
  stars.push(star);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const newfoundTexture = new THREE.TextureLoader().load('./images/deep-ocean.jpg');
scene.background = newfoundTexture;






// Assume you have a reference to the oxygen object and its material
oxygen.material.transparent = true; // Enable transparency

// Set a scroll threshold for fading
const fadeStart = 28; // Start fading at 100 pixels of scroll
const fadeEnd = 35;   // Fully transparent at 300 pixels of scroll



// Size of an oxygen atom in meters
const oxygenAtomSize = .00000000012; // 1.2 angstroms (meters)

const direction = new THREE.Vector3();
const direction2 = new THREE.Vector3();

const rotationElement = document.getElementById('camera-rotation');



/////////////////////////////////////////////////////////////////////////// GPT SCROLL CODE

controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enableRotate = true; // Rotation is enabled

// Track scroll
window.addEventListener('wheel', onScroll);

// // Resize event
// window.addEventListener('resize', onWindowResize);

// Smooth scroll variables
let scrollTargetY = controls.target.y; // Initial target Y
let currentTargetY = controls.target.y; // Current interpolated Y

function onScroll(event) {
  // Adjust the target based on scroll delta
  scrollTargetY += event.deltaY * 0.01; // Scale down the delta for smoother scrolling
  scrollTargetY = Math.max(-1000, Math.min(1000, scrollTargetY)); // Clamp to a range
}


function createVectorFromAngles(theta, phi, radius = 1) {
  // Convert spherical coordinates to Cartesian coordinates
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  // Create and return the Vector3
  return new THREE.Vector3(x, y, z);
}







/////////////////////////////////////////// ANIMATE
function animate() {
    requestAnimationFrame( animate );
    const scrollY = camera.position.distanceTo(centerPoint.position);
    currentTargetY += (scrollTargetY - currentTargetY) * 0.1;

    o2panel.lookAt(camera.position);

    ////////// MOVING BOND ENERGY PARTICLES  ////////////////
    if ( scrollY > 27.1 && scrollY < 45.0) {
      var i = 0;
      stars.forEach((star) => {
        star.material.opacity = (45.0 - scrollY) / (45.0 - 27.1);
        // var explodeAzimuth = (i * 2.0 * Math.PI) / 50.0;
        // var explodePolar = (Math.random() - 0.5) * (Math.PI / 4);
        const explodeVector = createVectorFromAngles(explodePolar[i], explodeAzimuth[i]);
        // const explodeVector = createVectorFromAngles(0.0, 0.0);
        star.position.x = explodeVector.x * (scrollY - 27.1) * 10.0;
        star.position.y = explodeVector.y * (scrollY - 27.1) * 10.0;
        star.position.z = explodeVector.z * (scrollY - 27.1) * 10.0;
        // star.position.addScaledVector(explodeVector, 1.0);

        i += 1;
      });
    }

    

    // camera.position.x += (scrollTargetY - currentTargetY) * 0.1;
    // camera.position.y += (scrollTargetY - currentTargetY) * 0.1;
    // camera.position.z += (scrollTargetY - currentTargetY) * 0.1;

    const zoom_direction = new THREE.Vector3();
    camera.getWorldDirection(zoom_direction);

    // Update the camera position to move along its facing direction
    camera.position.addScaledVector(zoom_direction, (-scrollTargetY + currentTargetY) * 0.1 * (Math.log(scrollY + 1.0) - 2.0));




    

    let targetOxy, targetOxy2;
    if (scrollY < 30) {
      oxygen2.position.set(Math.max(7.5, Math.pow(Math.abs(30 - scrollY),2)),0,0);
      blankOxygen2.position.set(Math.max(7.5, Math.pow(Math.abs(30 - scrollY),2)),0,0);
      if (Math.pow(Math.abs(30 - scrollY),2) < 7.5) {
        targetOxy = -7.5;
        // targetOxy2 = 7.5;
      } else {
        targetOxy = 0.0;
      }
      oxygen.position.x += (targetOxy - oxygen.position.x) * 0.1;
      blankOxygen.position.x = oxygen.position.x;
    } else {
      targetOxy = -7.5;
      oxygen.position.x += (targetOxy - oxygen.position.x) * 0.1;
      blankOxygen.position.x = oxygen.position.x;
    }

    // oxygen2.position.x += (targetOxy2 - oxygen2.position.x) * 0.1;
    // blankOxygen2.position.x = oxygen2.position.x;

    





    // Calculate fade factor (0 = fully visible, 1 = fully transparent)
    let fadeFactor = (scrollY - fadeStart) / (fadeEnd - fadeStart);
    fadeFactor = Math.min(Math.max(fadeFactor, 0), 1); // Clamp between 0 and 1
    // Apply opacity based on fade factor
    oxygen.material.opacity = 1 - fadeFactor;
    oxygen2.material.opacity = 1 - fadeFactor;
    o2panel.material.opacity = fadeFactor;



    /////////// ALL THE CODE FOR ROTATING OXYGEN /////////////
    direction.subVectors(camera.position, oxygen.position);
    direction.normalize();
    const angle = Math.atan2(direction.z, direction.x);
    var targetYRot = -angle;
    var targetZRot = direction.y;
    let deltaYRot = targetYRot - oxygen.rotation.y;
    if (deltaYRot > Math.PI) deltaYRot -= 2 * Math.PI;
    if (deltaYRot < -Math.PI) deltaYRot += 2 * Math.PI;
    oxygen.rotation.y += 0.15 * deltaYRot;

    direction2.subVectors(camera.position, oxygen2.position);
    direction2.normalize();
    const angle2 = Math.atan2(direction2.z, direction2.x);
    var targetYRot2 = -angle2;
    var targetZRot2 = direction2.y;
    let deltaYRot2 = targetYRot2 - oxygen2.rotation.y;
    if (deltaYRot2 > Math.PI) deltaYRot2 -= 2 * Math.PI;
    if (deltaYRot2 < -Math.PI) deltaYRot2 += 2 * Math.PI;
    oxygen2.rotation.y += 0.15 * deltaYRot2;

    let deltaZRot = targetZRot - oxygen.rotation.z;
    if (deltaZRot > Math.PI) deltaZRot -= 2 * Math.PI;
    if (deltaZRot < -Math.PI) deltaZRot += 2 * Math.PI;
    oxygen.rotation.z += 0.15 * deltaZRot;

    let deltaZRot2 = targetZRot2 - oxygen2.rotation.z;
    if (deltaZRot2 > Math.PI) deltaZRot2 -= 2 * Math.PI;
    if (deltaZRot2 < -Math.PI) deltaZRot2 += 2 * Math.PI;
    oxygen2.rotation.z += 0.15 * deltaZRot2;

    oxygen.rotation.x = 0.0;
    oxygen2.rotation.x = 0.0;



    const distance = camera.position.distanceTo(centerPoint.position);
    // Assume 1 unit in the scene = 1 meter in real life
    const scale = distance * oxygenAtomSize * 0.125;
    // Format the scale as a human-readable string
    let scaleLabel;
    if (scale < 1e-9) {
        scaleLabel = `${(scale * 1e12).toFixed(2)} pm (picometers)`;
    } else if (scale < 1e-6) {
        scaleLabel = `${(scale * 1e9).toFixed(2)} nm (nanometers)`;
    } else if (scale < 1e-3) {
        scaleLabel = `${(scale * 1e6).toFixed(2)} µm (micrometers)`;
    } else {
        scaleLabel = `${scale.toFixed(2)} m (meters)`;
    }


    // scale = 10.0 * Math.log(scrollY + 1.0);

    // rotationElement.innerText = `Screen height: ${scaleLabel}`;
    rotationElement.innerText = `ScrollY: ${Math.log(scrollY + 1.0).toFixed(2)}`;


    controls.update();

    renderer.render( scene, camera );
}

animate()





