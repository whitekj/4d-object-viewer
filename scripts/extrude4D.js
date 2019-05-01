/**
 * @author whitekj
 * 
 * Extrudes a 3D mesh into a 4D mesh
 *
 * mesh: Mesh to extrude
 * distance: Extrusion distance
 * edgesOnly: True if edges-only display should be used
 */


function extrude(mesh,distance,edgesOnly) {
    
    //If no distance given, set to 0
    distance = (typeof distance !== 'undefined') ?  distance : 0;
    
    //Extract geometry from mesh
    let geometry = mesh.geometry;
    
    //If edgesOnly=true, convert to EdgesGeometry
    if(edgesOnly) {
        let edges = new THREE.EdgesGeometry( geometry );
        geometry = new THREE.Geometry().fromBufferGeometry( edges );
    }
    //If object is a BufferGeometry, convert to regular Geometry
    if (geometry.type.includes("BufferGeometry")) {
        geometry = new THREE.Geometry().fromBufferGeometry( geometry );
    }
    
    //Create material
    let material;
    if(edgesOnly) {
        material = new THREE.LineBasicMaterial({ color: 0xffffff });
    }
    else {
        material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    }
    
    //Add 4th dimension to original vertices
    addW(geometry);
    
    //Get vertices and faces of "near" geometry
    let nearVertices = geometry.vertices.slice();
    let numVertices = nearVertices.length;
    let nearFaces = geometry.faces;
    
    
    //Create "far" vertices and faces 
    let farVertices = [];
    for(i=0;i<numVertices;i++) {
        farVertices[i] = nearVertices[i].clone();
        farVertices[i].w = distance;
    }
    let farFaces = [];
    if(!edgesOnly) { //faces don't matter for edgesonly
        for(i=0;i<nearFaces.length;i++) {
            farFaces.push(new THREE.Face3(nearFaces[i].a+numVertices,
                                          nearFaces[i].b+numVertices,
                                          nearFaces[i].c+numVertices));
        }
    }
    //combine near and far vertices/faces
    let nearFarVertices = nearVertices.concat(farVertices);
    let nearFarFaces = nearFaces.concat(farFaces);
    
    
    //Create "side" vertices and faces
    let sideVertices = [];
    let sideFaces = [];
    if(edgesOnly) {
        for(i=0;i<numVertices;i++) {
            sideVertices.push(nearFarVertices[i]);
            sideVertices.push(nearFarVertices[i+numVertices]);
        }
    }
    else {
        //Get array of edges
        let edges = [];
        for(let i=0;i<nearFaces.length;i++) {
            let edge1 = {};
            let edge2 = {};
            let edge3 = {};
            edge1.a = nearFaces[i].a;
            edge1.b = nearFaces[i].b;
            edge2.a = nearFaces[i].b;
            edge2.b = nearFaces[i].c;
            edge3.a = nearFaces[i].c;
            edge3.b = nearFaces[i].a;
            //check if edge already exists before adding
            if(!edges.includes(edge1)) {    
                edges.push(edge1);
            }
            if(!edges.includes(edge2)) {
                edges.push(edge2);
            }
            if(!edges.includes(edge3)) {
                edges.push(edge3);
            }
        }
        //For each edge, create 2 faces forming the rectangular face btwn near-far edges
        for(i=0;i<edges.length;i++) {
            sideFaces.push(new THREE.Face3(edges[i].a,
                                           edges[i].b,
                                           (edges[i].a+numVertices)));
            sideFaces.push(new THREE.Face3(edges[i].b,
                                           (edges[i].b+numVertices),
                                           (edges[i].a+numVertices)));
        }
    }
    //Combine all faces and vertices
    let combinedVertices = nearFarVertices.concat(sideVertices);
    let combinedFaces = nearFarFaces.concat(sideFaces);
    
    //Update geometry
    geometry.vertices = combinedVertices;
    geometry.faces = combinedFaces;
    geometry.verticesNeedUpdate=true;
    geometry.elementsNeedUpdate=true;
    
    //Return extruded mesh
    let extrudedMesh;
    if(edgesOnly) {
        extrudedMesh = new THREE.LineSegments( geometry, material);
    }
    else {
        extrudedMesh = new THREE.Mesh(geometry, material);
    }
    return extrudedMesh;
}



//Adds a w coordinate, set to 0, to each vertex of a given geometry

function addW(geometry) {
    for(i=0;i<geometry.vertices.length;i++) {
        geometry.vertices[i].w = 0;
    }
}