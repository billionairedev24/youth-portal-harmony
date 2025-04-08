
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react';

console.log("Application starting...");

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}
