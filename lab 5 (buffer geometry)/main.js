import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100)
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.4))
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
directionalLight.position.set(5, 8, 4)
scene.add(directionalLight)

const positions = new Float32Array([
    0, 1.5, 0, //vertex 0
    0, -1.5, 0, //vertex 1
    1, 0, 0, //vertex 2
    0, 0, 1, //vertex 3
    -1, 0, 0, //vertex 4
    0, 0, -1, //vertex 5
])

const index = [
    0, 3, 2,
    0, 4, 3,
    0, 5, 4,
    0, 2, 5,
    1, 2, 3,
    1, 3, 4,
    1, 4, 5,
    1, 5, 2,
]
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setIndex(index)
geometry.computeVertexNormals();

const mesh = new THREE.Mesh(geometry,
    new THREE.MeshStandardMaterial({ color: 0x66aaff, roughness: 0.4 })
)
scene.add(mesh)

const nonIndexed = geometry.toNonIndexed()
nonIndexed.computeVertexNormals()

console.log('Vertices: ', geometry.attributes.position.count, 'Faces', index.length / 3)
console.log('Vertices: ', nonIndexed.attributes.position.count, 'Faces', index.length / 3)

window.addEventListener('keydown', (e) => {
    if (e.key === 'f') {
        const showFacets = mesh.geometry === geometry
        mesh.geometry = showFacets ? nonIndexed : geometry
        document.querySelector('#normals').textContent =
            (showFacets ? 'Faceted normals' : 'Smooth normals') + ' · Press F to switch'
    }
})

function animate() {
    requestAnimationFrame(animate)
    control.update()
    mesh.rotation.y += 0.005
    renderer.render(scene, camera)
}
animate()