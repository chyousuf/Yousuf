import * as THREE from './vendor/three.module.min.js';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
let renderer;
try {
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:innerWidth > 768, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.domElement.className = 'world-canvas';
  renderer.domElement.setAttribute('aria-hidden','true');
  document.body.prepend(renderer.domElement);
  document.body.classList.add('world-ready');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
  camera.position.z = 12;
  scene.add(new THREE.AmbientLight(0x9ccccc,2));
  const light = new THREE.PointLight(0x56ffee,65); light.position.set(3,4,5); scene.add(light);
  const purple = new THREE.PointLight(0x9944ff,55); purple.position.set(-4,-2,4); scene.add(purple);
  const world = new THREE.Group(); scene.add(world);
  const material = new THREE.MeshStandardMaterial({color:0x238d90,metalness:.8,roughness:.23});
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.35,.32,120,16),material);
  world.add(knot);
  const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4,1),new THREE.MeshBasicMaterial({color:0x7a65dd,wireframe:true,transparent:true,opacity:.2})); world.add(cage);
  const satellites=[];
  for(let i=0;i<12;i++){
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(.12+(i%3)*.05),material);
    satellites.push(mesh); world.add(mesh);
  }
  const points = new Float32Array(210*3);
  for(let i=0;i<points.length;i++) points[i]=(Math.random()-.5)*26;
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(points,3));
  const stars=new THREE.Points(geometry,new THREE.PointsMaterial({color:0x82dbd8,size:.025,transparent:true,opacity:.65}));scene.add(stars);
  const pointer={x:0,y:0};
  addEventListener('pointermove',e=>{pointer.x=(e.clientX/innerWidth-.5);pointer.y=(e.clientY/innerHeight-.5);},{passive:true});
  let last=0;
  function render(time=0){
    if(time-last<32)return;last=time;
    const t=reduced.matches?0:time*.00025;
    const progress=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);
    world.position.set(innerWidth<768?0:Math.cos(progress*Math.PI*4)*3.2,Math.sin(progress*Math.PI*3)*.8,-progress*1.5);
    world.rotation.set(t*.6+progress*3,t+progress*5,Math.sin(t)*.2);
    knot.rotation.z=t*.3; cage.rotation.y=-t*.4;
    satellites.forEach((mesh,i)=>{const a=i/12*Math.PI*2+t;mesh.position.set(Math.cos(a)*3,Math.sin(a)*2.5,Math.sin(a*2)*1.4);mesh.rotation.set(t,a,t);});
    camera.position.x+=(pointer.x*.5-camera.position.x)*.035;
    camera.position.y+=(-pointer.y*.4-camera.position.y)*.035;
    stars.rotation.y=t*.05;
    renderer.render(scene,camera);
  }
  function start(){renderer.setAnimationLoop(document.hidden?null:render);}
  document.addEventListener('visibilitychange',start);start();
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);document.body.classList.remove('world-ready');});
} catch(error){ console.warn('3D scene unavailable; showing portfolio fallback.',error);renderer?.dispose(); }
if(gsap && ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    document.querySelectorAll('.section > .container').forEach(container=>{
      gsap.fromTo(container,{rotationX:5,z:-70},{rotationX:0,z:0,ease:'none',scrollTrigger:{trigger:container,start:'top bottom',end:'top 30%',scrub:1}});
    });
    document.querySelectorAll('.skill-card,.timeline-card,.edu-card,.contact-form').forEach((card,i)=>{
      gsap.fromTo(card,{rotationY:i%2?8:-8},{rotationY:0,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'top 50%',scrub:.6}});
    });
    const cards=document.querySelectorAll('.project-card');
    cards.forEach(card=>{
      const info=card.querySelector('.project-info');
      card.addEventListener('pointermove',e=>{
        if(!matchMedia('(hover:hover)').matches)return;
        const r=card.getBoundingClientRect();
        gsap.to(info,{rotationY:(e.clientX-r.left-r.width/2)/r.width*10,rotationX:-(e.clientY-r.top-r.height/2)/r.height*8,z:18,duration:.4,overwrite:'auto'});
      });
      card.addEventListener('pointerleave',()=>gsap.to(info,{rotationX:0,rotationY:0,z:0,duration:.6,overwrite:'auto'}));
    });
  });
  new ResizeObserver(()=>ScrollTrigger.refresh()).observe(document.querySelector('.projects-grid'));
}
