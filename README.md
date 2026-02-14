# 🖐️ Three.js Hand Interactions

A real-time AR experience demonstrating gesture-based 3D object manipulation using MediaPipe and Three.js. Features smooth physics, shape switching, and dynamic scaling.

## ✨ Features

- **Real-Time Hand Tracking**: Detects 21 3D landmarks on each hand with high precision.
- **Interactive 3D Objects**: Control virtual objects naturally with hand gestures.
- **Dynamic Physics**: Smooth rotation and scaling with momentum for a physical feel.
- **Modular Architecture**: Clean, class-based code structure (ES Modules) for easy scalability.
- **Classic Aesthetic**: Minimalist wireframe design with neon accents.

## 🎮 Controls

The experience is designed for two-hand interaction:

| Hand           | Gesture      | Action                                                         |
| -------------- | ------------ | -------------------------------------------------------------- |
| **Right Hand** | 🤌 **Pinch** | **Resize** the object (Distance between fingers controls size) |
| **Right Hand** | 👋 **Move**  | **Rotate** the object based on hand position                   |
| **Left Hand**  | 🤌 **Pinch** | **Switch Shape** (Cycle: Sphere ➡️ Cube ➡️ Torus)              |
| **Left Hand**  | 👉 **Touch** | **Change Color** (Touch the object to set a random neon color) |
| **Left Hand**  | 👋 **Move**  | **Rotate** the object based on hand position                   |

## 🚀 How to Run

Because this project uses modern ES Modules, you cannot simply open `index.html` in a browser. You must run a local server.

### Option 1: VS Code Live Server (Recommended)

1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html`.
3. Select **"Open with Live Server"**.

### Option 2: Python (Built-in)

Run this command in your terminal:

```bash
python3 -m http.server
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 3: Node.js

If you have Node.js installed:

```bash
npx serve .
```

## 📂 Project Structure

```
├── index.html          # Main entry point & UI
├── style.css           # Minimalist styling
├── src/
│   ├── main.js        # App orchestrator & Interaction logic
│   ├── World.js       # Three.js 3D scene, shapes, lighting
│   ├── HandInput.js   # MediaPipe AI implementation
│   └── Overlayer.js   # 2D Canvas skeleton drawing
└── README.md           # Documentation
```

## 🛠️ Tech Stack

- **[Three.js](https://threejs.org/)**: 3D Rendering Engine.
- **[MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)**: Machine Learning Hand Tracking.
- **Vanilla JavaScript (ES6+)**: No bundlers required, just pure native web standards.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
