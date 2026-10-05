import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

const shapes = [
  { id: 'cube', name: 'Куб', english: 'CUBE', symbol: '◇', description: 'Равные стороны. Простая форма, бесконечные возможности.', params: [{ key: 'a', label: 'Сторона a', min: 0.6, max: 4, step: 0.1, value: 2 }] },
  { id: 'box', name: 'Параллелепипед', english: 'BOX', symbol: '▱', description: 'Три независимых измерения — пространство в чистом виде.', params: [{ key: 'a', label: 'Сторона a', min: 0.6, max: 4, step: 0.1, value: 2.6 }, { key: 'b', label: 'Сторона b', min: 0.6, max: 4, step: 0.1, value: 1.8 }, { key: 'c', label: 'Сторона c', min: 0.6, max: 4, step: 0.1, value: 1.3 }] },
  { id: 'sphere', name: 'Сфера', english: 'SPHERE', symbol: '●', description: 'Совершенная симметрия без единого угла.', params: [{ key: 'r', label: 'Радиус r', min: 0.6, max: 2.8, step: 0.1, value: 1.5 }] },
  { id: 'cylinder', name: 'Цилиндр', english: 'CYLINDER', symbol: '⬭', description: 'Круглое основание и прямые параллельные образующие.', params: [{ key: 'r', label: 'Радиус r', min: 0.5, max: 2.4, step: 0.1, value: 1.2 }, { key: 'h', label: 'Высота h', min: 0.6, max: 4, step: 0.1, value: 2.4 }, { key: 'sides', label: 'Углов в основании', min: 3, max: 32, step: 1, value: 32, unit: 'шт.' }] },
  { id: 'cone', name: 'Конус', english: 'CONE', symbol: '△', description: 'Круглое основание сходится в одной выразительной вершине.', params: [{ key: 'r', label: 'Радиус r', min: 0.5, max: 2.4, step: 0.1, value: 1.5 }, { key: 'h', label: 'Высота h', min: 0.6, max: 4, step: 0.1, value: 2.6 }, { key: 'sides', label: 'Углов в основании', min: 3, max: 32, step: 1, value: 32, unit: 'шт.' }] },
  { id: 'prism', name: 'Призма', english: 'PRISM', symbol: '⬡', description: 'Правильное многоугольное основание и ровный ритм граней.', params: [{ key: 'r', label: 'Радиус основания', min: 0.5, max: 2.4, step: 0.1, value: 1.4 }, { key: 'h', label: 'Высота h', min: 0.6, max: 3.8, step: 0.1, value: 2.2 }, { key: 'sides', label: 'Углов в основании', min: 3, max: 12, step: 1, value: 6, unit: 'шт.' }] },
  { id: 'torus', name: 'Тор', english: 'TORUS', symbol: '◎', description: 'Замкнутая поверхность, у которой центр остаётся пустым.', params: [{ key: 'r', label: 'Большой радиус R', min: 0.8, max: 2.4, step: 0.1, value: 1.5 }, { key: 'tube', label: 'Малый радиус r', min: 0.2, max: 0.9, step: 0.05, value: 0.48 }, { key: 'arc', label: 'Угол дуги', min: 45, max: 360, step: 5, value: 360, unit: '°' }] },
  { id: 'octahedron', name: 'Октаэдр', english: 'OCTAHEDRON', symbol: '✧', description: 'Восемь треугольных граней сходятся в острых вершинах.', params: [{ key: 'r', label: 'Радиус описанной сферы', min: 0.6, max: 2.8, step: 0.1, value: 1.7 }, { key: 'detail', label: 'Детализация', min: 0, max: 3, step: 1, value: 0, unit: 'ур.' }] },
];

