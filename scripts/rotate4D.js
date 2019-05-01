/**
 * @author whitekj
 * 
 * Rotates a 4D mesh in one of 6 directions
 *
 * mode: 2D Plane to perform rotation in
 * mesh: Mesh to rotate
 * theta: Rotation distance
 */

function rotate4D(mode, mesh, theta) {
    //Construct rotation matrix based on mode
    let rotationMatrix;
    switch (mode) {
        case "XY":
            rotationMatrix = math.matrix([[math.cos(theta), math.sin(theta), 0, 0, 0],
                                      [-math.sin(theta), math.cos(theta), 0, 0, 0],
                                      [0, 0, 1, 0, 0],
                                      [0, 0, 0, 1, 0],
                                      [0, 0, 0, 0, 1]]);
            break;
        case "XZ":
            rotationMatrix = math.matrix([[math.cos(theta), 0, math.sin(theta), 0, 0], 
                                      [0, 1, 0, 0, 0], 
                                      [-math.sin(theta), 0, math.cos(theta), 0, 0], 
                                      [0, 0, 0, 1, 0], 
                                      [0, 0, 0, 0, 1]]);
            break;
        case "YZ":
            rotationMatrix = math.matrix([[1, 0, 0, 0, 0],
                                      [0, math.cos(theta), -math.sin(theta), 0, 0], 
                                      [0, math.sin(theta), math.cos(theta), 0, 0], 
                                      [0, 0, 0, 1, 0], 
                                      [0, 0, 0, 0, 1]]);
            break;
        case "XW":
            rotationMatrix = math.matrix([[math.cos(theta), 0, 0, math.sin(theta), 0],
                                      [0, 1, 0, 0, 0], 
                                      [0, 0, 1, 0, 0], 
                                      [-math.sin(theta), 0, 0, math.cos(theta), 0], 
                                      [0, 0, 0, 0, 1]]);
            break;
        case "YW":
            rotationMatrix = math.matrix([[1, 0, 0, 0, 0],
                                      [0, math.cos(theta), 0, -math.sin(theta), 0], 
                                      [0, 0, 1, 0, 0], 
                                      [0, math.sin(theta), 0, math.cos(theta), 0], 
                                      [0, 0, 0, 0, 1]]);
            break;
        case "ZW":
            rotationMatrix = math.matrix([[1, 0, 0, 0, 0],
                                      [0, 1, 0, 0, 0], 
                                      [0, 0, math.cos(theta), -math.sin(theta), 0], 
                                      [0, 0, math.sin(theta), math.cos(theta), 0], 
                                      [0, 0, 0, 0, 1]]);
            break;
        default:
            console.log("ERROR: Bad rotate4D mode");
            return;
    }
        
    //multiply each vertex in mesh by rotation matrix
    let vertices = mesh.geometry.vertices;
    for (i=0;i<vertices.length;i++) {
        let vertex = vertices[i];
        let vertexMatrix = [vertex.x,vertex.y,vertex.z,vertex.w,1];
        let product = math.multiply(rotationMatrix,vertexMatrix);
        let updatedMatrix = product._data; //extract matrix data
        vertices[i].x = updatedMatrix[0];
        vertices[i].y = updatedMatrix[1];
        vertices[i].z = updatedMatrix[2];
        vertices[i].w = updatedMatrix[3];
    }
    
    //update mesh's vertices
    mesh.geometry.vertices = vertices;
    mesh.geometry.verticesNeedUpdate=true;
    mesh.geometry.computeFlatVertexNormals();
        
}
