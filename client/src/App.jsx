import { useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import Catalogo from './components/Catalogo';
import Checkout from './components/Checkout';
import Inventario from './components/Inventario';
import Rastreo from './components/Rastreo';

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario_baul');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [vista, setVista] = useState('catalogo');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const manejarLogin = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuario_baul', JSON.stringify(datosUsuario));
    setVista('catalogo');
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario_baul');
    setVista('catalogo');
  };

  const irACheckout = (producto) => {
    setProductoSeleccionado(producto);
    setVista('checkout');
  };

  const esAdmin = usuario?.rol === 'admin';

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1 className="app-title">El Secreto del Baúl</h1>
          <small className="app-subtitle">Joyería Artesanal & Comercio Electrónico</small>
        </div>

        {usuario && (
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

            {esAdmin && (
              <button
                className={`nav-btn ${vista === 'inventario' ? 'active' : ''}`}
                onClick={() => setVista('inventario')}
              >
                Inventario (Admin)
              </button>
            )}

            <button className="nav-btn btn-salir" onClick={cerrarSesion} title={`Sesión: ${usuario.nombre}`}>
              Salir ({usuario.nombre.split(' ')[0]})
            </button>
          </nav>
        )}
      </header>

      <main className="app-main">
        {!usuario ? (
          <Auth onLoginExitoso={manejarLogin} />
        ) : (
          <>
            {vista === 'catalogo' && <Catalogo onSeleccionarProducto={irACheckout} />}
            {vista === 'checkout' && <Checkout producto={productoSeleccionado} onVolver={() => setVista('catalogo')} />}
            {vista === 'rastreo' && <Rastreo />}
            {vista === 'inventario' && (
              esAdmin ? (
                <Inventario />
              ) : (
                <div className="card-panel">
                  <p className="error-msg">Acceso denegado: esta sección es exclusiva para administradores.</p>
                </div>
              )
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-contenido">
          <div className="footer-col">
            <h3 className="footer-marca">El Secreto del Baúl</h3>
            <p className="footer-desc">
              Joyería artesanal hecha a mano con identidad única. Envíos seguros a toda Colombia.
            </p>
          </div>

          {usuario && (
            <div className="footer-col">
              <h4 className="footer-subtitulo">Navegación</h4>
              <ul className="footer-links">
                <li><button type="button" onClick={() => setVista('catalogo')}>Catálogo</button></li>
                <li><button type="button" onClick={() => setVista('rastreo')}>Rastreo de Envío</button></li>
                {esAdmin && (
                  <li><button type="button" onClick={() => setVista('inventario')}>Administración</button></li>
                )}
              </ul>
            </div>
          )}

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