const shapeTranslations = {
  en: {
    cube: { name: 'Cube', description: 'Equal edges. A simple form with endless possibilities.', params: { a: 'Edge a' } },
    box: { name: 'Cuboid', description: 'Three independent dimensions: space in its purest form.', params: { a: 'Edge a', b: 'Edge b', c: 'Edge c' } },
    sphere: { name: 'Sphere', description: 'Perfect symmetry, without a single corner.', params: { r: 'Radius r' } },
    cylinder: { name: 'Cylinder', description: 'A circular base and straight, parallel sides.', params: { r: 'Radius r', h: 'Height h', sides: 'Base sides' } },
    cone: { name: 'Cone', description: 'A circular base meets at one precise point.', params: { r: 'Radius r', h: 'Height h', sides: 'Base sides' } },
    prism: { name: 'Prism', description: 'A polygonal base and a clean rhythm of flat faces.', params: { r: 'Base radius', h: 'Height h', sides: 'Base sides' } },
    torus: { name: 'Torus', description: 'A continuous surface with an open center.', params: { r: 'Major radius R', tube: 'Minor radius r', arc: 'Arc angle' } },
    octahedron: { name: 'Octahedron', description: 'Eight triangular faces meet in precise vertices.', params: { r: 'Circumscribed radius', detail: 'Subdivision' } },
  },
};

const translations = {
  ru: {
    topbar: 'ЛАБОРАТОРИЯ ФОРМ', about: 'О проекте', hero: 'ИНТЕРАКТИВНАЯ ГЕОМЕТРИЯ', title: 'Форма в', accent: 'пространстве.',
    reset: 'Сбросить вращение', preview: '3D-ПРОСМОТР', drag: 'ПЕРЕТАЩИ, ЧТОБЫ ВРАЩАТЬ', catalog: 'КАТАЛОГ', choose: 'Выбери форму', objects: 'ОБЪЕКТОВ',
    settings: 'НАСТРОЙКИ ОБЪЕКТА', dimensions: 'РАЗМЕРЫ И ФОРМА', units: 'ЕД. ИЗМЕРЕНИЯ', appearance: 'ВНЕШНИЙ ВИД', opacity: 'Непрозрачность', outline: 'Белый контур', volume: 'ОБЪЁМ', cubic: 'ед.³',
    live: 'Параметры обновляются в реальном времени', footer: 'СОЗДАНО ДЛЯ ИЗУЧЕНИЯ ФОРМ', inspector: 'Параметры выбранной фигуры', shapePicker: 'Выбор геометрической фигуры', switchLanguage: 'Switch to English', titleTag: 'Forma — лаборатория геометрии',
    unitsShort: { 'шт.': 'шт.', 'ур.': 'ур.' },
    metaDescription: 'Интерактивная 3D-лаборатория геометрии: выбирай фигуры, меняй параметры и вращай их в пространстве.',
  },
  en: {
    topbar: 'FORM LABORATORY', about: 'About', hero: 'INTERACTIVE GEOMETRY', title: 'Form in', accent: 'space.',
    reset: 'Reset rotation', preview: '3D PREVIEW', drag: 'DRAG TO ROTATE', catalog: 'CATALOG', choose: 'Choose a form', objects: 'OBJECTS',
    settings: 'OBJECT SETTINGS', dimensions: 'SIZE & SHAPE', units: 'UNITS', appearance: 'APPEARANCE', opacity: 'Opacity', outline: 'White outline', volume: 'VOLUME', cubic: 'units³',
    live: 'Parameters update in real time', footer: 'MADE TO EXPLORE SHAPES', inspector: 'Selected shape settings', shapePicker: 'Choose a geometric shape', switchLanguage: 'Переключить на русский', titleTag: 'Forma — geometry lab',
    unitsShort: { 'шт.': 'sides', 'ур.': 'levels' },
    metaDescription: 'An interactive 3D geometry lab: choose shapes, adjust their parameters, and explore them in space.',
  },
};

let activeShape = shapes[0];
let language = 'ru';
let opacity = 0.82;
let showOutline = true;
const values = Object.fromEntries(shapes.map((shape) => [shape.id, Object.fromEntries(shape.params.map((param) => [param.key, param.value]))]));
const canvasWrap = document.querySelector('#canvas-wrap');
const parameterList = document.querySelector('#parameter-list');
const shapeList = document.querySelector('#shape-list');
const ui = (key) => translations[language][key];
const shapeName = (shape) => language === 'en' ? shapeTranslations.en[shape.id].name : shape.name;
const shapeDescription = (shape) => language === 'en' ? shapeTranslations.en[shape.id].description : shape.description;
const parameterName = (shape, param) => language === 'en' ? shapeTranslations.en[shape.id].params[param.key] : param.label;
const parameterUnit = (unit) => translations[language].unitsShort[unit] ?? unit;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0c0c');

