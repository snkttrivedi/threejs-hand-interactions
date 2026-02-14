
import { World } from './World.js';
import { HandInput } from './HandInput.js';
import { Overlayer } from './Overlayer.js';

class App {
    constructor() {
        this.videoElement = document.getElementById('webcam');
        this.canvasElement = document.getElementById('canvas');
        this.statusElement = document.getElementById('status');
        this.threeContainer = document.getElementById('three-canvas');

        this.world = new World(this.threeContainer);
        this.overlayer = new Overlayer(this.canvasElement);
        this.handInput = new HandInput({
            videoElement: this.videoElement,
            statusElement: this.statusElement,
            onResults: (results) => this.process(results)
        });
        
        // Hand tracking variables
        this.rightHandActive = false;
        this.leftHandActive = false;
        this.lastColorChangeTime = 0;
        this.colorChangeDelay = 500; // milliseconds
        this.lastShapeChangeTime = 0;
    }

    init() {
        this.handInput.init();
        this.world.animate(); // Start Three.js loop
        
        // Listen for resize
        window.addEventListener('resize', () => {
             this.overlayer.resize();
             this.world.onResize();
        });
    }

    process(results) {
        // Draw 2D Overlay
        this.overlayer.checkResize(window.innerWidth, window.innerHeight);
        this.overlayer.draw(results);

        // Reset
        this.rightHandActive = false;
        this.leftHandActive = false;

        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            this.statusElement.textContent = 'No hands detected';
            return;
        }
        
        // Update Status
        const count = results.multiHandLandmarks.length;
        this.statusElement.textContent = count === 1 ? '1 hand detected' : `${count} hands detected`;

        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const landmarks = results.multiHandLandmarks[i];
            const handedness = results.multiHandedness[i].label; // "Left" or "Right"
            const isLeftHand = handedness === 'Left'; // Note: Camera is mirrored so Right appears Left

            if (!isLeftHand) {
                // RIGHT HAND: Control sphere size with thumb-index distance
                const thumbTip = landmarks[4];
                const indexTip = landmarks[8];
                
                // Calculate distance
                const pinchDistance = this.calculateDistance(thumbTip, indexTip);
                
                // Map pinch distance (from original logic)
                let targetSize = 1.0;
                if (pinchDistance < 0.05) {
                    targetSize = 0.2;
                } else if (pinchDistance > 0.25) {
                    targetSize = 2.0;
                } else {
                    targetSize = 0.2 + (pinchDistance - 0.05) * (2.0 - 0.2) / (0.25 - 0.05);
                }
                
                this.world.updateScale(targetSize);

                // Start: Map palm position to rotation
                // Get wrist or palm center. Using wrist (landmark 0) for stable base
                const wrist = landmarks[0];
                
                // wrist.x and wrist.y are 0 to 1.
                // Map 0-1 to -PI to +PI rotation range
                // x affects y rotation (horizontal movement), y affects x rotation (vertical movement)
                const rotY = (wrist.x - 0.5) * Math.PI * 4; // Adjust multiplier for sensitivity
                const rotX = (wrist.y - 0.5) * Math.PI * 4;

                this.world.setRotation(rotX, rotY);
                // End: Map palm position to rotation

                this.rightHandActive = true;

            } else {
                // LEFT HAND: Change color when index finger touches sphere
                const indexTip = landmarks[8];
                
                // LEFT HAND GESTURE: TOUCH vs PINCH
                
                // 1. Check Pinch (Shape Switch)
                const leftThumb = landmarks[4];
                const leftIndex = landmarks[8];
                const leftPinchDist = this.calculateDistance(leftThumb, leftIndex);
                
                // Threshold for pinch
                if (leftPinchDist < 0.05) {
                     const now = Date.now();
                     // Debounce shape switching (1 second)
                     if (!this.lastShapeChangeTime || now - this.lastShapeChangeTime > 1000) {
                         this.world.cycleShape();
                         this.lastShapeChangeTime = now;
                     }
                } 
                // 2. Check Touch (Color Switch) - Only if NOT pinching
                else if (this.world.checkInteraction(leftIndex)) {
                     const currentTime = Date.now();
                     if (currentTime - this.lastColorChangeTime > this.colorChangeDelay) {
                        const newColor = this.getRandomNeonColor();
                        this.world.updateColor(newColor);
                        this.lastColorChangeTime = currentTime;
                     }
                     this.leftHandActive = true;
                }

                // Map Left Hand Rotation
                const wrist = landmarks[0];
                const rotY = (wrist.x - 0.5) * Math.PI * 4; 
                const rotX = (wrist.y - 0.5) * Math.PI * 4;
                this.world.setRotation(rotX, rotY);
            }
        }
    }

    calculateDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    
    getRandomNeonColor() {
        const neonColors = [
            0xFF00FF, // Magenta
            0x00FFFF, // Cyan
            0xFF3300, // Neon Orange
            0x39FF14, // Neon Green
            0xFF0099, // Neon Pink
            0x00FF00, // Lime
            0xFF6600, // Neon Orange-Red
            0xFFFF00  // Yellow
        ];
        return neonColors[Math.floor(Math.random() * neonColors.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
