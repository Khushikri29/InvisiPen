import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Settings,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Eye,
  EyeOff,
  Zap,
  HelpCircle
} from 'lucide-react';
import './ControlPanel.css';

const COLORS = [
  { hex: '#00f2ff', name: 'Cyan' },
  { hex: '#7000ff', name: 'Purple' },
  { hex: '#ff007a', name: 'Pink' },
  { hex: '#00ff00', name: 'Green' },
  { hex: '#ffaa00', name: 'Gold' },
  { hex: '#ffffff', name: 'White' },
];

const ControlPanel = ({
  settings,
  onSettingsChange,
  onClear,
  onUndo,
  onRedo,
  onSave,
  onToggleCamera,
  cameraVisible,
  gestureVisible,
  onToggleGestures,
  onHelp
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="control-panel-wrapper">
      <motion.button
        className="glass-meta settings-toggle"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Settings"
      >
        <Settings size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="glass-meta panel-content"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Color Palette */}
            <section>
              <div className="panel-section-title">
                <Palette size={16} /> Appearance
              </div>
              <div className="color-grid">
                {COLORS.map((c) => (
                  <motion.div
                    key={c.hex}
                    whileHover={{ scale: 1.15, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSettingsChange({ color: c.hex, isEraser: false })}
                    className={`color-swatch ${settings.color === c.hex ? 'active' : ''}`}
                    style={{ 
                      backgroundColor: c.hex, 
                      color: c.hex,
                      '--swatch-glow': c.hex + '66'
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </section>

            {/* Layout & Precision */}
            <section className="slider-container">
              <div className="slider-group">
                <div className="slider-label">
                  <span>Brush Diameter</span>
                  <span className="slider-value">{settings.lineWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={settings.lineWidth}
                  onChange={(e) => onSettingsChange({ lineWidth: parseInt(e.target.value) })}
                  className="cyber-slider"
                  style={{ accentColor: settings.color }}
                />
              </div>
              <div className="slider-group">
                <div className="slider-label">
                  <span>Plasma Intensity</span>
                  <span className="slider-value">{settings.glowIntensity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.glowIntensity}
                  onChange={(e) => onSettingsChange({ glowIntensity: parseInt(e.target.value) })}
                  className="cyber-slider"
                  style={{ accentColor: settings.color }}
                />
              </div>
            </section>

            {/* Core Controls */}
            <section className="actions-grid">
              <ActionButton icon={<Undo2 size={18} />} label="Undo" onClick={onUndo} />
              <ActionButton icon={<Redo2 size={18} />} label="Redo" onClick={onRedo} />
              <ActionButton icon={<Trash2 size={18} />} label="Wipe Canvas" onClick={onClear} />
              <ActionButton icon={<Download size={18} />} label="Export PNG" onClick={onSave} />
              <ActionButton
                icon={cameraVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                label={cameraVisible ? "Hide Lens" : "Show Lens"}
                onClick={onToggleCamera}
              />
              <ActionButton
                icon={<Zap size={18} />}
                label={gestureVisible ? "Neural Active" : "Neural Off"}
                onClick={onToggleGestures}
                active={gestureVisible}
              />
            </section>

            {/* Secondary Actions */}
            <div style={{ marginTop: '-8px' }}>
              <ActionButton
                icon={<HelpCircle size={18} />}
                label="Gesture Protocol"
                onClick={onHelp}
                fullWidth
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, active = false, fullWidth = false }) => (
  <motion.button
    className={`action-btn ${active ? 'active' : ''}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={fullWidth ? { gridColumn: 'span 2' } : {}}
  >
    {icon}
    <span>{label}</span>
  </motion.button>
);

export default ControlPanel;
