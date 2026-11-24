import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Rastreo() {
  const [guia, setGuia] = useState('');
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState('');

  const buscarGuia = async (e) => {
    e.preventDefault();
    setError('');
    setPedido(null);
    try {
      const res = await axios.get(`${API_URL}/rastreo/${guia.trim()}`);
      setPedido(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Número de guía no encontrado en el sistema');
    }
  };

  return (
    <div className="rastreo-container">
      <h2>Rastreo Logístico de Envíos</h2>
      <p>Ingresa el código de guía generado tras tu compra para consultar el estado del despacho:</p>

      <form className="rastreo-form" onSubmit={buscarGuia}>
        <input
          className="form-input rastreo-input"
          type="text"
          placeholder="Ej: GUIA-2026-1234"
          value={guia}
          onChange={(e) => setGuia(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">Consultar Guía</button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {pedido && (
        <div className="rastreo-card">
          <h3 className="rastreo-titulo">Detalle del Envío</h3>
          <p><strong>Número de Guía:</strong> {pedido.numero_guia}</p>
          <p><strong>Cliente:</strong> {pedido.cliente_nombre}</p>
          <p><strong>Dirección de Entrega:</strong> {pedido.direccion}</p>
          <p><strong>Estado Actual:</strong> <span className="estado-envio">{pedido.estado_envio}</span></p>
          <p><strong>Total del Pedido:</strong> ${Number(pedido.total).toLocaleString('es-CO')}</p>
        </div>
      )}
    </div>
  );
}