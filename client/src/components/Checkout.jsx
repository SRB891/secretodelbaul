import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Checkout({ producto, onVolver }) {
  const [clienteNombre, setClienteNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  if (!producto) {
    return (
      <div>
        <h2>Proceso de Checkout</h2>
        <p>Selecciona un producto desde el <strong>Catálogo</strong> para realizar tu pedido.</p>
        <button className="btn-primary" onClick={onVolver}>Ir al Catálogo</button>
      </div>
    );
  }

  const handleCompra = async (e) => {
    e.preventDefault();
    setError('');
    setProcesando(true);
    try {
      const res = await axios.post(`${API_URL}/checkout`, {
        producto_id: producto.id,
        cantidad: Number(cantidad),
        cliente_nombre: clienteNombre,
        direccion,
      });
      setPedidoConfirmado(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la transacción en el servidor');
    } finally {
      setProcesando(false);
    }
  };

  if (pedidoConfirmado) {
    return (
      <div className="confirmacion-card">
        <h2 className="confirmacion-titulo">¡Pedido Confirmado!</h2>
        <p><strong>Cliente:</strong> {pedidoConfirmado.cliente_nombre}</p>
        <p><strong>Total Pagado:</strong> ${Number(pedidoConfirmado.total).toLocaleString('es-CO')}</p>
        <p>
          <strong>Número de Guía Logística:</strong>{' '}
          <code className="guia-badge">{pedidoConfirmado.numero_guia}</code>
        </p>
        <p className="nota-texto">
          El inventario se ha actualizado automáticamente. Copia este número de guía para consultarlo en la sección <strong>Rastreo</strong>.
        </p>
        <button className="btn-primary" onClick={onVolver}>Volver al Catálogo</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Finalizar Compra</h2>
      <div className="resumen-box">
        <p><strong>Producto:</strong> {producto.nombre}</p>
        <p><strong>Precio Unitario:</strong> ${Number(producto.precio).toLocaleString('es-CO')} (Disponibles: {producto.stock_current})</p>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <form className="form-stack" onSubmit={handleCompra}>
        <label className="form-label">
          Nombre completo del cliente:
          <input
            className="form-input"
            type="text"
            placeholder="Ej: Laura Gómez"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Dirección de entrega:
          <input
            className="form-input"
            type="text"
            placeholder="Ej: Cra 43A # 10-20, Medellín"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Cantidad:
          <input
            className="form-input"
            type="number"
            min="1"
            max={producto.stock_current}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </label>

        <button className="btn-success" type="submit" disabled={procesando}>
          {procesando ? 'Procesando...' : `Confirmar Pedido ($${(Number(producto.precio) * cantidad).toLocaleString('es-CO')})`}
        </button>
        <button className="btn-secondary" type="button" onClick={onVolver}>Cancelar</button>
      </form>
    </div>
  );
}