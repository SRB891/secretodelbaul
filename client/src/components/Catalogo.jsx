import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const obtenerImagenLocal = (producto) => {
  if (producto.imagen_url && producto.imagen_url.startsWith('/img/')) {
    return producto.imagen_url;
  }
  const nombre = (producto.nombre || '').toLowerCase();
  if (nombre.includes('anillo')) return '/img/anillo.svg';
  if (nombre.includes('collar')) return '/img/collar.svg';
  if (nombre.includes('pulsera')) return '/img/pulsera.svg';
  return '/img/default.svg';
};

export default function Catalogo({ onSeleccionarProducto }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  useEffect(() => {
    axios.get(`${API_URL}/productos`)
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error cargando catálogo:', err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando catálogo desde PostgreSQL...</p>;

  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria).filter(Boolean))];
  const productosFiltrados = filtroCategoria === 'Todas'
    ? productos
    : productos.filter((p) => p.categoria === filtroCategoria);

  return (
    <div>
      <div className="catalogo-header">
        <h2 className="seccion-titulo">Catálogo de Joyería Artesanal</h2>
        <div className="filtro-box">
          <label className="filtro-label"><strong>Categoría:</strong></label>
          <select
            className="select-input"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="card-panel">
          <p>No hay productos registrados todavía. Agrega joyas desde la pestaña <strong>Inventario (Admin)</strong>.</p>
        </div>
      ) : (
        <div className="productos-grid">
          {productosFiltrados.map((prod) => (
            <div key={prod.id} className="producto-card">
              <div>
                <img
                  className="producto-img"
                  src={obtenerImagenLocal(prod)}
                  alt={prod.nombre}
                  onError={(e) => { e.target.src = '/img/default.svg'; }}
                />
                <span className="producto-categoria">{prod.categoria}</span>
                <h3 className="producto-titulo">{prod.nombre}</h3>
                <p className="producto-precio">${Number(prod.precio).toLocaleString('es-CO')}</p>
                <p className="producto-stock">Disponibles: <strong>{prod.stock_current}</strong> unidades</p>
              </div>
              <button
                disabled={prod.stock_current <= 0}
                onClick={() => onSeleccionarProducto(prod)}
                className={prod.stock_current > 0 ? 'btn-primary btn-full' : 'btn-disabled'}
              >
                {prod.stock_current > 0 ? 'Comprar ahora' : 'Agotado'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}