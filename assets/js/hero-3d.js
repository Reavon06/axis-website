/**
 * Home hero 3D — trefoil torus knot + wireframe icosahedron (matches React Three scene).
 */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

function initHero3D() {
  const container = document.getElementById('hero-canvas')
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const w = container.clientWidth
  const h = container.clientHeight
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(33, w / h, 0.1, 100)
  camera.position.set(0, 0.12, 5.35)

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  scene.add(new THREE.AmbientLight(0xffffff, 0.34))
  const dir1 = new THREE.DirectionalLight(0xffffff, 1.15)
  dir1.position.set(6, 7, 5)
  scene.add(dir1)
  const dir2 = new THREE.DirectionalLight(0xdbe4f0, 0.38)
  dir2.position.set(-5, -2, -4)
  scene.add(dir2)

  const addPoint = (color, pos, intensity, distance) => {
    const p = new THREE.PointLight(color, intensity, distance, 2)
    p.position.set(...pos)
    scene.add(p)
  }
  addPoint(0xf2f7c8, [3.8, 2.2, 2.8], 0.7, 16)
  addPoint(0x2eaee3, [2.5, -1.5, 3], 0.45, 14)
  addPoint(0x28a870, [-3, 1, 2], 0.28, 12)

  const root = new THREE.Group()
  const knotGroup = new THREE.Group()
  const wireGroup = new THREE.Group()

  const wireGeo = new THREE.IcosahedronGeometry(1.18, 2)
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xc8ead8,
    wireframe: true,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  })
  wireGroup.add(new THREE.Mesh(wireGeo, wireMat))

  const knotGeo = new THREE.TorusKnotGeometry(0.52, 0.15, 280, 32, 2, 3)
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: 0x4e5fd4,
    metalness: 0.88,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.35,
  })
  knotGroup.add(new THREE.Mesh(knotGeo, knotMat))

  root.add(wireGroup)
  root.add(knotGroup)
  scene.add(root)

  const clock = new THREE.Clock()

  function animate() {
    requestAnimationFrame(animate)
    const t = clock.getElapsedTime()
    const delta = clock.getDelta()

    root.rotation.x = t * 0.21 + Math.sin(t * 0.17) * 0.08
    root.rotation.y = t * 0.33
    root.rotation.z = t * 0.13 + Math.cos(t * 0.19) * 0.07
    root.position.y = Math.sin(t * 0.55) * 0.055

    knotGroup.rotation.x += delta * 0.12
    knotGroup.rotation.y += delta * 0.2
    knotGroup.rotation.z += delta * 0.07

    wireGroup.rotation.x = t * -0.09
    wireGroup.rotation.y = t * -0.16
    wireGroup.rotation.z = t * 0.05

    renderer.render(scene, camera)
  }

  const onResize = () => {
    const nw = container.clientWidth
    const nh = container.clientHeight
    camera.aspect = nw / nh
    camera.updateProjectionMatrix()
    renderer.setSize(nw, nh)
  }
  window.addEventListener('resize', onResize)
  animate()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3D)
} else {
  initHero3D()
}
