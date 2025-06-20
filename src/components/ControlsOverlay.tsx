
import React from 'react';

const ControlsOverlay: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-300">
      <p><strong>Controls:</strong></p>
      <p>• Click & drag to rotate</p>
      <p>• Scroll to zoom</p>
      <p>• Auto-rotation when idle</p>
    </div>
  );
};

export default ControlsOverlay;
