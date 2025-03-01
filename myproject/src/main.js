import './style.css'
import * as THREE  from 'three';
import seedrandom from 'seedrandom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';

let GlobalScale = 1.0;

let playedGcAnim = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
let pgcaa1 = [];
let pgcaa2 = [];
let pgcaa3,pgcaa4,pgcaa5,pgcaa6,pgcaa7,pgcaa8,pgcaa9,pgcaa10,pgcaa11,pgcaa12,pgcaa13 = [];
let pgcaActions = [pgcaa1,pgcaa2,pgcaa3,pgcaa4,pgcaa5,pgcaa6,pgcaa7,pgcaa8,pgcaa9,pgcaa10,pgcaa11,pgcaa12,pgcaa13];
let pgcaa1m,pgcaa2m,pgcaa3m,pgcaa4m,pgcaa5m,pgcaa6m,pgcaa7m,pgcaa8m,pgcaa9m,pgcaa10m,pgcaa11m,pgcaa12m,pgcaa13m;
let pgcaModels = [pgcaa1m,pgcaa2m,pgcaa3m,pgcaa4m,pgcaa5m,pgcaa6m,pgcaa7m,pgcaa8m,pgcaa9m,pgcaa10m,pgcaa11m,pgcaa12m,pgcaa13m];
let pmixer1,pmixer2,pmixer3,pmixer4,pmixer5,pmixer6,pmixer7,pmixer8,pmixer9,pmixer10,pmixer11,pmixer12,pmixer13;
let pgcaMixers = [pmixer1,pmixer2,pmixer3,pmixer4,pmixer5,pmixer6,pmixer7,pmixer8,pmixer9,pmixer10,pmixer11,pmixer12,pmixer13];
const GCA_DELAY = 2400.0;







let scrollY = 0.0;
let mixer, animationAction;
let gcactions = [];
const clock = new THREE.Clock();
const button = document.getElementById("play-button");
const resetButton = document.createElement("button"); // Create a Reset button
resetButton.innerText = "Reset";
resetButton.id = "reset-button";
resetButton.style.display = "none";
document.body.appendChild(resetButton);
const container = document.getElementById("scene-container");
const scene = new THREE.Scene();

let gcaModel;
const debugObject = new THREE.Object3D();

function setModelOpacity(model, opacity, wantOpaque) {
  if (opacity < 0.01) {
    scene.remove(model);
  } else {
    scene.add(model);
  }
  model.traverse((child) => {
      if (child.isMesh && child.material) {
        if (opacity < 0.98) {
          child.material.transparent = true; // Enable transparency
          child.material.opacity = opacity;
        } else if (wantOpaque) {
          child.material.transparent = false;
          child.material.opacity = 1.0;
        } else {
          child.material.transparent = true; // Enable transparency
          child.material.opacity = opacity;
        }
      }
  });
}


