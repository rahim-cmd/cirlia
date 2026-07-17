import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import ScrollToTop from './components/ScrollToTop.jsx';
import { AuthProvider } from "./context/AuthContext";
import { PopupProvider } from "./context/PopupContext";
import { ToastProvider } from "./context/ToastContext";
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      < ScrollToTop/>
      <AuthProvider>
        <ToastProvider>
          <PopupProvider>
            <App />
          </PopupProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
