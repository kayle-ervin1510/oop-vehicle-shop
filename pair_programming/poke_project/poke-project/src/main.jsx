import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Poke from './Poke.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Poke />
  </StrictMode>,
)
