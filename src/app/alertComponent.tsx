// AlertComponent.tsx
import React from 'react';

interface AlertComponentProps {
  message: string;
  clearAlert: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ message, clearAlert }) => {
  if (!message) return null; // Render nothing if there's no message

  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-warning text-terminal rounded"
      role="alert"
    >
      {message}
      <button onClick={clearAlert} className="ml-4">Close</button>
    </div>
  );
};

export default AlertComponent;