const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(5.6, 4.2, 7.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
canvasWrap.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.7;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 14;
controls.target.set(0, 0.18, 0);

scene.add(new THREE.HemisphereLight('#d9e8ff', '#353226', 2.0));
const keyLight = new THREE.DirectionalLight('#fff3d9', 4.5);
keyLight.position.set(4, 7, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
scene.add(keyLight);
const fillLight = new THREE.PointLight('#75f0d0', 18, 12);
fillLight.position.set(-4, 1.5, -3);
scene.add(fillLight);

const grid = new THREE.GridHelper(14, 28, '#29322e', '#161b18');
grid.position.y = -1.68;
grid.material.transparent = true;
grid.material.opacity = 0.5;
scene.add(grid);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.22 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.7;
floor.receiveShadow = true;
scene.add(floor);

const objectMaterial = new THREE.MeshStandardMaterial({
  color: '#a7f3dc',
  metalness: 0.22,
  roughness: 0.24,
  flatShading: false,
});
objectMaterial.transparent = opacity < 1;
objectMaterial.opacity = opacity;
objectMaterial.depthWrite = true;
const outlineMaterial = new THREE.LineBasicMaterial({ color: '#ffffff', depthTest: true, depthWrite: false, transparent: true });
outlineMaterial.toneMapped = false;
let currentMesh;
let outlineMesh;
let silhouetteData;
const outlineCameraPosition = new THREE.Vector3();

function buildGeometry(shape, parameters) {
  switch (shape.id) {
    case 'cube': return new THREE.BoxGeometry(parameters.a, parameters.a, parameters.a);
    case 'box': return new THREE.BoxGeometry(parameters.a, parameters.b, parameters.c);
    case 'sphere': return new THREE.SphereGeometry(parameters.r, 64, 48);
    case 'cylinder': return new THREE.CylinderGeometry(parameters.r, parameters.r, parameters.h, parameters.sides, 1);
    case 'cone': return new THREE.ConeGeometry(parameters.r, parameters.h, parameters.sides);
    case 'prism': return new THREE.CylinderGeometry(parameters.r, parameters.r, parameters.h, parameters.sides, 1, false);
    case 'torus': return new THREE.TorusGeometry(parameters.r, parameters.tube, 24, 96, THREE.MathUtils.degToRad(parameters.arc));
    case 'octahedron': return new THREE.OctahedronGeometry(parameters.r, parameters.detail);
    default: return new THREE.BoxGeometry(2, 2, 2);
  }
}

function buildSilhouetteData(geometry) {
  const position = geometry.attributes.position;
  const vertices = Array.from({ length: position.count }, (_, index) => new THREE.Vector3().fromBufferAttribute(position, index));
  const vertexKeys = vertices.map((vertex) => [vertex.x, vertex.y, vertex.z].map((value) => Math.round(value * 100000)).join(','));
  const edgesByKey = new Map();
  const faces = [];
  const index = geometry.index;
  const triangleCount = (index ? index.count : position.count) / 3;

  function addEdge(startIndex, endIndex, faceIndex) {
    const startKey = vertexKeys[startIndex];
    const endKey = vertexKeys[endIndex];
    const forward = startKey < endKey;
    const key = forward ? `${startKey}|${endKey}` : `${endKey}|${startKey}`;
    let edge = edgesByKey.get(key);
    if (!edge) {
      edge = {
        start: vertices[forward ? startIndex : endIndex],
        end: vertices[forward ? endIndex : startIndex],
        faces: [],
      };
      edgesByKey.set(key, edge);
    }
    edge.faces.push(faceIndex);
  }

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const offset = triangle * 3;
    const a = vertices[index ? index.getX(offset) : offset];
    const b = vertices[index ? index.getX(offset + 1) : offset + 1];
    const c = vertices[index ? index.getX(offset + 2) : offset + 2];
    const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    if (normal.lengthSq() < 1e-12) continue;
    normal.normalize();
    const faceIndex = faces.length;
    faces.push({
      normal,
      center: new THREE.Vector3().addVectors(a, b).add(c).multiplyScalar(1 / 3),
    });
    addEdge(index ? index.getX(offset) : offset, index ? index.getX(offset + 1) : offset + 1, faceIndex);
    addEdge(index ? index.getX(offset + 1) : offset + 1, index ? index.getX(offset + 2) : offset + 2, faceIndex);
    addEdge(index ? index.getX(offset + 2) : offset + 2, index ? index.getX(offset) : offset, faceIndex);
  }

  return { edges: [...edgesByKey.values()], faces, facing: new Uint8Array(faces.length) };
}

function updateSilhouette() {
  if (!outlineMesh?.visible || !silhouetteData || !currentMesh) return;

  camera.getWorldPosition(outlineCameraPosition);
  currentMesh.worldToLocal(outlineCameraPosition);
  silhouetteData.faces.forEach((face, index) => {
    const toCameraX = outlineCameraPosition.x - face.center.x;
    const toCameraY = outlineCameraPosition.y - face.center.y;
    const toCameraZ = outlineCameraPosition.z - face.center.z;
    silhouetteData.facing[index] = face.normal.x * toCameraX + face.normal.y * toCameraY + face.normal.z * toCameraZ >= 0 ? 1 : 0;
  });

  const position = outlineMesh.geometry.attributes.position;
  const vertices = position.array;
  let cursor = 0;
  silhouetteData.edges.forEach((edge) => {
    let front = false;
    let back = false;
    edge.faces.forEach((faceIndex) => {
      if (silhouetteData.facing[faceIndex]) front = true;
      else back = true;
    });
    if (!(front && back) && !(edge.faces.length === 1 && front)) return;
    vertices[cursor] = edge.start.x;
    vertices[cursor + 1] = edge.start.y;
    vertices[cursor + 2] = edge.start.z;
    vertices[cursor + 3] = edge.end.x;
    vertices[cursor + 4] = edge.end.y;
    vertices[cursor + 5] = edge.end.z;
    cursor += 6;
  });
  position.needsUpdate = true;
  outlineMesh.geometry.setDrawRange(0, cursor / 3);
}

function updateVolume() {
  const p = values[activeShape.id];
  let volume = 0;
  if (activeShape.id === 'cube') volume = p.a ** 3;
  if (activeShape.id === 'box') volume = p.a * p.b * p.c;
  if (activeShape.id === 'sphere') volume = (4 / 3) * Math.PI * p.r ** 3;
  if (activeShape.id === 'cylinder') volume = Math.PI * p.r ** 2 * p.h;
  if (activeShape.id === 'cone') volume = (Math.PI * p.r ** 2 * p.h) / 3;
  if (activeShape.id === 'prism') volume = (p.sides * p.r ** 2 * Math.sin((2 * Math.PI) / p.sides) * p.h) / 2;
  if (activeShape.id === 'torus') volume = 2 * Math.PI ** 2 * p.r * p.tube ** 2 * (p.arc / 360);
  if (activeShape.id === 'octahedron') volume = (4 / 3) * p.r ** 3 * Math.sqrt(2);
  document.querySelector('#volume-value').textContent = volume.toFixed(2);
  document.querySelector('#volume-bar').style.transform = `scaleX(${Math.min(volume / 140, 1)})`;
}

function updateGeometry() {
  const geometry = buildGeometry(activeShape, values[activeShape.id]);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  if (outlineMesh) {
    outlineMesh.geometry.dispose();
    outlineMesh = undefined;
  }
  silhouetteData = undefined;
  if (currentMesh) {
    scene.remove(currentMesh);
    currentMesh.geometry.dispose();
  }
  currentMesh = new THREE.Mesh(geometry, objectMaterial);
  currentMesh.castShadow = true;
  currentMesh.receiveShadow = true;
  currentMesh.rotation.set(0.16, 0.32, 0);
  if (showOutline) {
    silhouetteData = buildSilhouetteData(geometry);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(silhouetteData.edges.length * 6), 3));
    lineGeometry.boundingSphere = geometry.boundingSphere.clone();
    outlineMesh = new THREE.LineSegments(lineGeometry, outlineMaterial);
    outlineMesh.renderOrder = 1;
    outlineMesh.scale.setScalar(1.008);
    currentMesh.add(outlineMesh);
  }
  currentMesh.renderOrder = 0;
  scene.add(currentMesh);
  updateSilhouette();
  updateVolume();
}

