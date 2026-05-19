import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { shop } from './app/config/shop';
import './styles/index.css';

document.title = shop.pageTitle;

createRoot(document.getElementById('root')!).render(<App />);
  