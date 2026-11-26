import { describe, it, expect } from 'vitest';

// Funciones de lógica de negocio extraídas/validadas del servidor
function validarDatosRegistro({ nombre, email, password }) {
  if (!nombre || !email || !password) return { valido: false, error: 'Todos los campos son obligatorios' };
  return {
    valido: true,
    datos: { nombre: nombre.trim(), email: email.trim().toLowerCase(), password, rol: 'cliente' },
  };
}

function puedeAccederInventario(usuario) {
  return usuario?.rol === 'admin';
}

function calcularOrdenCheckout(producto, cantidad) {
  if (!producto || producto.stock_current < cantidad || cantidad <= 0) {
    throw new Error('Stock insuficiente en base de datos. Transacción abortada.');
  }
  const total = Number(producto.precio) * Number(cantidad);
  const nuevoStock = producto.stock_current - cantidad;
  const guia = `GUIA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  return { total, nuevoStock, guia };
}

function buscarGuiaEnPedidos(pedidos, numeroGuia) {
  const encontrado = pedidos.find((p) => p.numero_guia === numeroGuia);
  if (!encontrado) return { status: 404, error: 'Número de guía no encontrado' };
  return { status: 200, data: encontrado };
}

describe('Pruebas Unitarias - Lógica Backend El Secreto del Baúl', () => {
  it('RF-05: rechaza registro si falta algún campo obligatorio', () => {
    const res = validarDatosRegistro({ nombre: 'Laura', email: '', password: '123' });
    expect(res.valido).toBe(false);
  });

  it('RF-05: normaliza el correo y asigna rol "cliente" por defecto', () => {
    const res = validarDatosRegistro({ nombre: '  Laura Gómez ', email: ' LAURA@Test.COM ', password: '123' });
    expect(res.valido).toBe(true);
    expect(res.datos.email).toBe('laura@test.com');
    expect(res.datos.rol).toBe('cliente');
  });

  it('RF-03 / RF-05: permite acceso a Inventario solo a usuarios con rol "admin"', () => {
    expect(puedeAccederInventario({ nombre: 'Admin', rol: 'admin' })).toBe(true);
    expect(puedeAccederInventario({ nombre: 'Cliente', rol: 'cliente' })).toBe(false);
    expect(puedeAccederInventario(null)).toBe(false);
  });

  it('RF-02: calcula total, descuenta stock y genera guía GUIA-2026-XXXX en compra válida', () => {
    const producto = { id: 1, nombre: 'Collar Esmeralda', precio: 85000, stock_current: 9 };
    const orden = calcularOrdenCheckout(producto, 2);
    expect(orden.total).toBe(170000);
    expect(orden.nuevoStock).toBe(7);
    expect(orden.guia).toMatch(/^GUIA-2026-\d{4}$/);
  });

  it('RF-02: aborta transacción cuando la cantidad supera el stock disponible', () => {
    const producto = { id: 3, nombre: 'Anillo Filigrana', precio: 60000, stock_current: 3 };
    expect(() => calcularOrdenCheckout(producto, 5)).toThrow(/Stock insuficiente/);
  });

  it('RF-04: consulta correctamente una guía existente y devuelve 404 si no existe', () => {
    const pedidosMock = [{ id: 1, cliente_nombre: 'Laura', numero_guia: 'GUIA-2026-4821', total: 85000 }];
    expect(buscarGuiaEnPedidos(pedidosMock, 'GUIA-2026-4821').status).toBe(200);
    expect(buscarGuiaEnPedidos(pedidosMock, 'GUIA-2026-9999').status).toBe(404);
  });
});