function isPointerOnThumb(input, event) {
  const bounds = input.getBoundingClientRect();
  const styles = getComputedStyle(input);
  const thumbRadius = parseFloat(styles.getPropertyValue('--thumb-radius')) || 10;
  const position = Number(input.valueAsNumber);
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const ratio = (position - min) / (max - min);
  const thumbX = bounds.left + thumbRadius + ratio * (bounds.width - thumbRadius * 2);
  return Math.abs(event.clientX - thumbX) <= thumbRadius + 3;
}

function updateRangeTrack(input, shell, min, max) {
  const ratio = (Number(input.value) - min) / (max - min);
  input.style.setProperty('--range-progress', `${ratio * 100}%`);
  shell.style.setProperty('--knob-x', `calc(${ratio * 100}% + ${8 * (1 - 2 * ratio)}px)`);
}

function bindRange(input, shell, min, max, onInput) {
  updateRangeTrack(input, shell, min, max);
  input.addEventListener('input', () => {
    updateRangeTrack(input, shell, min, max);
    onInput(Number(input.value));
  });
  input.addEventListener('pointermove', (event) => shell.classList.toggle('thumb-hovered', isPointerOnThumb(input, event)));
  input.addEventListener('pointerleave', () => shell.classList.remove('thumb-hovered'));
  input.addEventListener('blur', () => shell.classList.remove('thumb-hovered'));
}

