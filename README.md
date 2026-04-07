# InvisiPen ✨

InvisiPen is an AI-powered spatial drawing application that allows you to draw, erase, and manipulate canvas elements directly in the air using your hands. Using advanced computer vision and hand tracking, InvisiPen turns your webcam into an interactive digital canvas!

## Features 🚀

- **Air Drawing**: Draw seamlessly in real-time by gesturing with your primary hand.
- **Gesture Control**: Intuitive hand gestures for erasing, moving, scaling, and rotating your drawings.
- **Dual Hand Support**: Use your primary hand to draw and your secondary hand to trigger control actions.
- **Visual Feedback**: Real-time rendering of your fingertips and current active mode.
- **Customizable Tools**: Adjust colors, brush thickness, and glow intensity via the control panel.
- **Undo/Redo & Save**: Easily fix mistakes and save your spatial masterpieces locally.

## Tech Stack 🛠️

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Hand Tracking Core:** [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Styling:** CSS + Tailwind Merge + Lucide Icons

## Getting Started 💻

### Prerequisites
Make sure you have Node.js and npm installed on your machine.
A working webcam is required to use this application!

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Khushikri29/InvisiPen.git
   cd InvisiPen
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/` (or the URL provided in your terminal).

## Usage & Gestures 🤚

When you open the app, grant camera permissions.

- **Raise Hand**: Bring your hand into the camera frame to initiate tracking.
- **Draw**: Use your index finger on your primary hand to sketch on the canvas.
- **Erase**: Specific gesture triggers the eraser tool (your fingertip indicator will grow and turn red).
- **Secondary Actions**: Use your secondary hand to activate Move, Scale, or Rotate modes.

*(Tip: Keep your hands well-lit for optimal camera tracking!)*

## Contributing 🤝

Contributions are welcome! Feel free to open issues or submit pull requests.

## License 📜

This project is licensed under the MIT License.
