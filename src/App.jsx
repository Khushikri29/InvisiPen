import React, { useState, useRef, useCallback, useMemo } from 'react';
import CameraView from './components/CameraView';
import DrawingCanvas from './components/DrawingCanvas';
import HelpPanel from './components/HelpPanel';
import ControlPanel from './components/ControlPanel';
import { GestureInterpreter, CONTROL_GESTURES } from './modules/gestureInterpreter';
import { GESTURES } from './modules/gestureController';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [settings, setSettings] = useState({
    color: '#00ffff',
    lineWidth: 8,
    glowIntensity: 20,
  });

  // Primary hand (drawing)
  const [gesture, setGesture] = useState(GESTURES.IDLE);
  const [landmark, setLandmark] = useState(null);
  const [fingertips, setFingertips] = useState([]);

  // Secondary hand (control)
  const [controlGesture, setControlGesture] = useState(CONTROL_GESTURES.IDLE);
  const [controlLandmark, setControlLandmark] = useState(null);
  const [controlFingertips, setControlFingertips] = useState([]);
  const [controlPinchDelta, setControlPinchDelta] = useState(0);
  const [controlAngleDelta, setControlAngleDelta] = useState(0);

  const [cameraVisible, setCameraVisible] = useState(true);
  const [gesturesEnabled, setGesturesEnabled] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const canvasRef = useRef(null);
  const interpreter = useMemo(() => new GestureInterpreter(), []);

  const onResults = useCallback((results) => {
    if (!gesturesEnabled) {
      setGesture(GESTURES.IDLE);
      setLandmark(null);
      setFingertips([]);
      setControlGesture(CONTROL_GESTURES.IDLE);
      setControlLandmark(null);
      setControlFingertips([]);
      return;
    }

    const { primary, secondary } = interpreter.interpret(results);

    // Primary hand
    setGesture(primary.gesture);
    setLandmark(primary.landmark);
    setFingertips(primary.fingertips);

    // Secondary hand
    setControlGesture(secondary.gesture);
    setControlLandmark(secondary.landmark);
    setControlFingertips(secondary.fingertips);
    setControlPinchDelta(secondary.pinchDelta);
    setControlAngleDelta(secondary.angleDelta);
  }, [interpreter, gesturesEnabled]);

  const handleSave = () => {
    const dataUrl = canvasRef.current?.save();
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `air-drawing-${Date.now()}.png`;
      link.click();
    }
  };

  // Determine active mode label for the HUD
  const activeMode = controlGesture !== CONTROL_GESTURES.IDLE
    ? controlGesture.replace('CTRL_', '')
    : gesture;

  return (
    <div className="app-container">
      {cameraVisible && (
        <CameraView
          onResults={onResults}
        />
      )}

      <DrawingCanvas
        ref={canvasRef}
        settings={settings}
        gesture={gesture}
        landmark={landmark}
        controlGesture={controlGesture}
        controlLandmark={controlLandmark}
        controlPinchDelta={controlPinchDelta}
        controlAngleDelta={controlAngleDelta}
      />

      <ControlPanel
        settings={settings}
        onSettingsChange={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
        onClear={() => canvasRef.current?.clear()}
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        onSave={handleSave}
        onToggleCamera={() => setCameraVisible(!cameraVisible)}
        cameraVisible={cameraVisible}
        gestureVisible={gesturesEnabled}
        onToggleGestures={() => setGesturesEnabled(!gesturesEnabled)}
        onHelp={() => setIsHelpOpen(true)}
      />

      <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Floating Gesture Status */}
      <AnimatePresence>
        {activeMode !== 'IDLE' && activeMode !== CONTROL_GESTURES.IDLE && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            className="gesture-status"
          >
            PROTOCOL: {activeMode.replace('_', ' ')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Hand Fingertip Indicators */}
      {fingertips.map((tip, i) => {
        if (!tip) return null;
        const x = (1 - tip.x) * window.innerWidth;
        const y = tip.y * window.innerHeight;

        let size = '8px';
        let opacity = 0.4;
        let color = settings.color;
        let shadow = `0 0 10px ${color}`;
        let border = 'none';

        if (i === 1) { // Index finger
          if (gesture === 'ERASE') {
            size = '48px';
            color = 'rgba(255, 0, 80, 0.1)';
            shadow = '0 0 20px rgba(255, 0, 80, 0.5), inset 0 0 10px rgba(255, 0, 80, 0.3)';
            border = '2px solid rgba(255, 0, 80, 0.5)';
            opacity = 1;
          } else {
            size = '14px';
            opacity = 1;
            shadow = `0 0 20px ${color}`;
            border = '2px solid #fff';
          }
        }

        return (
          <div
            key={`p-${i}`}
            style={{
              position: 'fixed',
              left: x, top: y,
              width: size, height: size,
              backgroundColor: color,
              border,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: shadow,
              opacity,
              zIndex: 40,
              pointerEvents: 'none',
              transition: 'all 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
            }}
          />
        );
      })}

      {/* Secondary Hand Fingertip Indicators */}
      {controlFingertips.map((tip, i) => {
        if (!tip) return null;
        const x = (1 - tip.x) * window.innerWidth;
        const y = tip.y * window.innerHeight;

        let size = '8px';
        let opacity = 0.3;
        let color = 'transparent';
        let shadow = '0 0 8px var(--secondary-glow)';
        let border = '1px solid var(--secondary)';

        if (i === 1) {
          size = '16px';
          opacity = 1;
          if (controlGesture === CONTROL_GESTURES.MOVE) {
            border = '2px solid var(--primary)';
            shadow = '0 0 20px var(--primary-glow)';
          } else if (controlGesture === CONTROL_GESTURES.SCALE) {
            border = '2px solid var(--secondary)';
            shadow = '0 0 20px var(--secondary-glow)';
          } else if (controlGesture === CONTROL_GESTURES.ROTATE) {
            border = '2px solid var(--accent)';
            shadow = '0 0 20px var(--accent-glow)';
          }
        }

        return (
          <div
            key={`s-${i}`}
            style={{
              position: 'fixed',
              left: x, top: y,
              width: size, height: size,
              backgroundColor: color,
              border,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: shadow,
              opacity,
              zIndex: 40,
              pointerEvents: 'none',
              transition: 'all 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
            }}
          />
        );
      })}

      {!landmark && !controlLandmark && (
        <div className="overlay-message">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            Initialize Neural Link: Raise Hand
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
