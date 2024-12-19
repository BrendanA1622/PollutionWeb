import './style.css'
import * as THREE  from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.set(0,0,0);



const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(10);

renderer.render( scene, camera );



const geometry = new THREE.SphereGeometry(6,64,64)

const oxyMat = new THREE.MeshBasicMaterial( {
  map: new THREE.TextureLoader().load('./images/OxygenAtom7.png'),
  // map: new THREE.TextureLoader().load('./images/deep-ocean.jpg'),
  color: 0xFFFFFF
});

oxyMat.toneMapped = false;

const oxygen = new THREE.Mesh( geometry, oxyMat );
oxygen.position.set(0,0,0);
scene.add(oxygen)






const pointLight = new THREE.PointLight(0xffffff,10)
pointLight.position.set(6,6,6)
// scene.add(pointLight)

renderer.outputEncoding = THREE.sRGBEncoding;
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight)



const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)




const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomSpeed = 0.3;
controls.minDistance = 15;
controls.enableZoom = false;
// controls.enableRotate = false;
controls.enablePan = false;



window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})





function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 300 ) );

  star.position.set(x, y, z);
  scene.add(star)
}

Array(500).fill().forEach(addStar)

const newfoundTexture = new THREE.TextureLoader().load('./images/deep-ocean.jpg');
scene.background = newfoundTexture;




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





// Assume you have a reference to the oxygen object and its material
oxygen.material.transparent = true; // Enable transparency

// Set a scroll threshold for fading
const fadeStart = 30; // Start fading at 100 pixels of scroll
const fadeEnd = 60;   // Fully transparent at 300 pixels of scroll



// Size of an oxygen atom in meters
const oxygenAtomSize = .00000000012; // 1.2 angstroms (meters)

const direction = new THREE.Vector3();

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





/////////////////////////////////////////// ANIMATE
function animate() {
    requestAnimationFrame( animate );

    currentTargetY += (scrollTargetY - currentTargetY) * 0.1;

    // camera.position.x += (scrollTargetY - currentTargetY) * 0.1;
    // camera.position.y += (scrollTargetY - currentTargetY) * 0.1;
    // camera.position.z += (scrollTargetY - currentTargetY) * 0.1;

    const zoom_direction = new THREE.Vector3();
    camera.getWorldDirection(zoom_direction);

    // Update the camera position to move along its facing direction
    camera.position.addScaledVector(zoom_direction, (-scrollTargetY + currentTargetY) * 0.1);




    const scrollY = camera.position.distanceTo(oxygen.position);


    blankOxygen2.position.set(Math.max(15, Math.pow(Math.abs(30 - scrollY),2)),0,0);





    // Calculate fade factor (0 = fully visible, 1 = fully transparent)
    let fadeFactor = (scrollY - fadeStart) / (fadeEnd - fadeStart);
    fadeFactor = Math.min(Math.max(fadeFactor, 0), 1); // Clamp between 0 and 1
    // Apply opacity based on fade factor
    oxygen.material.opacity = 1 - fadeFactor;



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
    let deltaZRot = targetZRot - oxygen.rotation.z;
    if (deltaZRot > Math.PI) deltaZRot -= 2 * Math.PI;
    if (deltaZRot < -Math.PI) deltaZRot += 2 * Math.PI;
    oxygen.rotation.z += 0.15 * deltaZRot;
    oxygen.rotation.x = 0.0;



    const distance = camera.position.distanceTo(oxygen.position);
    // Assume 1 unit in the scene = 1 meter in real life
    const scale = distance * oxygenAtomSize * 0.1 * 1.25;
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



    rotationElement.innerText = `Screen height: ${scaleLabel}`;


    controls.update();

    renderer.render( scene, camera );
}

animate()





