import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/limelight'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
