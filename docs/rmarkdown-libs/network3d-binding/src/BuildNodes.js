const generatePointPositions = require('./GeneratePointPositions.js');
const makeNodeMaterial = require('./MakeNodeMaterial.js');

// construct mesh for the nodes.
module.exports = function buildNodes({nodes, nodeColors, nodeSizes, blackOutline}){
  // fill in a blank geometry object with the vertices from our points
  const geometry = new THREE.BufferGeometry(),
        locations = generatePointPositions(nodes),
        material = makeNodeMaterial(blackOutline),
        colorsCopy = new Float32Array([...nodeColors]), // need immutable copies of these guys to not overwrite static defaults
        sizesCopy = new Float32Array([...nodeSizes]);

  geometry.addAttribute('position', new THREE.BufferAttribute( locations, 3 ) );
  geometry.addAttribute('color',    new THREE.BufferAttribute( colorsCopy, 3 ) );
  geometry.addAttribute('size',     new THREE.BufferAttribute( sizesCopy, 1 ) );

  // need to run this so we get a center to aim our camera at.
  geometry.computeBoundingSphere();

  // wrap geometry in material and return along with center
  return new THREE.Points(geometry, material);
};
