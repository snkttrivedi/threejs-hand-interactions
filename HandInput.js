
// HandInput.js - Encapsulates MediaPipe Hand Tracking

const HANDS_VERSION = "0.4"; 

export class HandInput {
    constructor({ videoElement, onResults, statusElement }) {
        this.videoElement = videoElement;
        this.onResults = onResults;
        this.statusElement = statusElement;
        this.hands = null;
        this.camera = null;
        this.isReady = false;
    }

    async init() {
        this.updateStatus('Loading AI...');
        
        try {
            // Initialize MediaPipe Hands
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.hands.onResults((results) => {
                if(this.onResults) this.onResults(results);
            });
            
            await this.hands.initialize();
            this.updateStatus('Starting Camera...');

            // Start Camera
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    await this.hands.send({image: this.videoElement});
                },
                width: 1280, 
                height: 720
            });
            
            await this.camera.start();
            this.isReady = true;
            this.updateStatus('Hand Tracking Ready');
        } catch (error) {
            console.error("HandInput Error:", error);
            this.updateStatus(`Error: ${error.message}`);
        }
    }

    updateStatus(message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
        }
    }
}
