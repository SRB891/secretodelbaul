import { useState } from 'react';
import './App.css';
import Catalogo from './components/Catalogo';
import Checkout from './components/Checkout';
import Inventario from './components/Inventario';
import Rastreo from './components/Rastreo';

export default function App() {
  const [vista, setVista] = useState('catalogo');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const irACheckout = (producto) => {
    setProductoSeleccionado(producto);
    setVista('checkout');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1 className="app-title">El Secreto del Baúl</h1>
          <small className="app-subtitle">Joyería Artesanal & Comercio Electrónico</small>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-btn ${vista === 'catalogo' ? 'active' : ''}`}
            onClick={() => setVista('catalogo')}
          >
            Catálogo
          </button>
          <button
            className={`nav-btn ${vista === 'checkout' ? 'active' : ''}`}
            onClick={() => setVista('checkout')}
          >
            Checkout
          </button>
          <button
            className={`nav-btn ${vista === 'rastreo' ? 'active' : ''}`}
            onClick={() => setVista('rastreo')}
          >
            Rastreo
          </button>
          <button
            className={`nav-btn ${vista === 'inventario' ? 'active' : ''}`}
            onClick={() => setVista('inventario')}
          >
            Inventario (Admin)
          </button>
        </nav>
      </header>

      <main className="app-main">
        {vista === 'catalogo' && <Catalogo onSeleccionarProducto={irACheckout} />}
        {vista === 'checkout' && <Checkout producto={productoSeleccionado} onVolver={() => setVista('catalogo')} />}
        {vista === 'rastreo' && <Rastreo />}
        {vista === 'inventario' && <Inventario />}
      </main>

      <footer className="app-footer">
        <div className="footer-contenido">
          <div className="footer-col">
            <h3 className="footer-marca">El Secreto del Baúl</h3>
            <p className="footer-desc">
              Joyería artesanal hecha a mano con identidad única. Envíos seguros a toda Colombia.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitulo">Navegación</h4>
            <ul className="footer-links">
              <li><button type="button" onClick={() => setVista('catalogo')}>Catálogo</button></li>
              <li><button type="button" onClick={() => setVista('rastreo')}>Rastreo de Envío</button></li>
              <li><button type="button" onClick={() => setVista('inventario')}>Administración</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitulo">Contacto</h4>
            <p className="footer-info">Medellín, Antioquia - Colombia</p>
            <p className="footer-info">contacto@elsecretodelbaul.com</p>
            <p className="footer-info">WhatsApp: +57 300 000 0000</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} El Secreto del Baúl. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}