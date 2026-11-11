import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';

const showRayPlane = new URLSearchParams(location.search).has('ray-plane');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1419);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
camera.position.set(...(showRayPlane ? [6, 5, 8] : [4, 4, 6]));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const modeLink = document.querySelector('#mode-link');
if (showRayPlane) {
    modeLink.href = './';
    modeLink.textContent = 'Vector laboratory';
    setupRayPlane();
} else {
    setupVectors();
}

function setupVectors() {
    scene.add(new THREE.AxesHelper(5));

    const origin = new THREE.Vector3();
    const a = new THREE.Vector3(2, 1, 0);
    const b = new THREE.Vector3(0, 2, 0);
    const sum = new THREE.Vector3();
    const cross = new THREE.Vector3();

    const arrowA = new THREE.ArrowHelper(undefined, origin, 1, 0xe8431c);
    const arrowB = new THREE.ArrowHelper(undefined, origin, 1, 0x1e40ff);
    const arrowSum = new THREE.ArrowHelper(undefined, origin, 1, 0x3ecf8e);
    scene.add(arrowA, arrowB, arrowSum);

    const gui = new GUI();
    for (const [name, vector] of [['A', a], ['B', b]]) {
        const folder = gui.addFolder('Vector ' + name);
        for (const axis of ['x', 'y', 'z']) {
            folder.add(vector, axis, -5, 5, 0.1).name(axis.toUpperCase()).listen().onChange(updateVectors);
        }
    }

    const results = { sum: '', dot: '', cross: '', crossLength: '', angle: '' };
    const resultsFolder = gui.addFolder('Results');
    resultsFolder.add(results, 'sum').name('a + b').listen().disable();
    resultsFolder.add(results, 'dot').name('a · b').listen().disable();
    resultsFolder.add(results, 'cross').name('a × b').listen().disable();
    resultsFolder.add(results, 'crossLength').name('|a × b|').listen().disable();
    resultsFolder.add(results, 'angle').name('Angle').listen().disable();

    gui.add({
        verifyAngle() {
            a.set(3, 4, 0);
            b.set(1, 0, 0);
            updateVectors();
        }
    }, 'verifyAngle').name('Check the 53.13° example');

    function updateArrow(arrow, vector) {
        const length = vector.length();
        arrow.visible = length > 0;
        if (!arrow.visible) return;

        arrow.setDirection(vector.clone().normalize());
        const headLength = Math.min(length * 0.3, 0.35);
        arrow.setLength(length, headLength, Math.min(headLength * 0.65, 0.2));
    }

    function updateVectors() {
        sum.addVectors(a, b);
        cross.crossVectors(a, b);

        updateArrow(arrowA, a);
        updateArrow(arrowB, b);
        updateArrow(arrowSum, sum);

        const dot = a.dot(b);
        const lengthProduct = a.length() * b.length();

        results.sum = '(' + sum.toArray().map(value => value.toFixed(2)).join(', ') + ')';
        results.dot = dot.toFixed(2);
        results.cross = '(' + cross.toArray().map(value => value.toFixed(2)).join(', ') + ')';
        results.crossLength = cross.length().toFixed(2);
        if (lengthProduct === 0) {
            results.angle = 'Undefined for a zero vector';
        } else {
            const cosine = THREE.MathUtils.clamp(dot / lengthProduct, -1, 1);
            results.angle = THREE.MathUtils.radToDeg(Math.acos(cosine)).toFixed(2) + '°';
        }
    }

    updateVectors();
}

function setupRayPlane() {
    const normal = new THREE.Vector3(0, 1, 0);
    const planePoint = new THREE.Vector3(0, 0, 0);
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 12),
        new THREE.MeshBasicMaterial({ color: 0x2a3140, side: THREE.DoubleSide })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.copy(planePoint);
    floor.updateMatrixWorld(true);

    const grid = new THREE.GridHelper(12, 12);
    grid.position.y = 0.002;
    scene.add(floor, grid);

    const origin = new THREE.Vector3(2, 5, 1);
    const direction = new THREE.Vector3(0.3, -1, 0.1).normalize();
    const denominator = normal.dot(direction);
    const distance = (normal.dot(planePoint) - normal.dot(origin)) / denominator;
    const hit = origin.clone().addScaledVector(direction, distance);

    scene.add(new THREE.ArrowHelper(direction, origin, distance, 0xff4422));
    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.18),
        new THREE.MeshBasicMaterial({ color: 0xffd700 })
    );
    marker.position.copy(hit);
    scene.add(marker);

    const [raycastHit] = new THREE.Raycaster(origin, direction).intersectObject(floor);
    const formatPoint = point => '(' + point.toArray().map(value => (Math.round(value * 1000) / 1000).toFixed(3)).join(', ') + ')';
    const matches = raycastHit && hit.distanceTo(raycastHit.point) < 1e-6;
    document.querySelector('#results').textContent =
        'Formula ' + formatPoint(hit) + ' · Raycaster ' +
        (raycastHit ? formatPoint(raycastHit.point) : 'No hit') +
        (matches ? ' · Match' : ' · Mismatch');
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});
