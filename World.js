
// Three.js Logic - Handles Scene, Camera, Renderer, Object

export class World {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentMeshGroup = null;
        
        // State
        this.currentSphereSize = 1.0;
        this.targetSphereSize = 1.0;
        this.smoothingFactor = 0.1; // Slower for smoother feel
        
        // Rotation State
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.rotationSmoothing = 0.1;

        // Shape State
        this.shapes = ['sphere', 'box', 'torus'];
        this.currentShapeIndex = 0;
        
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); 
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        this.scene.add(directionalLight);
        
        // Initial Shape
        this.createShape(this.shapes[0]);
        
        // Handle Resize
        window.addEventListener('resize', () => this.onResize());
    }

    createShape(type) {
        if (this.currentMeshGroup) {
            this.scene.remove(this.currentMeshGroup);
        }

        let geometry;
        switch(type) {
            case 'box':
                geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
                break;
            case 'sphere':
            default:
                geometry = new THREE.SphereGeometry(2, 32, 32);
                break;
        }

        this.currentMeshGroup = new THREE.Group();

        // 1. Wireframe (The Classic Look)
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
        this.currentMeshGroup.add(wireframe);

        // 2. Solid Core (for mass)
        const solidMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8,
            shininess: 60,
            flatShading: true // Classic low-poly feel
        });
        this.solidMesh = new THREE.Mesh(geometry, solidMaterial);
        this.currentMeshGroup.add(this.solidMesh);

        this.scene.add(this.currentMeshGroup);
    }

    cycleShape() {
        this.currentShapeIndex = (this.currentShapeIndex + 1) % this.shapes.length;
        this.createShape(this.shapes[this.currentShapeIndex]);
    }

    onResize() {
        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    updateScale(targetScale) {
        this.targetSphereSize = targetScale;
    }
    
    updateColor(colorHex) {
        if (this.solidMesh) {
            this.solidMesh.material.color.setHex(colorHex);
        }
    }

    setRotation(x, y) {
        this.targetRotation.x = x;
        this.targetRotation.y = y;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.currentMeshGroup) {
            
            // Smooth Rotation (Momentum)
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.rotationSmoothing;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.rotationSmoothing;
            
            this.currentMeshGroup.rotation.x = this.currentRotation.x;
            this.currentMeshGroup.rotation.y = this.currentRotation.y;

            // Pulse Effect (Subtle "Breathing")
            const time = Date.now() * 0.001; 
            if (this.solidMesh) {
                this.solidMesh.material.opacity = 0.6 + 0.2 * Math.sin(time * 2);
            }

            // Smooth Scaling
             this.currentSphereSize += (this.targetSphereSize - this.currentSphereSize) * this.smoothingFactor;
             this.currentMeshGroup.scale.set(this.currentSphereSize, this.currentSphereSize, this.currentSphereSize);
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    // Simple Interaction Check (Raycasting simplified)
    checkInteraction(normalizedPoint) {
       // Simplified logic reusing previous math for simplicity
       // In a full app, use Raycaster.
       const dist = Math.sqrt(Math.pow(normalizedPoint.x - 0.5, 2) + Math.pow(normalizedPoint.y - 0.5, 2));
       return dist < 0.15 * this.currentSphereSize; 
    }
}
