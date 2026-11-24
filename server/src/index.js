import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor Express conectado correctamente' });
});

// RF-01: Consultar Catálogo de Productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

// RF-03: Registrar nuevo producto (CRUD Admin)
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, categoria, precio, stock_current, imagen_url } = req.body;
    const result = await pool.query(
      'INSERT INTO productos (nombre, categoria, precio, stock_current, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, categoria, precio, stock_current, imagen_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar producto' });
  }
});

// RF-03: Actualizar Stock de producto (CRUD Admin)
app.put('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_current } = req.body;
    const result = await pool.query(
      'UPDATE productos SET stock_current = $1 WHERE id = $2 RETURNING *',
      [stock_current, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
});

// RF-02: Checkout y Descuento Atómico de Inventario (Transacción ACID)
app.post('/api/checkout', async (req, res) => {
  const client = await pool.connect();
  try {
    const { producto_id, cantidad, cliente_nombre, direccion } = req.body;
    await client.query('BEGIN');

    const prodRes = await client.query('SELECT * FROM productos WHERE id = $1 FOR UPDATE', [producto_id]);
    const producto = prodRes.rows[0];

    if (!producto || producto.stock_current < cantidad) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Stock insuficiente en base de datos. Transacción abortada.' });
    }

    await client.query(
      'UPDATE productos SET stock_current = stock_current - $1 WHERE id = $2',
      [cantidad, producto_id]
    );

    const guia = `GUIA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = Number(producto.precio) * Number(cantidad);

    const pedidoRes = await client.query(
      'INSERT INTO pedidos (cliente_nombre, direccion, total, numero_guia) VALUES ($1, $2, $3, $4) RETURNING *',
      [cliente_nombre, direccion, total, guia]
    );

    const pedido = pedidoRes.rows[0];

    await client.query(
      'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
      [pedido.id, producto_id, cantidad, producto.precio, total]
    );

    await client.query('COMMIT');
    res.status(201).json(pedido);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error procesando la compra' });
  } finally {
    client.release();
  }
});

// RF-04: Consulta de Rastreo Logístico por Guía
app.get('/api/rastreo/:guia', async (req, res) => {
  try {
    const { guia } = req.params;
    const result = await pool.query('SELECT * FROM pedidos WHERE numero_guia = $1', [guia]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Número de guía no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar la guía' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});