function renderParameters() {
  parameterList.innerHTML = '';
  activeShape.params.forEach((param) => {
    const value = values[activeShape.id][param.key];
    const row = document.createElement('label');
    row.className = 'parameter-row';
    row.innerHTML = `
      <span class="parameter-topline"><span class="parameter-name">${parameterName(activeShape, param)}</span><span class="parameter-value"><strong>${value}</strong><small>${parameterUnit(param.unit || '')}</small></span></span>
      <span class="range-shell"><input class="parameter-range" type="range" min="${param.min}" max="${param.max}" step="${param.step}" value="${value}" aria-label="${parameterName(activeShape, param)}"></span>
    `;
    const input = row.querySelector('input');
    const valueLabel = row.querySelector('.parameter-value strong');
    const shell = row.querySelector('.range-shell');
    bindRange(input, shell, param.min, param.max, (nextValue) => {
      values[activeShape.id][param.key] = nextValue;
      valueLabel.textContent = nextValue;
      updateGeometry();
    });
    parameterList.appendChild(row);
  });
}

function setupAppearanceControls() {
  const opacityRange = document.querySelector('#opacity-range');
  const opacityShell = opacityRange.closest('.range-shell');
  const opacityLabel = document.querySelector('#opacity-value');
  opacityRange.value = Math.round(opacity * 100);
  opacityLabel.textContent = `${Math.round(opacity * 100)}%`;
  bindRange(opacityRange, opacityShell, Number(opacityRange.min), Number(opacityRange.max), (nextValue) => {
    opacity = nextValue / 100;
    opacityLabel.textContent = `${nextValue}%`;
    const isTransparent = opacity < 1;
    if (objectMaterial.transparent !== isTransparent) objectMaterial.needsUpdate = true;
    objectMaterial.transparent = isTransparent;
    objectMaterial.opacity = opacity;
    objectMaterial.depthWrite = true;
  });

  const outlineToggle = document.querySelector('#outline-toggle');
  outlineToggle.addEventListener('change', () => {
    showOutline = outlineToggle.checked;
    if (outlineMesh) outlineMesh.visible = showOutline;
    if (showOutline && !outlineMesh) updateGeometry();
  });
}

