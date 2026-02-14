
export class Overlayer {
    constructor(canvasElement) {
        this.canvasElement = canvasElement;
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvasElement.width = window.innerWidth;
        this.canvasElement.height = window.innerHeight;
    }

    checkResize(width, height) {
        if (this.canvasElement.width !== width || this.canvasElement.height !== height) {
            this.resize();
        }
    }

    draw(results) {
        // Clear canvas
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        
        // Process hand landmarks if detected
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Process each hand
            for (let handIndex = 0; handIndex < results.multiHandLandmarks.length; handIndex++) {
                const landmarks = results.multiHandLandmarks[handIndex];
                const handedness = results.multiHandedness[handIndex].label;
                const isLeftHand = handedness === 'Left';
                
                // Draw the hand landmarks with appropriate color
                this.drawLandmarks(landmarks, isLeftHand);
            }
        }
    }

    // Draw hand landmarks on canvas with dynamic sizing
    drawLandmarks(landmarks, isLeft) {
        // Adjust line width and point size based on screen dimension
        const screenSize = Math.min(window.innerWidth, window.innerHeight);
        const lineWidth = Math.max(2, Math.min(5, screenSize / 300));
        const pointSize = Math.max(2, Math.min(8, screenSize / 250));
        
        // Define connections between landmarks
        const connections = [
            // Thumb
            [0, 1], [1, 2], [2, 3], [3, 4],
            // Index finger
            [0, 5], [5, 6], [6, 7], [7, 8],
            // Middle finger
            [0, 9], [9, 10], [10, 11], [11, 12],
            // Ring finger
            [0, 13], [13, 14], [14, 15], [15, 16],
            // Pinky
            [0, 17], [17, 18], [18, 19], [19, 20],
            // Palm
            [0, 5], [5, 9], [9, 13], [13, 17]
        ];
        
        // Choose a different color for each hand
        const handColor = isLeft ? '#00FF00' : '#00FFFF';
        
        // Draw connections
        this.canvasCtx.lineWidth = lineWidth;
        this.canvasCtx.strokeStyle = handColor;
        
        connections.forEach(([i, j]) => {
            const start = landmarks[i];
            const end = landmarks[j];
            
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(start.x * this.canvasElement.width, start.y * this.canvasElement.height);
            this.canvasCtx.lineTo(end.x * this.canvasElement.width, end.y * this.canvasElement.height);
            this.canvasCtx.stroke();
        });
        
        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            // Special color for thumb tip (index 4) and index finger tip (index 8)
            let pointColor = handColor;
            if (index === 4 || index === 8) {
                pointColor = '#FF0000';
            }
            
            this.canvasCtx.fillStyle = pointColor;
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(
                landmark.x * this.canvasElement.width,
                landmark.y * this.canvasElement.height,
                pointSize * 1.2,  // Make thumb and index fingertips slightly larger
                0,
                2 * Math.PI
            );
            this.canvasCtx.fill();
        });
    }
}
