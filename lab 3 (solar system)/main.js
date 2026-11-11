import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
100
)
camera.position.set(10, 15, 21)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.3)
scene.add(pointLight, ambientLight)

const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0x75c518, emissive: 0xE8431c, emissiveIntensity: 0.6 })
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit)
// earthOrbit.add(new THREE.AxesHelper(7))

const earth = new THREE.Mesh(
new THREE.SphereGeometry(0.8, 32, 24),
new THREE.MeshStandardMaterial({ color: 0X1E40FF, roughness: 0.9 })
)
earth.position.x = 6
earthOrbit.add(earth)
// earth.add(new THREE.AxesHelper(7))

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit)
const moon = new THREE.Mesh(
new THREE.SphereGeometry(0.25, 32, 24),
new THREE.MeshStandardMaterial({ color: 0x134661 })
)
moon.position.x = 1.8;
moonOrbit.add(moon)

const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit)
marsOrbit.rotation.y = Math.PI * 0.7
// marsOrbit.add(new THREE.AxesHelper(5))
const mars = new THREE.Mesh(
new THREE.SphereGeometry(0.8, 32, 24),
new THREE.MeshStandardMaterial({ color: 0xbb3e04 })
)
mars.position.x = 10
marsOrbit.add(mars)

const phobosOrbit = new THREE.Object3D();
mars.add(phobosOrbit)
const phobos = new THREE.Mesh(
new THREE.SphereGeometry(0.25, 32, 24),
new THREE.MeshStandardMaterial({ color: 0x134661 })
)
phobos.position.x = 1.8
phobosOrbit.add(phobos)

const control = new OrbitControls(camera, renderer.domElement);
function animate() {
requestAnimationFrame(animate)
control.update()
earthOrbit.rotation.y += 0.01

moonOrbit.rotation.y += 0.04
earth.rotation.y += 0.05

marsOrbit.rotation.y += 0.006
mars.rotation.y += 0.03
phobosOrbit.rotation.y += 0.06
sun.rotation.y += 0.003
renderer.render(scene, camera)
}
animate()

addEventListener('resize', () => {
camera.aspect = innerWidth / innerHeight
camera.updateProjectionMatrix()
renderer.setSize(innerWidth, innerHeight)
})