function selectShape(shape) {
  activeShape = shape;
  document.querySelector('#object-name').textContent = shapeName(shape);
  document.querySelector('#object-description').textContent = shapeDescription(shape);
  document.querySelector('#stage-label').textContent = shape.english;
  document.querySelector('#object-number').textContent = `${String(shapes.indexOf(shape) + 1).padStart(2, '0')} / ${String(shapes.length).padStart(2, '0')}`;
  document.querySelectorAll('.shape-option').forEach((button) => {
    const selected = button.dataset.shape === shape.id;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  renderParameters();
  updateGeometry();
}

function applyLanguage() {
  const labels = {
    'topbar-caption': 'topbar', 'hero-title': 'title', 'hero-accent': 'accent', 'stage-caption': 'preview', 'stage-hint': 'drag',
    'catalog-eyebrow': 'catalog', 'catalog-title': 'choose', 'shape-count-label': 'objects', 'settings-eyebrow': 'settings',
    'dimensions-label': 'dimensions', 'appearance-heading': 'appearance', 'opacity-label': 'opacity', 'outline-label': 'outline',
    'volume-label': 'volume', 'volume-units': 'cubic', 'live-note': 'live', 'footer-credit': 'footer',
  };
  Object.entries(labels).forEach(([id, key]) => {
    document.querySelector(`#${id}`).textContent = ui(key);
  });
  document.querySelector('#hero-eyebrow').firstChild.textContent = `${ui('hero')} `;
  document.querySelector('#units-label').firstChild.textContent = `${ui('units')} `;
  document.querySelector('#about-link').firstChild.textContent = `${ui('about')} `;
  document.querySelector('#reset-view').title = ui('reset');
  document.querySelector('#reset-view').setAttribute('aria-label', ui('reset'));
  document.querySelector('#inspector').setAttribute('aria-label', ui('inspector'));
  shapeList.setAttribute('aria-label', ui('shapePicker'));
  document.querySelector('#language-toggle').textContent = language === 'ru' ? 'EN' : 'RU';
  document.querySelector('#language-toggle').setAttribute('aria-label', ui('switchLanguage'));
  document.documentElement.lang = language;
  document.title = ui('titleTag');
  document.querySelector('meta[name="description"]').content = ui('metaDescription');

  document.querySelectorAll('.shape-option').forEach((button) => {
    const shape = shapes.find((item) => item.id === button.dataset.shape);
    button.querySelector('.shape-name').textContent = shapeName(shape);
    button.setAttribute('aria-label', shapeName(shape));
  });
  document.querySelector('#object-name').textContent = shapeName(activeShape);
  document.querySelector('#object-description').textContent = shapeDescription(activeShape);
  renderParameters();
}

shapes.forEach((shape, index) => {
  const button = document.createElement('button');
  button.className = `shape-option${index === 0 ? ' is-active' : ''}`;
  button.type = 'button';
  button.dataset.shape = shape.id;
  button.setAttribute('aria-pressed', String(index === 0));
  button.innerHTML = `<span class="shape-symbol" aria-hidden="true">${shape.symbol}</span><span class="shape-name">${shapeName(shape)}</span><span class="shape-english">${shape.english}</span>`;
  button.addEventListener('click', () => selectShape(shape));
  shapeList.appendChild(button);
});

document.querySelector('#reset-view').addEventListener('click', () => {
  controls.reset();
  if (currentMesh) currentMesh.rotation.set(0.16, 0.32, 0);
});
document.querySelector('#language-toggle').addEventListener('click', () => {
  language = language === 'ru' ? 'en' : 'ru';
  applyLanguage();
});

function resize() {
  const { width, height } = canvasWrap.getBoundingClientRect();
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

new ResizeObserver(resize).observe(canvasWrap);
resize();
setupAppearanceControls();
applyLanguage();
renderParameters();
updateGeometry();

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  fillLight.position.x = Math.sin(elapsed * 0.35) * 4;
  controls.update();
  updateSilhouette();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('beforeunload', () => {
  renderer.dispose();
  objectMaterial.dispose();
});