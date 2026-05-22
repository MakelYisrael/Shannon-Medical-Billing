import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Helper to check if error is expected (abort, network, offline, Firestore cleanup)
const isExpectedError = (error: unknown): boolean => {
  if (!error) return false;

  const errorString = String(error);
  const errorName = error instanceof Error ? error.name : '';

  return (
    // Abort/Signal errors
    errorName === 'AbortError' ||
    errorString.includes('AbortError') ||
    errorString.includes('signal is aborted') ||
    errorString.includes('aborted without reason') ||
    errorString.includes('The operation was aborted') ||

    // Network errors
    errorString.includes('Failed to fetch') ||
    errorString.includes('NetworkError') ||
    errorString.includes('The network connection was lost') ||
    errorString.includes('NETWORK_ERROR') ||

    // Firestore cleanup errors during navigation
    errorString.includes('__PRIVATE_StreamBridge') ||
    errorString.includes('Firestore') && errorString.includes('abort') ||

    // Navigation/unmount related
    errorString.includes('Component was unmounted') ||
    errorString.includes('cleanupFn')
  );
};

// Suppress unhandled rejections for expected errors
window.addEventListener('unhandledrejection', (event) => {
  if (isExpectedError(event.reason)) {
    event.preventDefault();
  }
});

// Suppress error events
window.addEventListener('error', (event) => {
  if (isExpectedError(event.error) || isExpectedError(event.message)) {
    event.preventDefault();
  }
}, true);

// Override console methods to suppress expected errors
const createConsoleWrapper = (original: Function) => {
  return function(...args: any[]) {
    if (args.some(arg => isExpectedError(arg))) {
      return;
    }
    original.apply(console, args);
  };
};

console.error = createConsoleWrapper(console.error);
console.warn = createConsoleWrapper(console.warn);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