button.addEventListener("click", () => {
  // Hide the button
  button.style.display = "none";
  resetButton.style.display = "block";
  // Create the canvas element
  const canvas = document.createElement("canvas");
  canvas.id = "bg";
  container.appendChild(canvas);

  const seed = 'random-gibberis'; // Locked in for glucose explosion!!!!
  const rng = seedrandom(seed);
  Math.random = rng;
  console.log(Math.random());
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 3.0, 10000000000 );
  camera.position.set(0,0,0);
  const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'), logarithmicDepthBuffer: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.position.setZ(10);
  renderer.render( scene, camera );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  

  //////////////////////////////////////// GLUCOSE ANIMATION  ///////////////////////////////////
  const gcaloader = new GLTFLoader();
  gcaloader.load('./blenderModels/breakGlucoseAnim1.glb', (gltf) => {
    gcaModel = gltf.scene;
    scene.add(gcaModel);
    gcaModel.scale.set(5.9, 5.9, 5.9);
    // gcaModel.position.set(-30,10,-130);
    gcaModel.position.set(linterpolate(scrollY,105,73.50,180,42.30), linterpolate(scrollY,105,-56.10,180,29.70), linterpolate(scrollY,105,-242.40,180,5.70));
    gcaModel.rotation.set(linterpolate(scrollY,105,-0.72,180,-0.67), linterpolate(scrollY,105,3.90,2.78,42.30), linterpolate(scrollY,105,0.23,180,-0.12));
    // gcaModel.position.set(debugObject.position.x, debugObject.position.y, debugObject.position.z);
    // gcaModel.rotation.set(debugObject.rotation.x, debugObject.rotation.y, debugObject.rotation.z);


    // Set up the animation mixer
    // mixer = new AnimationMixer(gcaModel);
    mixer = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      gcactions.push({ action, clip });
    });
    setModelOpacity(gcaModel, 0.0,true);
  });

  /////////////// Displaying Glucose Molecule Panel
  const gctexture = new THREE.TextureLoader().load('./images/GlucoseMoleculeDescriptor.png');
  const gcgeometry = new THREE.PlaneGeometry(180, 43.2075); // Adjust size as needed
  const gcmaterial = new THREE.MeshBasicMaterial({ map: gctexture, transparent: true, opacity: 0.0 });
  const gcpanel = new THREE.Mesh(gcgeometry, gcmaterial);
  scene.add(gcpanel);

  /////////////// Displaying Reaction Panel
  const combtexture = new THREE.TextureLoader().load('./images/CombustionReaction1.png');
  const combgeometry = new THREE.PlaneGeometry(320, 240); // Adjust size as needed
  const combmaterial = new THREE.MeshBasicMaterial({ map: combtexture, transparent: true, opacity: 0.0 });
  const combpanel = new THREE.Mesh(combgeometry, combmaterial);
  scene.add(combpanel);



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
  const o2geometry = new THREE.PlaneGeometry(28, 21); // Adjust size as needed
  const o2material = new THREE.MeshBasicMaterial({ map: o2texture, transparent: true, opacity: 0.0 });
  const o2panel = new THREE.Mesh(o2geometry, o2material);
  o2panel.position.y = 10.0;
  scene.add(o2panel);


  ////////////////////////// WATER 3D MODEL /////////////////////////
  const loader = new GLTFLoader();

  const h2o1Pos = new THREE.Object3D();
  h2o1Pos.position.set(-100, 30, -60);
  h2o1Pos.rotation.set(Math.random() * (Math.PI * 2), Math.random() * (Math.PI * 2), Math.random() * (Math.PI * 2));
  let h2omodel;
  loader.load('./blenderModels/water3.glb', (gltf) => { 
    h2omodel = gltf.scene;
    scene.add(h2omodel);
    h2omodel.position.set(h2o1Pos.position.x, h2o1Pos.position.y, h2o1Pos.position.z);
    h2omodel.rotation.set(h2o1Pos.rotation.x, h2o1Pos.rotation.y, h2o1Pos.rotation.z);
    h2omodel.scale.set(5.9, 5.9, 5.9);
  }, undefined, (error) => {
      console.error('Error loading the model:', error);
  });

  /////////////// Displaying H2O Molecule Panel
  const h2otexture = new THREE.TextureLoader().load('./images/H2OMoleculeDescriptor.png');
  const h2ogeometry = new THREE.PlaneGeometry(32, 24); // Adjust size as needed
  const h2omaterial = new THREE.MeshBasicMaterial({ map: h2otexture, transparent: true, opacity: 0.0 });
  const h2opanel = new THREE.Mesh(h2ogeometry, h2omaterial);
  h2opanel.position.y = h2o1Pos.position.y + 12.0;
  h2opanel.position.x = h2o1Pos.position.x;
  h2opanel.position.z = h2o1Pos.position.z;
  scene.add(h2opanel);




  ////////////////////////// CO2 3D MODEL /////////////////////////
  const cd1Pos = new THREE.Object3D();
  cd1Pos.position.set(100, -60, -20);
  cd1Pos.rotation.set(Math.random() * (Math.PI * 2), Math.random() * (Math.PI * 2), Math.random() * (Math.PI * 2));
  let co2model;
  loader.load('./blenderModels/carbonDioxide.glb', (gltf) => { 
    co2model = gltf.scene;
    scene.add(co2model);
    co2model.position.set(cd1Pos.position.x, cd1Pos.position.y, cd1Pos.position.z);
    co2model.rotation.set(cd1Pos.rotation.x, cd1Pos.rotation.y, cd1Pos.rotation.z);
    co2model.scale.set(5.9, 5.9, 5.9);
  }, undefined, (error) => {
      console.error('Error loading the model:', error);
  });

  /////////////// Displaying CO2 Molecule Panel
  const co2texture = new THREE.TextureLoader().load('./images/CO2MoleculeDescriptor.png');
  const co2geometry = new THREE.PlaneGeometry(40, 30); // Adjust size as needed
  const co2material = new THREE.MeshBasicMaterial({ map: co2texture, transparent: true, opacity: 0.0 });
  const co2panel = new THREE.Mesh(co2geometry, co2material);
  co2panel.position.y = cd1Pos.position.y + 12.0;
  co2panel.position.x = cd1Pos.position.x;
  co2panel.position.z = cd1Pos.position.z;
  scene.add(co2panel);


  // //////////////////////////////////////// LOAD ATP SYNTHASE  ///////////////////////////////////
  // const atpSynthase = new THREE.Object3D();
  // atpSynthase.position.set(0, 0, 0);
  // atpSynthase.rotation.set(0, 0, 0);
  // let atpSynthaseModel;
  // loader.load('./blenderModels/atpSynthaseColor.glb', (gltf) => { 
  //   atpSynthaseModel = gltf.scene;
  //   scene.add(atpSynthaseModel);
  //   atpSynthaseModel.position.set(atpSynthase.position.x, atpSynthase.position.y, atpSynthase.position.z);
  //   atpSynthaseModel.rotation.set(atpSynthase.rotation.x, atpSynthase.rotation.y, atpSynthase.rotation.z);
  //   atpSynthaseModel.scale.set(5.9, 5.9, 5.9);
  // });








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


  function makeExplosion(randP,randA,starArray,start,end,x1,y1,z1) {
    if ( scrollY > start && scrollY < end) {
      var i = 0;
      // console.log("IIIIIIIM HEEEEERRRREEEEE");
      starArray.forEach((star) => {
        star.material.opacity = (end - scrollY) / (end - start);
        const explodeVector = createVectorFromAngles(randP[i], randA[i]);
        star.position.x = x1 + explodeVector.x * (scrollY - start) * 10.0;
        star.position.y = y1 + explodeVector.y * (scrollY - start) * 10.0;
        star.position.z = z1 + explodeVector.z * (scrollY - start) * 10.0;

        i += 1;
      });
      
    } else {
      starArray.forEach((star) => {
        star.material.opacity = 0.0;
        star.position.x = 0.0;
        star.position.y = 0.0;
        star.position.z = 0.0;
      });
    }
  }

  const stars = [];
  const explodeAzimuth = [];
  const explodePolar = [];
  function addStar() {
    const geometryS = new THREE.SphereGeometry(0.3, 12, 12);
    const materialS = new THREE.MeshBasicMaterial( { color: 0xfff671, opacity: 1.0, transparent: true });
    const star = new THREE.Mesh( geometryS, materialS );
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 300 ) );
    star.position.set(0, 0, 0);
    explodeAzimuth.push(Math.random() * (Math.PI * 2));
    explodePolar.push(Math.random() * (Math.PI * 2));
    stars.push(star);
    scene.add(star);
  }
  Array(200).fill().forEach(addStar);


  const stars1 = [];
  const explodeAzimuth1 = [];
  const explodePolar1 = [];
  function addStar1() {
    const geometryS = new THREE.SphereGeometry(Math.random() + 0.3, 6, 6);
    const materialS = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1.0, transparent: true });
    const star = new THREE.Mesh( geometryS, materialS );
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 300 ) );
    star.position.set(0, 0, 0);
    explodeAzimuth1.push(Math.random() * (Math.PI * 2));
    explodePolar1.push(Math.random() * (Math.PI * 2));
    stars1.push(star);
    scene.add(star);
  }
  Array(150).fill().forEach(addStar1);



  const stars2 = [];
  const explodeAzimuth2 = [];
  const explodePolar2 = [];
  function addStar2() {
    const geometryS = new THREE.SphereGeometry(Math.random() + 0.3, 6, 6);
    const materialS = new THREE.MeshBasicMaterial( { color: 0xf38484, opacity: 1.0, transparent: true });
    const star = new THREE.Mesh( geometryS, materialS );
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 300 ) );
    star.position.set(0, 0, 0);
    explodeAzimuth2.push(Math.random() * (Math.PI * 2));
    explodePolar2.push(Math.random() * (Math.PI * 2));
    stars2.push(star);
    scene.add(star);
  }
  Array(150).fill().forEach(addStar2);




  const stars3 = [];
  const explodeAzimuth3 = [];
  const explodePolar3 = [];
  function addStar3() {
    const geometryS = new THREE.SphereGeometry(Math.random() + 0.6, 6, 6);
    const materialS = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1.0, transparent: true });
    const star = new THREE.Mesh( geometryS, materialS );
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 300 ) );
    star.position.set(0, 0, 0);
    explodeAzimuth3.push(Math.random() * (Math.PI * 2));
    explodePolar3.push(Math.random() * (Math.PI * 2));
    stars3.push(star);
    scene.add(star);
  }
  Array(50).fill().forEach(addStar3);




  const stars4 = [];
  const explodeAzimuth4 = [];
  const explodePolar4 = [];
  function addStar4() {
    const geometryS = new THREE.SphereGeometry(Math.random() + 0.6, 6, 6);
    const materialS = new THREE.MeshBasicMaterial( { color: 0x383838, opacity: 1.0, transparent: true });
    const star = new THREE.Mesh( geometryS, materialS );
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 300 ) );
    star.position.set(0, 0, 0);
    explodeAzimuth4.push(Math.random() * (Math.PI * 2));
    explodePolar4.push(Math.random() * (Math.PI * 2));
    stars4.push(star);
    scene.add(star);
  }
  Array(50).fill().forEach(addStar4);


  // let firstTimeAddGlucoseExplosions = true;
  // let agerandFirst = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  // let agerandSecond = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  // let agerandThird = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  // let agerandFourth = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  // let agerandFifth = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  // let agerandSixth = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  // let agerandSeventh = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  // function addGlucoseExplosions(amount,reach) {
    
  //   let index = 0;
  //   while (index < amount) {
  //     if (firstTimeAddGlucoseExplosions) {
  //       agerandFirst[index] = Math.random()+1.0;
  //       agerandSecond[index] = Math.random()-0.5;
  //       agerandThird[index] = Math.random()-0.5;
  //       agerandFourth[index] = Math.random()-0.5;
  //       agerandFifth[index] = Math.random()-0.5;
  //       agerandSixth[index] = Math.random()-0.5;
  //       agerandSeventh[index] = Math.random()-0.5;

  //       firstTimeAddGlucoseExplosions = false;
  //     }
  //     playGlucoseAnimation(550 + (index * (agerandFirst[index]) * 100),(agerandSecond[index])*reach,(agerandThird[index])*reach,(agerandFourth[index])*reach,(agerandFifth[index])*(Math.PI * 4),(agerandSixth[index])*(Math.PI * 4),(agerandSeventh[index])*(Math.PI * 4),index);
  //     index += 1;
  //   }
  // }







  let broughtIn1m,broughtIn2m,broughtIn3m,broughtIn4m,broughtIn5m;
  let broughtInModels = [broughtIn1m,broughtIn2m,broughtIn3m,broughtIn4m,broughtIn5m];

  let broughtInObject = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];

  function bringInObject(filename,fi1,fi2,fo1,fo2,x1,y1,z1,rx1,ry1,rz1,scale,broughtIndex,wantOpaque,maxOpacity) {
    if (!broughtInObject[broughtIndex]) {
      loader.load(filename, (gltf) => { 
        broughtInModels[broughtIndex] = gltf.scene;
        scene.add(broughtInModels[broughtIndex]);
        broughtInModels[broughtIndex].position.set(x1, y1, z1);
        broughtInModels[broughtIndex].rotation.set(rx1, ry1, rz1);
        broughtInModels[broughtIndex].scale.set(scale, scale, scale);
        // gltf.scene.traverse((child) => {
        //   if (child.isMesh && !child.material.map) {
        //     child.material = new THREE.MeshStandardMaterial({
        //       color: 0xff4444, // Fallback color
        //     });
        //   }
        // });
      });
    }
    broughtInObject[broughtIndex] = true;
    if (broughtInModels[broughtIndex]) {
      
      // broughtInModels[broughtIndex].traverse((child) => {
      //   if (child.isMesh) {
      //     // Force material update
      //     child.material.needsUpdate = true;

      //     // Ensure textures are using the correct encoding
      //     if (child.material.map) {
      //       child.material.map.encoding = THREE.sRGBEncoding;
      //     }

      //     // Debug materials
      //     // console.log('Material:', child.material);
      //   }
      // });
      broughtInModels[broughtIndex].position.set(x1, y1, z1);
      // setModelOpacity(broughtInModels[broughtIndex],0.0,true); // Not done by any means, just opacity of 0.5 flat
      setModelOpacity(broughtInModels[broughtIndex],Math.min(Math.max(0.0,(currentTargetY-fi1) * 0.3),(fo1-currentTargetY) * 0.3,maxOpacity),wantOpaque); // Not done by any means, just opacity of 0.5 flat
    }
    
  }

  // let playedGcAnim = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  // let pgcaa1 = [];
  // let pgcaa2 = [];
  // let pgcaa3,pgcaa4,pgcaa5,pgcaa6,pgcaa7,pgcaa8,pgcaa9,pgcaa10,pgcaa11,pgcaa12,pgcaa13 = [];
  // let pgcaActions = [pgcaa1,pgcaa2,pgcaa3,pgcaa4,pgcaa5,pgcaa6,pgcaa7,pgcaa8,pgcaa9,pgcaa10,pgcaa11,pgcaa12,pgcaa13];
  // let pgcaa1m,pgcaa2m,pgcaa3m,pgcaa4m,pgcaa5m,pgcaa6m,pgcaa7m,pgcaa8m,pgcaa9m,pgcaa10m,pgcaa11m,pgcaa12m,pgcaa13m;
  // let pgcaModels = [pgcaa1m,pgcaa2m,pgcaa3m,pgcaa4m,pgcaa5m,pgcaa6m,pgcaa7m,pgcaa8m,pgcaa9m,pgcaa10m,pgcaa11m,pgcaa12m,pgcaa13m];
  // let pmixer1,pmixer2,pmixer3,pmixer4,pmixer5,pmixer6,pmixer7,pmixer8,pmixer9,pmixer10,pmixer11,pmixer12,pmixer13;
  // let pgcaMixers = [pmixer1,pmixer2,pmixer3,pmixer4,pmixer5,pmixer6,pmixer7,pmixer8,pmixer9,pmixer10,pmixer11,pmixer12,pmixer13];
  // const GCA_DELAY = 1300.0;


  function playGlucoseAnimation(startTime,x1,y1,z1,rx1,ry1,rz1,gcaIndex) {
    if (!playedGcAnim[gcaIndex]) {
      const tgcaloader = new GLTFLoader();
      tgcaloader.load('./blenderModels/breakGlucoseAnim1.glb', (gltf) => {
        pgcaModels[gcaIndex] = gltf.scene;
        scene.add(pgcaModels[gcaIndex]);
        pgcaModels[gcaIndex].scale.set(5.9, 5.9, 5.9);
        pgcaModels[gcaIndex].position.set(x1, y1, z1);
        pgcaModels[gcaIndex].rotation.set(rx1, ry1, rz1);
        pgcaMixers[gcaIndex] = new THREE.AnimationMixer(gltf.scene);
        pgcaActions[gcaIndex] = [];

        gltf.animations.forEach((clip) => {
          const action = pgcaMixers[gcaIndex].clipAction(clip);
          pgcaActions[gcaIndex].push({ action, clip });
        });
        setModelOpacity(pgcaModels[gcaIndex], 0.0,true);
      });
    }
    playedGcAnim[gcaIndex] = true;
    if(pgcaModels[gcaIndex]) {
      pgcaActions[gcaIndex].forEach(({ action, clip }) => {
        action.time = Math.min(Math.max(0.0,(scrollY - startTime) * 0.005), 16.0); // Map scroll progress to animation time
        action.play(); // Ensure the action is playing
      });
      setModelOpacity(pgcaModels[gcaIndex], Math.min(1.0 - (scrollY - (startTime + GCA_DELAY)) * 0.001,Math.max(0.0,(scrollY - startTime) * 0.001),true));
      // setModelOpacity(pgcaModels[gcaIndex], Math.min(1.0 - (scrollY - (startTime + GCA_DELAY)) * 0.01,Math.max(0.0,(scrollY - startTime) * 0.01),true));
      // setModelOpacity(pgcaModels[gcaIndex], 1.0);
      
    }
    if (pgcaMixers[gcaIndex]) pgcaMixers[gcaIndex].update(clock.getDelta());
  }












  const newfoundTexture = new THREE.TextureLoader().load('./images/deep-ocean.jpg');
  scene.background = newfoundTexture;






  // Assume you have a reference to the oxygen object and its material
  oxygen.material.transparent = true; // Enable transparency

  // Set a scroll threshold for fading
  const fadeStart = 28; // Start fading at 100 pixels of scroll
  const fadeEnd = 35;   // Fully transparent at 300 pixels of scroll
  const startOutFade = 100;



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
  let scrollTargetY = 15.0; // Initial target Y
  let currentTargetY = 15.0; // Current interpolated Y
  let zoomAmount = currentTargetY;
  let scaled_zoom_speed = 1.0;

  function onScroll(event) {
    // Adjust the target based on scroll delta
    scrollTargetY += event.deltaY * 0.01; // Scale down the delta for smoother scrolling
    scrollTargetY = Math.max(15.0, Math.min(10000, scrollTargetY)); // Clamp to a range
  }


  function createVectorFromAngles(theta, phi, radius = 1) {
    // Convert spherical coordinates to Cartesian coordinates
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    // Create and return the Vector3
    return new THREE.Vector3(x, y, z);
  }



  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };
  window.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
  });
  window.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
  });


  function linterpolate(currentTime,t1,x1,t2,x2) {
    // Clamp currentTime within the range [t1, t2]
    const clampedTime = Math.max(t1, Math.min(t2, currentTime));

    // Normalize time to a value between 0 and 1
    const normalizedTime = (clampedTime - t1) / (t2 - t1);

    // Interpolate between x1 and x2
    return x1 + normalizedTime * (x2 - x1);
  }

  ///////////////////////////////////////////////////////////////////{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
  // Starts at 105, Pos: 73.50, -56.10, -242.40 ||| Rot: -0.72, 3.90, 0.23
  debugObject.position.set(73.50, -56.10, -242.40);
  debugObject.rotation.set(-0.72, 3.90, 0.23);
  // By 180 need to get to Pos: 42.30, 29.70, 5.70 ||| Rot: -0.67, 2.78, -0.12

  let isZPressed = false;
  let isXPressed = false;
  let isCPressed = false;
  let isVPressed = false;
  let isBPressed = false;
  let isDPressed = false;
  let isFPressed = false;
  let isGPressed = false;

  // Event listeners to update the boolean states
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'z':
            isZPressed = true;
            break;
        case 'x':
            isXPressed = true;
            break;
        case 'c':
            isCPressed = true;
            break;
        case 'v':
            isVPressed = true;
            break;
        case 'b':
            isBPressed = true;
            break;
        case 'd':
            isDPressed = true;
            break;
        case 'f':
            isFPressed = true;
            break;
        case 'g':
            isGPressed = true;
            break;
        default:
            break;
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'z':
            isZPressed = false;
            break;
        case 'x':
            isXPressed = false;
            break;
        case 'c':
            isCPressed = false;
            break;
        case 'v':
            isVPressed = false;
            break;
        case 'b':
            isBPressed = false;
            break;
        case 'd':
            isDPressed = false;
            break;
        case 'f':
            isFPressed = false;
            break;
        case 'g':
            isGPressed = false;
            break;
        default:
            break;
    }
  });


  const gcStartFade = 105;
  const gcEndFade = 150;
  const gcStartOutFade = 450;
  const combStartFade = 450;
  const combEndFade = 490;
  const combStartOutFade = 710;


  function linearScale(inputValue, inputMin, inputMax, outputMin, outputMax) {
    // Prevent division by zero
    if (inputMax - inputMin === 0) return outputMin;

    return outputMin + ((inputValue - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);
  }
  function logarithmicScale(inputValue, inputMin, inputMax, outputMin, outputMax) {
    // Prevent invalid ranges
    if (inputValue <= 0 || inputMin <= 0 || inputMax <= 0) {
        throw new Error("Input and range values for logarithmic scaling must be greater than 0.");
    }
    if (inputMax === inputMin) {
        return outputMin; // Avoid division by zero
    }

    const logInputValue = Math.log(inputValue);
    const logInputMin = Math.log(inputMin);
    const logInputMax = Math.log(inputMax);

    return outputMin + ((logInputValue - logInputMin) / (logInputMax - logInputMin)) * (outputMax - outputMin);
  }
  function exponentialScale(inputValue, inputMin, inputMax, outputMin, outputMax, exponent = 2) {
    // Prevent invalid ranges
    if (inputMax === inputMin) {
        return outputMin; // Avoid division by zero
    }

    // Normalize input to a 0-1 range
    let normalizedInput = (inputValue - inputMin) / (inputMax - inputMin);
    normalizedInput = Math.max(0, Math.min(1, normalizedInput)); // Clamp to 0-1 for safety

    // Apply exponential scaling
    const scaledValue = outputMin + Math.pow(normalizedInput, exponent) * (outputMax - outputMin);

    return scaledValue;
  }




  const debugPosSensitivity = 0.30;
  const debugRotSensitivity = 0.01;

  

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////// ANIMATE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function animate() {
    // console.log("zoomAmount: " + zoomAmount);
    currentTargetY += (scrollTargetY - currentTargetY) * 0.1;
    if (currentTargetY < 25.49206) {
      zoomAmount = -(currentTargetY);
    } else {
      zoomAmount = -(Math.pow(1.1,currentTargetY - 0.82923) + 15);
    }
    const zoom_direction = new THREE.Vector3();
    camera.getWorldDirection(zoom_direction);
    camera.position.copy(zoom_direction.clone().multiplyScalar(zoomAmount));

    scrollY = camera.position.distanceTo(centerPoint.position);

    //debugObject.position.x,debugObject.position.y,debugObject.position.z
//Pos: 45.30, 39.90, -42.90 ||| Rot: -0.72, 3.90, 0.23
//Pos: 36.90, 11.40, 38.10 ||| Rot: -0.72, 3.90, 0.23
//Pos: 63.30, 30.60, 9.90 ||| Rot: -0.72, 3.90, 0.23
    makeExplosion(explodePolar1,explodeAzimuth1,stars1,350,660,0,0,0);
    makeExplosion(explodePolar2,explodeAzimuth2,stars2,353,650,45.30,39.90,-42.90);
    makeExplosion(explodePolar3,explodeAzimuth3,stars3,356,670,36.90,11.40,38.10);
    makeExplosion(explodePolar4,explodeAzimuth4,stars4,358,680,63.30,30.60,9.90);


    playGlucoseAnimation(300,77,-350,-72,7,4,2,0);
    playGlucoseAnimation(850,-450,164,-172,29,3,7,1);
    playGlucoseAnimation(1300,660,350,560,23,34,3,2);
    


    //********************************************************************************************************************************************** */
    // console.log("Pos: "+String(debugObject.position.x.toFixed(2))+", "+String(debugObject.position.y.toFixed(2))+", "+String(debugObject.position.z.toFixed(2)) + " ||| Rot: "+String(debugObject.rotation.x.toFixed(2))+", "+String(debugObject.rotation.y.toFixed(2))+", "+String(debugObject.rotation.z.toFixed(2)));
 
    bringInObject("./blenderModels/mitochondria.glb",117,1622,160,1622,-10000,-90000,15000,0,0,0,520833.0,0,false,1.0);
    bringInObject("./blenderModels/ribosome.glb",60,1622,80,1622,debugObject.position.x,debugObject.position.y,debugObject.position.z,0,0,0,1.0,1,false,0.97); // 137 times size of O atom
    bringInObject("./blenderModels/human_cell.glb",150,1622,300,1622,0,0,0,0,0,0,1780822.0,2,true,1.0);
    bringInObject("./blenderModels/realistic_human_heart.glb",20,1622,500,1622,0,0,0,0,0,0,6575342465,3,true,1.0);







    gcactions.forEach(({ action, clip }) => {
      action.time = Math.min(Math.max(0.0,(scrollY - 105.0) * 0.03), 16.0); // Map scroll progress to animation time
      action.play(); // Ensure the action is playing
    });
    if (gcaModel) {
      setModelOpacity(gcaModel, Math.max(0.0,(scrollY - 105.0) * 0.03),true);
      if (scrollY > 240) {
        setModelOpacity(gcaModel, 1.0 - (scrollY - 535.0) * 0.015,true);
      }
    }

    if (mixer) mixer.update(clock.getDelta());
    pgcaMixers.forEach(genericMixer => {
      if (genericMixer) genericMixer.update(clock.getDelta());
    });





    debugObject.position.set((Number(keys.ArrowRight) * debugPosSensitivity) - (Number(keys.ArrowLeft) * debugPosSensitivity) + debugObject.position.x, debugObject.position.y, debugObject.position.z);
    debugObject.position.set(debugObject.position.x, (Number(keys.ArrowUp) * debugPosSensitivity) - (Number(keys.ArrowDown) * debugPosSensitivity) + debugObject.position.y, debugObject.position.z);
    debugObject.position.set(debugObject.position.x, debugObject.position.y, (Number(isZPressed) * debugPosSensitivity) - (Number(isXPressed) * debugPosSensitivity) + debugObject.position.z);

    debugObject.rotation.set((Number(isCPressed) * debugRotSensitivity) - (Number(isDPressed) * debugRotSensitivity) + debugObject.rotation.x, debugObject.rotation.y, debugObject.rotation.z);
    debugObject.rotation.set(debugObject.rotation.x, (Number(isVPressed) * debugRotSensitivity) - (Number(isFPressed) * debugRotSensitivity) + debugObject.rotation.y, debugObject.rotation.z);
    debugObject.rotation.set(debugObject.rotation.x, debugObject.rotation.y, (Number(isBPressed) * debugRotSensitivity) - (Number(isGPressed) * debugRotSensitivity) + debugObject.rotation.z);

    if (gcaModel) {
      if (scrollY < 355.0) {
        scene.add(sigmaBond, piBond, oxygen, oxygen2, blankOxygen, blankOxygen2);
        gcaModel.position.set(linterpolate(scrollY,105,73.50,355,43.50), linterpolate(scrollY,105,-56.10,355,23.40), linterpolate(scrollY,105,-242.40,355,-21.00));
        gcaModel.rotation.set(linterpolate(scrollY,105,-0.72,355,-1.36), linterpolate(scrollY,105,3.90,355,2.83), linterpolate(scrollY,105,0.23,355,-0.18));
      } else if (scrollY > 355.0) {
        scene.remove(sigmaBond, piBond, oxygen, oxygen2, blankOxygen, blankOxygen2);
        gcaModel.position.set(linterpolate(scrollY,355,43.50,650,13.50), linterpolate(scrollY,355,23.40,650,102.9), linterpolate(scrollY,355,-21.00,650,200.4));
        // gcaModel.rotation.set(linterpolate(scrollY,180,-1.36,255,-2.00), linterpolate(scrollY,180,2.83,255,1.76), linterpolate(scrollY,180,-0.18,255,-0.59));
      }
      gcpanel.position.y = gcaModel.position.y + 60.0;
      gcpanel.position.x = gcaModel.position.x;
      gcpanel.position.z = gcaModel.position.z;
      gcpanel.lookAt(camera.position);
      combpanel.position.y = gcaModel.position.y + 0.0;
      combpanel.position.x = gcaModel.position.x;
      combpanel.position.z = gcaModel.position.z;
      combpanel.lookAt(camera.position);
    }


    


    requestAnimationFrame( animate );

    h2omodel.position.set(h2o1Pos.position.x, h2o1Pos.position.y, h2o1Pos.position.z);
    h2omodel.rotation.set(h2o1Pos.rotation.x, h2o1Pos.rotation.y, h2o1Pos.rotation.z);
    h2o1Pos.position.set(-80.0 + scrollY * (1.1), 40.0 - scrollY * (1.1), -40.0 + scrollY * (0.3));
    h2o1Pos.rotation.set(-80.0 + scrollY * 0.2, 10.0, -10.0);
    

    h2opanel.position.y = h2o1Pos.position.y + 12.0;
    h2opanel.position.x = h2o1Pos.position.x;
    h2opanel.position.z = h2o1Pos.position.z;
    h2opanel.lookAt(camera.position);



    cd1Pos.position.set(150.0 + scrollY * (-1.1), -80.0 + scrollY * (1.2), -50.0 + scrollY * (-0.3));
    cd1Pos.rotation.set(-10.0, 80.0 + scrollY * 0.2, -10.0);
    co2model.position.set(cd1Pos.position.x, cd1Pos.position.y, cd1Pos.position.z);
    co2model.rotation.set(cd1Pos.rotation.x, cd1Pos.rotation.y, cd1Pos.rotation.z);

    co2panel.position.y = cd1Pos.position.y + 12.0;
    co2panel.position.x = cd1Pos.position.x;
    co2panel.position.z = cd1Pos.position.z;
    co2panel.lookAt(camera.position);








    o2panel.lookAt(camera.position);

    ////////// MOVING BOND ENERGY PARTICLES  ////////////////
    // makeExplosion(27.1,45.0,0,0,0);

    // if ( scrollY > 27.1 && scrollY < 45.0) {
    //   var i = 0;
    //   stars.forEach((star) => {
    //     star.material.opacity = (45.0 - scrollY) / (45.0 - 27.1);
    //     const explodeVector = createVectorFromAngles(explodePolar[i], explodeAzimuth[i]);
    //     star.position.x = explodeVector.x * (scrollY - 27.1) * 10.0;
    //     star.position.y = explodeVector.y * (scrollY - 27.1) * 10.0;
    //     star.position.z = explodeVector.z * (scrollY - 27.1) * 10.0;

    //     i += 1;
    //   });
    // } else {
    //   stars.forEach((star) => {
    //     star.material.opacity = 0.0;
    //     star.position.x = 0.0;
    //     star.position.y = 0.0;
    //     star.position.z = 0.0;
    //   });
    // }



    makeExplosion(explodePolar,explodeAzimuth,stars,27.1,45.0,0,0,0);


    // if ( scrollY > 27.1 && scrollY < 45.0) {
    //   var i = 0;
    //   stars.forEach((star) => {
    //     star.material.opacity = (45.0 - scrollY) / (45.0 - 27.1);
    //     // var explodeAzimuth = (i * 2.0 * Math.PI) / 50.0;
    //     // var explodePolar = (Math.random() - 0.5) * (Math.PI / 4);
    //     const explodeVector = createVectorFromAngles(explodePolar[i], explodeAzimuth[i]);
    //     // const explodeVector = createVectorFromAngles(0.0, 0.0);
    //     star.position.x = explodeVector.x * (scrollY - 27.1) * 10.0;
    //     star.position.y = explodeVector.y * (scrollY - 27.1) * 10.0;
    //     star.position.z = explodeVector.z * (scrollY - 27.1) * 10.0;
    //     // star.position.addScaledVector(explodeVector, 1.0);

    //     i += 1;
    //   });
    // } else {
    //   stars.forEach((star) => {
    //     star.material.opacity = 0.0;
    //     star.position.x = 0.0;
    //     star.position.y = 0.0;
    //     star.position.z = 0.0;
    //   });
    // }

    

    // camera.position.x += (scrollTargetY - currentTargetY) * 0.1;
    // camera.position.y += (scrollTargetY - currentTargetY) * 0.1;
    // camera.position.z += (scrollTargetY - currentTargetY) * 0.1;



    

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
    let fadeFactor = ((scrollY - fadeStart) / (fadeEnd - fadeStart));
    fadeFactor = Math.min(Math.max(fadeFactor, 0), 1); // Clamp between 0 and 1
    // Apply opacity based on fade factor
    // oxygen.material.opacity = 1 - fadeFactor;
    setModelOpacity(oxygen,1 - fadeFactor,false);
    // oxygen2.material.opacity = 1 - fadeFactor;
    setModelOpacity(oxygen2,1 - fadeFactor,false);

    // o2panel.material.opacity = fadeFactor + Math.min(0.0, 0.1 * (startOutFade - scrollY));
    setModelOpacity(o2panel,fadeFactor + Math.min(0.0, 0.1 * (startOutFade - scrollY)),false);
    // co2panel.material.opacity = fadeFactor + Math.min(0.0, 0.1 * (startOutFade - scrollY));
    setModelOpacity(co2panel,fadeFactor + Math.min(0.0, 0.1 * (startOutFade - scrollY)),false);
    setModelOpacity(co2model,fadeFactor + Math.min(0.0, 0.1 * (startOutFade - scrollY)),true);

    // h2opanel.material.opacity = fadeFactor + Math.min(0.0, 0.1 * (startOutFade - scrollY));
    setModelOpacity(h2opanel,fadeFactor + Math.min(0.0, 0.1 * (startOutFade - scrollY)),false);
    setModelOpacity(h2omodel,fadeFactor + Math.min(0.0, 0.1 * (startOutFade - scrollY)),true);

    let gcfadeFactor = ((scrollY - gcStartFade) / (gcEndFade - gcStartFade));
    gcfadeFactor = Math.min(Math.max(gcfadeFactor, 0), 1); // Clamp between 0 and 1
    // gcpanel.material.opacity = gcfadeFactor + Math.min(0.0, 0.1 * (gcStartOutFade - scrollY));
    setModelOpacity(gcpanel,gcfadeFactor + Math.min(0.0, 0.015 * (gcStartOutFade - scrollY)),false);
    let combfadeFactor = ((scrollY - combStartFade) / (combEndFade - combStartFade));
    combfadeFactor = Math.min(Math.max(combfadeFactor, 0), 0.85); // Clamp between 0 and 1
    // combpanel.material.opacity = combfadeFactor + Math.min(0.0, 0.1 * (combStartOutFade - scrollY));
    setModelOpacity(combpanel,combfadeFactor + Math.min(0.0, 0.015 * (combStartOutFade - scrollY)),false);



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
        scaleLabel = `${(scale * 1e12).toFixed(4)} pm (picometers)`;
    } else if (scale < 1e-6) {
        scaleLabel = `${(scale * 1e9).toFixed(4)} nm (nanometers)`;
    } else if (scale < 1e-3) {
        scaleLabel = `${(scale * 1e6).toFixed(4)} µm (micrometers)`;
    } else {
        scaleLabel = `${scale.toFixed(4)} m (meters)`;
    }


    // scale = 10.0 * Math.log(scrollY + 1.0);

    rotationElement.innerText = `Screen height: ${scaleLabel}`;
    // rotationElement.innerText = `currentTargetY: ${currentTargetY.toFixed(2)}`;


    controls.update();

    renderer.render( scene, camera );
  }

  animate()
});

resetButton.addEventListener("click", () => {
  // Remove the canvas and renderer
  const canvas = document.getElementById("bg");
  if (canvas) {
    container.removeChild(canvas);
  }
  resetButton.style.display = "none";
  button.style.display = "block";
});





