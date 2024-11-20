import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer, Zoom } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <ToastContainer transition={Zoom} />
  </>
)
