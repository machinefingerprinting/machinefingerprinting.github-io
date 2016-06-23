$(function() {

  if (!Detector.webgl)
    Detector.addGetWebGLMessage();

  Math.seedrandom("Three.js bubbles renderer seed");
  var container;

  var camera, scene, renderer;

  var mesh, zmesh, lightMesh, geometry;
  var spheres = [];

  var directionalLight, pointLight;

  var windowHalfX = 256 / 2;
  var windowHalfY = 256 / 2;

  init();
  animate();

  function init() {

    container = $('body')[0];

    camera = new THREE.PerspectiveCamera(60, 256 / 256, 1, 100000);
    camera.position.z = 3200;

    //

    var path = "./three/textures/cube/Park2/";
    var format = '.png';
    var urls = [
      path + 'posx' + format, path + 'negx' + format, path + 'posy' + format,
      path + 'negy' + format, path + 'posz' + format, path + 'negz' + format
    ];

    var textureCube = new THREE.CubeTextureLoader().load(urls);
    textureCube.format = THREE.RGBFormat;

    scene = new THREE.Scene();
    scene.background = textureCube;

    //

    var geometry = new THREE.SphereGeometry(100, 32, 16);

    var shader = THREE.FresnelShader;
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms["tCube"].value = textureCube;

    var material = new THREE.ShaderMaterial({
      uniforms : uniforms,
      vertexShader : shader.vertexShader,
      fragmentShader : shader.fragmentShader
    });

    for (var i = 0; i < 500; i++) {

      var mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = Math.random() * 10000 - 5000;
      mesh.position.y = Math.random() * 10000 - 5000;
      mesh.position.z = Math.random() * 10000 - 5000;

      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

      scene.add(mesh);

      spheres.push(mesh);
    }

    scene.matrixAutoUpdate = false;

    //

    renderer = new THREE.WebGLRenderer({
      antialias : false,
      preserveDrawingBuffer : true,
      willReadFrequently : false,
      depth : true
    });
    renderer.setPixelRatio(1);
    renderer.setSize(256, 256);
    container.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize() {

    windowHalfX = 256 / 2;
    windowHalfY = 256 / 2;

    camera.aspect = 256 / 256;
    camera.updateProjectionMatrix();

    renderer.setSize(256, 256);
  }

  //

  function animate() {

    requestAnimationFrame(animate);

    render();
  }
  var level = 0;
  function render() {

    var timer = 0.005 * level;

    camera.position.x += (camera.position.x) * .05;
    camera.position.y += (camera.position.y) * .05;

    camera.lookAt(scene.position);

    for (var i = 0, il = spheres.length; i < il; i++) {

      var sphere = spheres[i];

      sphere.position.x = 5000 * Math.cos(timer + i);
      sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
    }

    renderer.render(scene, camera);
    ++level;
    if (level == 50) {
      getData(renderer.getContext(), 'three_bubbles', -1);
    }
  }
});