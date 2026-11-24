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

      <main>
        {vista === 'catalogo' && <Catalogo onSeleccionarProducto={irACheckout} />}
        {vista === 'checkout' && <Checkout producto={productoSeleccionado} onVolver={() => setVista('catalogo')} />}
        {vista === 'rastreo' && <Rastreo />}
        {vista === 'inventario' && <Inventario />}
      </main>
    </div>
  );
}