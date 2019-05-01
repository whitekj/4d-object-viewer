/** 
 * @author whitekj
 *
 * Handles the three.js scene
 */

let targetRotationX = 0; 
let targetRotationY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let shiftIsPressed = false;
let ctrlIsPressed = false;

window.onload = init;
            
function init() {
    //Get parameters
    let input = location.search;
    let parameters = input.substring(1).split("&");
    let shape = parameters[0].split("=")[1];
    let useGUI = input.includes("useGUI=on");
    let useEdges = input.includes("useEdges=on");
    
    //Create scene, camera, and controls
    let scene=new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 2000 );
    camera.position.x=10.0;
    camera.position.y=15.0;
    camera.position.z=30.0;
    camera.lookAt(0,0,0);
    let controls = new THREE.OrbitControls(camera);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
                
    //Create geometry based on parameter
    let geo; //geometry to extrude
    let distance; //distance to extrude
    switch(shape) {
        case "sphere":
            distance = 7;
            geo = new THREE.IcosahedronGeometry(distance,2);
            break;
        case "cylinder":
            distance = 8;
            geo  = new THREE.CylinderGeometry( 5, 5, distance, 32 );
            break;
        case "ring":
            distance = 8;
            geo = new THREE.TorusGeometry( distance, 3, 12, 20 );
            break;
        case "tetra":
            distance = 8;
            geo = new THREE.TetrahedronGeometry(distance);
            break;
        case "octa":
            distance = 8;
            geo = new THREE.OctahedronGeometry(distance);
            break;
        default: //default = cube
            distance = 10;
            geo = new THREE.BoxGeometry(distance,distance,distance);
            break;
    }
    let mesh3D = new THREE.Mesh( geo, new THREE.MeshNormalMaterial() );
    let mesh = extrude(mesh3D,distance,useEdges);
    scene.add(mesh);
    rotate4D("XY",mesh, 0); //Makes sure that object appears
    
     class GUIController {
            constructor() {
                this.rotateXW = false;
                this.rotateYW = false;
                this.rotateZW = false;
                this.rotateXZ = false;
                this.speed = 3;
            }
            rotateXW() {
                this.rotateXW = !this.rotateXW;
            }
            rotateYW() {
                this.rotateYW = !this.rotateYW;
            }
            rotateZW() {
                this.rotateZW = !this.rotateZW;
            }
            rotateXZ() {
                this.rotateXZ = !this.rotateXZ;
            }
        }
    
    let guiController;
    let animate;
    
    if(useGUI) {
        let gui = new dat.GUI();
        guiController = new GUIController();
        gui.add(guiController,'rotateXW');
        gui.add(guiController,'rotateYW');
        gui.add(guiController,'rotateZW');
        gui.add(guiController,'rotateXZ');
        gui.add(guiController,'speed',0,10);

        animate = function() {
            window.requestAnimationFrame( animate );
            renderGUI();
        };
    }
                
    else {
        //If manual mode, add rotation instructions
        document.getElementById("info").innerHTML = "SHIFT to Rotate in 4D";
        
         animate = function() {
            window.requestAnimationFrame( animate );
            renderManual();
        };
    }
                
    function renderGUI() {
        if(guiController.rotateXW){
            rotate4D("XW",mesh, guiController.speed/200);
        }
        if(guiController.rotateYW) {
            rotate4D("YW",mesh, guiController.speed/200);
        }
        if(guiController.rotateZW) {
            rotate4D("ZW",mesh, guiController.speed/200);
        }
        if(guiController.rotateXZ) {
            rotate4D("XZ",mesh, guiController.speed/200);
        }
        controls.update();
        renderer.render(scene,camera);
    }
    
    function renderManual() {
        //If shift or ctrl is pressed, rotate in 4 dimensions
        if(shiftIsPressed || ctrlIsPressed) {
            rotate4D("XW",mesh, targetRotationX);
            rotate4D("YW",mesh, targetRotationY);
        }
        //Otherwise rotate in 3
        else {
            rotate4D("XZ",mesh, targetRotationX);
            rotate4D("YZ",mesh, targetRotationY);
        }

        renderer.render(scene,camera);
    }
    
    animate();
}

//Mouse listeners for manual rotation

function onDocumentMouseDown( event ) {

                event.preventDefault();

                document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                document.addEventListener( 'mouseup', onDocumentMouseUp, false );
                document.addEventListener( 'mouseout', onDocumentMouseOut, false );

                mouseXOnMouseDown = event.clientX - windowHalfX;
                mouseYOnMouseDown = event.clientY - windowHalfY;
                
                //Check if shift or ctrl key is pressed at time of mouse click
                shiftIsPressed = event.shiftKey;
                ctrlIsPressed = event.ctrlKey;
}

function onDocumentMouseMove( event ) {

                mouseX = event.clientX - windowHalfX;
                mouseY = event.clientY - windowHalfY;
                
                targetRotationX = ( mouseX - mouseXOnMouseDown ) * 0.0005;
                targetRotationY = ( mouseY - mouseYOnMouseDown ) * 0.0005;

}

function onDocumentMouseUp( event ) {

                document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {

                document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}