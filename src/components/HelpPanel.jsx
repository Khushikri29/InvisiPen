import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Shield, Move, Sparkles } from 'lucide-react';
import './HelpPanel.css';

const gestures = [
  {
    section: 'Dominant Hand (Interaction)',
    icon: <Sparkles size={12} />,
    items: [
      { emoji: '☝️', gesture: 'Apex Indicator', action: 'Input digital plasma strokes' },
      { emoji: '🤏', gesture: 'Pinch Compression', action: 'Focused area erasure' },
      { emoji: '✊', gesture: 'Closed Fist', action: 'Total canvas purge' },
    ],
  },
  {
    section: 'Secondary Hand (Manipulation)',
    icon: <Move size={12} />,
    items: [
      { emoji: '✌️', gesture: 'Dual Vector', action: 'Select and translate stroke' },
      { emoji: '🤏', gesture: 'Radial Pinch', action: 'Scale selected element' },
      { emoji: '🖐️', gesture: 'Open Array', action: 'Rotate element (axis twist)' },
    ],
  },
  {
    section: 'Interface Protocols',
    icon: <Shield size={12} />,
    items: [
      { emoji: '📡', gesture: 'Signal Loss', action: 'Lasting path persistence' },
      { emoji: '📐', gesture: 'Snap Grid', action: 'Rotation auto-alignment' },
      { emoji: '✨', gesture: 'Glow Engine', action: 'Visual path enhancement' },
    ],
  },
];

export default function HelpPanel({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="help-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-meta help-modal"
          >
            {/* Header */}
            <header className="help-header">
              <div className="help-title">
                <HelpCircle size={22} />
                <span>Protocol Guide</span>
              </div>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </header>

            {/* Gesture Sections */}
            <div className="help-content">
              {gestures.map((section, sIdx) => (
                <div key={sIdx} className="help-section">
                  <div className="section-label">
                    {section.icon} {section.section}
                  </div>
                  {section.items.map((item, iIdx) => (
                    <motion.div
                      key={iIdx}
                      className="gesture-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (sIdx * 0.1) + (iIdx * 0.05) }}
                    >
                      <span className="gesture-emoji">{item.emoji}</span>
                      <div className="gesture-info">
                        <div className="gesture-name">{item.gesture}</div>
                        <div className="gesture-action">{item.action}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '24px', textAlign: 'center', opacity: 0.3, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              System v2.0 // Neural Interface Active
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
