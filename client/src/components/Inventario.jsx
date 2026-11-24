import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', categoria: '', precio: '', stock_current: '', imagen_url: '' });

  const cargarProductos = () => {
    axios.get(`${API_URL}/productos`)
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error cargando inventario:', err));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const crearProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/productos`, {
        ...nuevo,
        precio: Number(nuevo.precio),
        stock_current: Number(nuevo.stock_current),
      });
      setNuevo({ nombre: '', categoria: '', precio: '', stock_current: '', imagen_url: '' });
      cargarProductos();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar el producto');
    }
  };

 const actualizarStock = async (id, nuevoStock) => {
    if (nuevoStock < 0) return;
    try {
      await axios.put(`${API_URL}/productos/${id}`, { stock_current: Number(nuevoStock) });
      cargarProductos();
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      alert('Error al actualizar stock');
    }
  };

  const eliminarProducto = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este producto del inventario?')) return;
    try {
      await axios.delete(`${API_URL}/productos/${id}`);
      cargarProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('No se puede eliminar un producto que ya tiene pedidos asociados.');
    }
  };

  return (
    <div>
      <h2>Gestión de Inventario (Administrador)</h2>

      <form className="inventario-form" onSubmit={crearProducto}>
        <input
          className="form-input"
          placeholder="Nombre de la joya"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          required
        />
        <input
          className="form-input"
          placeholder="Categoría (Anillos, Collares...)"
          value={nuevo.categoria}
          onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
          required
        />
        <input
          className="form-input input-corto"
          type="number"
          placeholder="Precio COP"
          value={nuevo.precio}
          onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
          required
        />
        <input
          className="form-input input-corto"
          type="number"
          placeholder="Stock inicial"
          value={nuevo.stock_current}
          onChange={(e) => setNuevo({ ...nuevo, stock_current: e.target.value })}
          required
        />
        <input
          className="form-input input-flex"
          placeholder="URL Imagen (opcional)"
          value={nuevo.imagen_url}
          onChange={(e) => setNuevo({ ...nuevo, imagen_url: e.target.value })}
        />
        <button className="btn-primary" type="submit">+ Agregar Joya</button>
      </form>

      <table className="inventario-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>${Number(p.precio).toLocaleString('es-CO')}</td>
              <td><strong>{p.stock_current}</strong></td>
              <td className="acciones-celda">
                <button onClick={() => actualizarStock(p.id, p.stock_current + 1)}>+1</button>
                <button onClick={() => actualizarStock(p.id, p.stock_current - 1)} disabled={p.stock_current <= 0}>-1</button>
                <button className="btn-danger" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}