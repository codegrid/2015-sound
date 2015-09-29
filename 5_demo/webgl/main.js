(function(global, document) {
  'use strict';

  var THREE = global.THREE;
  var VolumetricFire = global.VolumetricFire;

  VolumetricFire.texturePath = './';

  var width = window.innerWidth;
  var height = window.innerHeight;
  var clock = new THREE.Clock();
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 1000 );
  camera.position.set( 0, 1, 6 );
  camera.rotation.set( -0.1, -0.1, 0 );

  global.camera = camera;

  global.addEventListener('keydown', function(ev) {
    // left
    if (ev.keyCode === 37) {
      camera.position.x -= 0.5;
      if (camera.position.x < -5) { camera.position.x = -5; }
    }
    // up
    if (ev.keyCode === 38) {
      camera.position.z -= 0.5;
      if (camera.position.z < 2) { camera.position.z = 2; }
    }
    // right
    if (ev.keyCode === 39) {
      camera.position.x += 0.5;
      if (camera.position.x > 5) { camera.position.x = 5; }
    }
    // down
    if (ev.keyCode === 40) {
      camera.position.z += 0.5;
      if (camera.position.z > 6) { camera.position.z = 6; }
    }
  }, false);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );

  var ambientlight = new THREE.AmbientLight( 0x666655 );
  scene.add( ambientlight );

  var pointlight = new THREE.PointLight( 0xff9933, 1, 1.5 );
  pointlight.position.set( 0, 1, 0 );
  scene.add( pointlight );

  var groundColor = THREE.ImageUtils.loadTexture( './groundcolor.jpg' );
  groundColor.wrapS = groundColor.wrapT = THREE.RepeatWrapping;
  groundColor.repeat.set( 6, 6 );
  var groundNormal = THREE.ImageUtils.loadTexture( './groundnormal.jpg' );
  groundColor.wrapS = groundColor.wrapT = THREE.RepeatWrapping;
  groundColor.repeat.set( 6, 6 );
  var ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 10, 10 ),
    new THREE.MeshPhongMaterial( {
      map: groundColor,
      normalMap: groundNormal,
      normalScale: new THREE.Vector2( 0.8, 0.8 ),
    } )
  );

  ground.rotation.x = Math.PI / -2;
  scene.add( ground );


  var fireplace;
  var loader = new THREE.JSONLoader();
  loader.load( './fireplace.json', function ( geometry, materials ) {

    fireplace = new THREE.Mesh(
      geometry,
      new THREE.MeshFaceMaterial( materials )
    );

    scene.add( fireplace );

  } );


  var fireWidth  = 1.5;
  var fireHeight = 2;
  var fireDepth  = 1.5;
  var sliceSpacing = 0.5;

  var fire = new VolumetricFire(
    fireWidth,
    fireHeight,
    fireDepth,
    sliceSpacing,
    camera
  );
  scene.add( fire.mesh );
  // you can set position, rotation and scale
  // fire.mesh accepts THREE.mesh features
  fire.mesh.position.set( 0, fireHeight / 2, 0 );


  var smoke,
      vertexShader,
      fragmentShader,
      texture,
      attributes,
      uniforms,
      material,
      geometry = new THREE.Geometry(),
      vertex,
      i;

  vertexShader = document.getElementById( 'smoke-vertexshader' ).textContent;
  fragmentShader = document.getElementById( 'smoke-fragmentshader' ).textContent;
  texture = THREE.ImageUtils.loadTexture( './smoke.png' );
  attributes = { shift: {type: 'f', value: [] } };
  uniforms = {
    time:       { type: 'f', value: 0 },
    size:       { type: 'f', value: 3 },
    texture:    { type: 't', value: texture },
    lifetime:   { type: 'f', value: 10 },
    projection: { type :'f', value: Math.abs( height / ( 2 * Math.tan( THREE.Math.degToRad( camera.fov ) ) ) ) }
  };
  material = new THREE.ShaderMaterial( {
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    attributes: attributes,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  } );

  for ( i = 0; i < 32; i ++ ) {

    vertex = new THREE.Vector3(
      THREE.Math.randFloat( -0.5, 0.5 ),
      2.5,
      THREE.Math.randFloat( -0.5, 0.5 )
    );
    geometry.vertices.push( vertex );
    material.attributes.shift.value.push( Math.random() * 1 );

  }

  smoke = new THREE.PointCloud( geometry, material );
  smoke.sortParticles = true;
  smoke.renderOrder = 0;
  scene.add( smoke );


  ( function animate () {

    requestAnimationFrame( animate );

    var elapsed = clock.getElapsedTime();

    pointlight.intensity = Math.sin( elapsed * 30 ) * 0.25 + 3;

    smoke.material.uniforms.time.value = clock.getElapsedTime();
    fire.update( elapsed );

    renderer.render( scene, camera );

  } )();

}(window, document));
